import crypto from "node:crypto";

import jwt from "jsonwebtoken";

import { authConfig } from "../config/auth.js";

export function signAccessToken(user) {
	return jwt.sign({ role: user.role }, authConfig.jwtSecret, {
		subject: user.id,
		expiresIn: authConfig.accessTokenExpiresIn,
		algorithm: "HS256",
	});
}

export function verifyAccessToken(token) {
	const payload = jwt.verify(token, authConfig.jwtSecret, {
		algorithms: ["HS256"],
	});

	return {
		id: payload.sub,
		role: payload.role,
	};
}

// Tokens opacos (renovação e recuperação de senha): o cliente recebe o valor
// aleatório e o banco guarda apenas o hash SHA-256.
export function generateOpaqueToken() {
	return crypto.randomBytes(32).toString("base64url");
}

export function hashToken(token) {
	return crypto.createHash("sha256").update(token).digest("hex");
}
