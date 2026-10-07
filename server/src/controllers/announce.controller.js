import * as announceService from "../services/announce.service.js";

import { announceFiltersSchema } from "../schemas/filters.schema.js";

export async function getAll(req, res) {
	const filters = announceFiltersSchema.parse(req.query);

	const announces = await announceService.findAll(filters);

	res.json(announces);
}

export async function getById(req, res) {
	const announce = await announceService.findById(req.params.id);

	res.json(announce);
}

export async function getByUserId(req, res) {
	const announce = await announceService.findByUserId(req.params.id);

	res.json(announce);
}

export async function getMine(req, res) {
	const filters = announceFiltersSchema.parse(req.query);

	filters.user_id = req.user.id;

	const announces = await announceService.findAll(filters);

	res.json(announces);
}

export async function getCategories(req, res) {
	const categories = await announceService.findCategories();

	res.json(categories);
}

export async function getMyCategories(req, res) {
	const categories = await announceService.findCategories(req.user.id);

	res.json(categories);
}

export async function create(req, res) {
	const announce = await announceService.create(req.user.id, req.body);

	res.status(201).json(announce);
}

export async function update(req, res) {
	const announce = await announceService.update(
		req.params.id,
		req.user.id,
		req.body
	);

	res.json(announce);
}

export async function remove(req, res) {
	await announceService.remove(req.params.id, req.user.id);

	res.status(204).send();
}

