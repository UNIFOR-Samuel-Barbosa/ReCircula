import { AppError } from "../utils/AppError.js";

// Usar sempre depois de authenticate.
export function requireAdmin(req, _res, next) {
	if (req.user?.role !== "admin") {
		throw new AppError("Acesso restrito a administradores.", 403);
	}

	next();
}
