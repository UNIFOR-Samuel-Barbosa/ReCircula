import * as announceRepository from "../repositories/announce.repository.js";

import { AppError } from "../utils/AppError.js";

import type { AnnounceFilters } from "../types/announce.types.js";

import type {
	CreateAnnounceDTO,
	UpdateAnnounceDTO,
} from "../types/announce.types.js";

async function getOwnedAnnounce(announceId: string, userId: string) {
	const announce = await announceRepository.findById(announceId);

	if (!announce) {
		throw new AppError("Anúncio não encontrado.", 404);
	}

	if (announce.user_id !== userId) {
		throw new AppError(
			"Você não tem permissão para modificar este anúncio.",
			403
		);
	}

	return announce;
}

export async function findAll(filters: AnnounceFilters) {
	return announceRepository.findAll(filters);
}

export async function findById(id: string) {
	const announce = await announceRepository.findById(id);

	if (!announce) {
		throw new AppError("Anúncio não encontrado.", 404);
	}

	return announce;
}

export async function findByUserId(id: string) {
	const announces = await announceRepository.findByUserId(id);

	return announces;
}

export async function findCategories(userId?: string) {
	return announceRepository.findCategories(userId);
}

export async function create(userId: string, data: CreateAnnounceDTO) {
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

export async function update(
	announceId: string,
	userId: string,
	data: UpdateAnnounceDTO
) {
	await getOwnedAnnounce(announceId, userId);

	if (data.price !== undefined && data.price !== null && data.price < 0) {
		throw new AppError("Preço inválido.");
	}

	return announceRepository.update(announceId, data);
}

export async function remove(announceId: string, userId: string) {
	await getOwnedAnnounce(announceId, userId);

	await announceRepository.remove(announceId);
}
