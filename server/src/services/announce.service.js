import * as announceRepository from "../repositories/announce.repository.js";

import { AppError } from "../utils/AppError.js";

async function getOwnedAnnounce(announceId, userId, userRole) {
	const announce = await announceRepository.findById(announceId);

	if (!announce) {
		throw new AppError("Anúncio não encontrado.", 404);
	}

	if (announce.user_id !== userId && userRole !== "admin") {
		throw new AppError(
			"Você não tem permissão para modificar este anúncio.",
			403
		);
	}

	return announce;
}

export async function findAll(filters) {
	return announceRepository.findAll(filters);
}

export async function findById(id) {
	const announce = await announceRepository.findById(id);

	if (!announce) {
		throw new AppError("Anúncio não encontrado.", 404);
	}

	return announce;
}

export async function findByUserId(id) {
	const announces = await announceRepository.findByUserId(id);

	return announces;
}

export async function findCategories(userId) {
	return announceRepository.findCategories(userId);
}

export async function create(userId, data) {
	if (!data.donation && (data.price == null || data.price < 0)) {
		throw new AppError("Preço inválido.");
	}

	return announceRepository.create({
		...data,
		id: crypto.randomUUID(),
		user_id: userId,
		donation: data.donation ?? false,
		price: data.donation ? null : data.price,
	});
}

export async function update(announceId, userId, data, userRole) {
	await getOwnedAnnounce(announceId, userId, userRole);

	const updateData = { ...data };

	if (updateData.donation === true) {
		updateData.price = null;
	} else if (updateData.donation === false) {
		if (
			updateData.price !== undefined &&
			(updateData.price === null || updateData.price < 0)
		) {
			throw new AppError("Preço inválido.");
		}
	} else if (
		updateData.price !== undefined &&
		updateData.price !== null &&
		updateData.price < 0
	) {
		throw new AppError("Preço inválido.");
	}

	return announceRepository.update(announceId, updateData);
}

export async function remove(announceId, userId, userRole) {
	await getOwnedAnnounce(announceId, userId, userRole);

	await announceRepository.remove(announceId);
}

