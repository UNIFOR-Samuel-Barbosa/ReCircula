import type { Request, Response, NextFunction } from "express";

import { AppError } from "../utils/AppError.js";

export function errorMiddleware(
	error: Error,
	_req: Request,
	res: Response,
	_next: NextFunction
) {
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
