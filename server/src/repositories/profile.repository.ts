import { supabase } from "../config/supabase.js";

import type { Profile, UpdateProfileDTO } from "../types/profile.types.js";

export async function findById(id: string) {
	const { data, error } = await supabase
		.from("profiles")
		.select("*")
		.eq("id", id)
		.maybeSingle();

	if (error) throw error;

	return data as Profile;
}

export async function update(id: string, data: UpdateProfileDTO) {
	const { data: profile, error } = await supabase
		.from("profiles")
		.update(data)
		.eq("id", id)
		.select()
		.single();

	if (error) throw error;

	return profile as Profile;
}
