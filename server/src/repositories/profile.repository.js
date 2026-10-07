import { supabase } from "../config/supabase.js";

export async function findById(id) {
	const { data, error } = await supabase
		.from("profiles")
		.select("*")
		.eq("id", id)
		.maybeSingle();

	if (error) throw error;

	return data;
}

export async function update(id, data) {
	const { data: profile, error } = await supabase
		.from("profiles")
		.update(data)
		.eq("id", id)
		.select()
		.single();

	if (error) throw error;

	return profile;
}

