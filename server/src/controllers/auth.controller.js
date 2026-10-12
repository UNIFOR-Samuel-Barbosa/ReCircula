import * as authService from "../services/auth.service.js";

export async function register(req, res) {
	const session = await authService.register(req.body);

	res.status(201).json(session);
}

export async function registerAdmin(req, res) {
	const session = await authService.registerAdmin(req.body);

	res.status(201).json(session);
}

export async function login(req, res) {
	const session = await authService.login(req.body);

	res.json(session);
}

export async function refresh(req, res) {
	const session = await authService.refresh(req.body.refreshToken);

	res.json(session);
}

export async function logout(req, res) {
	await authService.logout(req.body.refreshToken);

	res.status(204).send();
}

export async function forgotPassword(req, res) {
	await authService.forgotPassword(req.body.email);

	res.json({
		message:
			"Se o e-mail estiver cadastrado, você receberá um link para redefinir a senha.",
	});
}

export async function resetPassword(req, res) {
	await authService.resetPassword(req.body);

	res.status(204).send();
}
