import type { Request, Response } from "express";

import * as profileService from "../services/profile.service.js";

import type { Params } from "../types/params.types.js";

export async function getMe(req: Request, res: Response) {
	const profile = await profileService.findById(req.user.id);

	res.json(profile);
}

export async function getById(req: Request<Params>, res: Response) {
	const profile = await profileService.findById(req.params.id);

	res.json(profile);
}

export async function update(req: Request, res: Response) {
	const profile = await profileService.update(req.user.id, req.body);

	res.json(profile);
}