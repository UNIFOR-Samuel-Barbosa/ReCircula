import { AppError } from "../utils/AppError.js";

export function errorMiddleware(error, _req, res, _next) {
	if (error instanceof AppError) {
		return res.status(error.statusCode).json({
			error: error.message,
		});
	}

	console.error(error);

	return res.status(500).json({
		error: "Erro interno do servidor.",
	});
}

