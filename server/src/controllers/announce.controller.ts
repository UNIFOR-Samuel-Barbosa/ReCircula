import type { Request, Response } from "express";

import * as announceService from "../services/announce.service.js";

import { announceFiltersSchema } from "../schemas/filters.schema.js";

import type { Params } from "../types/params.types.js";

export async function getAll(req: Request, res: Response) {
	const filters = announceFiltersSchema.parse(req.query);

	const announces = await announceService.findAll(filters);

	res.json(announces);
}

export async function getById(req: Request<Params>, res: Response) {
	const announce = await announceService.findById(req.params.id);

	res.json(announce);
}

export async function getByUserId(req: Request<Params>, res: Response) {
	const announce = await announceService.findByUserId(req.params.id);

	res.json(announce);
}

export async function getMine(req: Request, res: Response) {
	const filters = announceFiltersSchema.parse(req.query);

	filters.user_id = req.user.id;

	const announces = await announceService.findAll(filters);

	res.json(announces);
}

export async function getCategories(req: Request, res: Response) {
	const categories = await announceService.findCategories();

	res.json(categories);
}

export async function getMyCategories(req: Request, res: Response) {
	const categories = await announceService.findCategories(req.user.id);

	res.json(categories);
}

export async function create(req: Request, res: Response) {
	const announce = await announceService.create(req.user.id, req.body);

	res.status(201).json(announce);
}

export async function update(req: Request<Params>, res: Response) {
	const announce = await announceService.update(
		req.params.id,
		req.user.id,
		req.body
	);

	res.json(announce);
}

export async function remove(req: Request<Params>, res: Response) {
	await announceService.remove(req.params.id, req.user.id);

	res.status(204).send();
}
