import { supabase } from "../config/supabase.js";

import type {
	Announce,
	AnnounceFilters,
	CreateAnnounceDTO,
	UpdateAnnounceDTO,
	CategoryRow,
} from "../types/announce.types.js";

export async function findAll(filters: AnnounceFilters) {
	let query = supabase.from("announces").select(`
		*,
		user:profiles(
				id,
				name,
				photo_url
		)
	`);

	if (filters.category) {
		query = query.eq("category", filters.category);
	}

	if (filters.donation !== undefined) {
		query = query.eq("donation", filters.donation);
	}

	if (filters.user_id) {
		query = query.eq("user_id", filters.user_id);
	}

	if (filters.search) {
		query = query.or(
			`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`
		);
	}

	switch (filters.sort) {
		case "recent":
			query = query.order("created_at", { ascending: false });
			break;

		case "price-asc":
			query = query.order("price", { ascending: true, nullsFirst: true });
			break;

		case "price-desc":
			query = query.order("price", { ascending: false, nullsFirst: false });
			break;

		default:
			query = query.order("created_at", { ascending: false });
	}

	const { data, error } = await query;

	if (error) throw error;

	return data;
}

export async function findById(id: string) {
	const { data, error } = await supabase
		.from("announces")
		.select("*")
		.eq("id", id)
		.maybeSingle();

	if (error) throw error;

	return data;
}

export async function findByUserId(userId: string) {
	const { data, error } = await supabase
		.from("announces")
		.select(
			`
			*,
			user:profiles(
				id,
				name,
				photo_url
			)
		`
		)
		.eq("user_id", userId)
		.order("created_at", { ascending: false });

	if (error) throw error;

	return data;
}

export async function findCategories(userId?: string) {
	let query = supabase
		.from("announces")
		.select("category");

	if (userId) {
		query = query.eq("user_id", userId);
	}

	const { data, error } = await query.overrideTypes<CategoryRow[]>();

	if (error) throw error;

	return [...new Set(data.map(item => item.category))];
}

export async function create(data: CreateAnnounceDTO) {
	const { data: announce, error } = await supabase
		.from("announces")
		.insert(data)
		.select()
		.single();

	if (error) throw error;

	return announce;
}

export async function update(id: string, data: UpdateAnnounceDTO) {
	const { data: announce, error } = await supabase
		.from("announces")
		.update(data)
		.eq("id", id)
		.select()
		.single();

	if (error) throw error;

	return announce;
}

export async function remove(id: string) {
	const { error } = await supabase.from("announces").delete().eq("id", id);

	if (error) throw error;
}
