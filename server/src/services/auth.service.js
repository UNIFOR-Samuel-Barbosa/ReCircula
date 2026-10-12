import crypto from "node:crypto";

import bcrypt from "bcryptjs";

import { authConfig } from "../config/auth.js";

import * as profileRepository from "../repositories/profile.repository.js";
import * as refreshTokenRepository from "../repositories/refresh-token.repository.js";
import * as passwordResetRepository from "../repositories/password-reset.repository.js";

import * as tokenService from "./token.service.js";
import * as mailService from "./mail.service.js";

import { AppError } from "../utils/AppError.js";

const UNIQUE_VIOLATION = "23505";

// Usado quando o e-mail não existe, para que o login leve o mesmo tempo
// e não revele quais e-mails estão cadastrados.
const DUMMY_HASH = bcrypt.hashSync("recircula-dummy", authConfig.bcryptRounds);

function addMinutes(minutes) {
	return new Date(Date.now() + minutes * 60 * 1000).toISOString();
}

function isExpired(timestamp) {
	return new Date(timestamp).getTime() <= Date.now();
}

function invalidSession() {
	return new AppError("Sessão inválida ou expirada.", 401);
}

async function createSession(user) {
	const refreshToken = tokenService.generateOpaqueToken();

	await refreshTokenRepository.create({
		user_id: user.id,
		token_hash: tokenService.hashToken(refreshToken),
		expires_at: addMinutes(authConfig.refreshTokenDays * 24 * 60),
	});

	const { password_hash: _passwordHash, ...profile } = user;

	return {
		user: profile,
		accessToken: tokenService.signAccessToken(user),
		refreshToken,
	};
}

async function createAccount({ name, email, password }, role) {
	const existing = await profileRepository.findByEmail(email);

	if (existing) {
		throw new AppError("E-mail já cadastrado.", 409);
	}

	const passwordHash = await bcrypt.hash(password, authConfig.bcryptRounds);

	try {
		const user = await profileRepository.create({
			name,
			email,
			password_hash: passwordHash,
			role,
		});

		return createSession(user);
	} catch (error) {
		// Dois cadastros simultâneos com o mesmo e-mail
		if (error?.code === UNIQUE_VIOLATION) {
			throw new AppError("E-mail já cadastrado.", 409);
		}

		throw error;
	}
}

function isValidAdminCode(code) {
	if (!authConfig.adminSignupCode) return false;

	// Compara os hashes para ter tamanho fixo e tempo constante.
	return crypto.timingSafeEqual(
		Buffer.from(tokenService.hashToken(code)),
		Buffer.from(tokenService.hashToken(authConfig.adminSignupCode))
	);
}

export async function register(data) {
	return createAccount(data, "user");
}

export async function registerAdmin({ accessCode, ...data }) {
	if (!isValidAdminCode(accessCode)) {
		throw new AppError("Código de acesso inválido.", 403);
	}

	return createAccount(data, "admin");
}

export async function login({ email, password }) {
	const user = await profileRepository.findByEmailWithPassword(email);

	const passwordMatches = await bcrypt.compare(
		password,
		user?.password_hash ?? DUMMY_HASH
	);

	if (!user || !passwordMatches) {
		throw new AppError("E-mail ou senha inválidos.", 401);
	}

	return createSession(user);
}

export async function refresh(refreshToken) {
	const stored = await refreshTokenRepository.findByHash(
		tokenService.hashToken(refreshToken)
	);

	if (!stored) {
		throw invalidSession();
	}

	// Token já revogado sendo reutilizado: provavelmente foi roubado.
	// Encerra todas as sessões do usuário.
	if (stored.revoked_at) {
		await refreshTokenRepository.revokeAllByUser(stored.user_id);

		throw invalidSession();
	}

	if (isExpired(stored.expires_at)) {
		throw invalidSession();
	}

	const revoked = await refreshTokenRepository.revoke(stored.id);

	if (!revoked) {
		throw invalidSession();
	}

	const user = await profileRepository.findById(stored.user_id);

	if (!user) {
		throw invalidSession();
	}

	return createSession(user);
}

export async function logout(refreshToken) {
	const stored = await refreshTokenRepository.findByHash(
		tokenService.hashToken(refreshToken)
	);

	if (stored && !stored.revoked_at) {
		await refreshTokenRepository.revoke(stored.id);
	}
}

export async function forgotPassword(email) {
	const user = await profileRepository.findByEmail(email);

	// Mesma resposta exista ou não o e-mail.
	if (!user) return;

	await passwordResetRepository.invalidateAllByUser(user.id);

	const token = tokenService.generateOpaqueToken();

	await passwordResetRepository.create({
		user_id: user.id,
		token_hash: tokenService.hashToken(token),
		expires_at: addMinutes(authConfig.passwordResetMinutes),
	});

	const link = `${authConfig.frontendUrl}/redefinir-senha?token=${token}`;

	// Sem await: o tempo de resposta não deve depender do envio do e-mail.
	mailService.sendPasswordResetEmail(user.email, link).catch((error) => {
		console.error("Falha ao enviar e-mail de recuperação:", error);
	});
}

export async function resetPassword({ token, password }) {
	const invalidLink = new AppError(
		"Link de recuperação inválido ou expirado.",
		400
	);

	const reset = await passwordResetRepository.findByHash(
		tokenService.hashToken(token)
	);

	if (!reset || reset.used_at || isExpired(reset.expires_at)) {
		throw invalidLink;
	}

	const marked = await passwordResetRepository.markUsed(reset.id);

	if (!marked) {
		throw invalidLink;
	}

	const passwordHash = await bcrypt.hash(password, authConfig.bcryptRounds);

	await profileRepository.updatePassword(reset.user_id, passwordHash);

	// Encerra todas as sessões abertas com a senha antiga.
	await refreshTokenRepository.revokeAllByUser(reset.user_id);
}
