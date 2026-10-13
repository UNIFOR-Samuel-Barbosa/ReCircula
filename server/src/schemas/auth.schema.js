import { z } from "zod";

const email = z
	.string({ error: "E-mail é obrigatório." })
	.trim()
	.toLowerCase()
	.pipe(z.email("E-mail inválido."));

// bcrypt considera apenas os primeiros 72 bytes da senha.
const password = z
	.string({ error: "Senha é obrigatória." })
	.min(8, "A senha deve ter pelo menos 8 caracteres.")
	.max(72, "A senha deve ter no máximo 72 caracteres.");

const name = z
	.string({ error: "Nome é obrigatório." })
	.trim()
	.min(2, "Nome deve ter pelo menos 2 caracteres.")
	.max(100, "Nome deve ter no máximo 100 caracteres.");

const token = (message) => z.string({ error: message }).trim().min(1, message);

export const registerSchema = z.object({
	name,
	email,
	password,
});

export const registerAdminSchema = registerSchema.extend({
	accessCode: token("Código de acesso é obrigatório."),
});

export const loginSchema = z.object({
	email,
	password: z
		.string({ error: "Senha é obrigatória." })
		.min(1, "Senha é obrigatória."),
});

export const refreshTokenSchema = z.object({
	refreshToken: token("Token de renovação é obrigatório."),
});

export const forgotPasswordSchema = z.object({
	email,
});

export const resetPasswordSchema = z.object({
	token: token("Token de recuperação é obrigatório."),
	password,
});
