import * as profileRepository from "../repositories/profile.repository.js";

import { AppError } from "../utils/AppError.js";

export async function findById(id) {
	const profile = await profileRepository.findById(id);

	if (!profile) {
		throw new AppError("Perfil não encontrado.", 404);
	}

	return profile;
}

export async function update(id, data) {
	const profile = await findById(id);

	return profileRepository.update(profile.id, data);
}

export async function findAll() {
	return profileRepository.findAll();
}

export async function remove(id) {
	await findById(id);
	await profileRepository.remove(id);
}

