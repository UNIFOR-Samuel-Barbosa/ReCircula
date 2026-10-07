import * as profileService from "../services/profile.service.js";

export async function getMe(req, res) {
	const profile = await profileService.findById(req.user.id);

	res.json(profile);
}

export async function getById(req, res) {
	const profile = await profileService.findById(req.params.id);

	res.json(profile);
}

export async function update(req, res) {
	const profile = await profileService.update(req.user.id, req.body);

	res.json(profile);
}

