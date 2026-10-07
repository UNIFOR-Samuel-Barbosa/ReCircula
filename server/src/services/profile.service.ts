import * as profileRepository from "../repositories/profile.repository.js";

import type { UpdateProfileDTO } from "../types/profile.types.js";

import { AppError } from "../utils/AppError.js";

export async function findById(id: string) {
	const profile = await profileRepository.findById(id);

	if (!profile) {
		throw new AppError("Perfil não encontrado.", 404);
	}

	return profile;
}

export async function update(id: string, data: UpdateProfileDTO) {
	const profile = await findById(id);

	return profileRepository.update(profile.id, data);
}