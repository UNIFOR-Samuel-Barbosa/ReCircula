import type { Request, Response, NextFunction } from "express";

import { supabase } from "../config/supabase.js";

import { AppError } from "../utils/AppError.js";

export async function authenticate(
	req: Request,
	_res: Response,
	next: NextFunction
) {
	try {
		const authorization = req.headers.authorization;

		if (!authorization) {
			throw new AppError("Token não informado.", 401);
		}

		const token = authorization.replace("Bearer ", "");

		const {
			data: { user },
			error,
		} = await supabase.auth.getUser(token);

		if (error?.name === "AuthRetryableFetchError") {
			throw new AppError("Falha temporária ao validar autenticação.", 503);
		}

		if (error) {
			throw new AppError(error.message, 401);
		}

		if (!user) {
			throw new AppError("Token inválido.", 401);
		}

		req.user = user;

		next();
	} catch (error) {
		console.error("AUTH ERROR:", error);

		throw error;
	}
}
