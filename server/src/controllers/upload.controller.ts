import type { Request, Response } from "express";

import * as storageService from "../services/storage.service.js";

export async function upload(req: Request, res: Response) {
	const url = await storageService.uploadImage(req.file!);

	res.status(201).json({
		url,
	});
}