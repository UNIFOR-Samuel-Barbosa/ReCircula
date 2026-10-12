import { verifyAccessToken } from "../services/token.service.js";

import { AppError } from "../utils/AppError.js";

export function authenticate(req, _res, next) {
	const [scheme, token] = req.headers.authorization?.split(" ") ?? [];

	if (scheme !== "Bearer" || !token) {
		throw new AppError("Token não informado.", 401);
	}

	try {
		req.user = verifyAccessToken(token);
	} catch {
		throw new AppError("Token inválido ou expirado.", 401);
	}

	next();
}
