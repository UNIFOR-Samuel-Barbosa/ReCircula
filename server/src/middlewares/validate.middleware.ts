import type { Request, Response, NextFunction } from "express";

import type { ZodType } from "zod";
import { AppError } from "../utils/AppError.js";

export function validate(schema: ZodType) {
	return (req: Request, _res: Response, next: NextFunction) => {
		const result = schema.safeParse(req.body);

		if (!result.success) {
			return next(
				new AppError(
					result.error.issues.map((issue) => issue.message).join(", "),
					400
				)
			);
		}

		req.body = result.data;

		next();
	};
}
