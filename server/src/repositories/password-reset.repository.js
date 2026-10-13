import { supabase } from "../config/supabase.js";

export async function create(data) {
	const { error } = await supabase.from("password_resets").insert(data);

	if (error) throw error;
}

export async function findByHash(tokenHash) {
	const { data, error } = await supabase
		.from("password_resets")
		.select("*")
		.eq("token_hash", tokenHash)
		.maybeSingle();

	if (error) throw error;

	return data;
}

// Retorna false se o token já tinha sido usado.
export async function markUsed(id) {
	const { data, error } = await supabase
		.from("password_resets")
		.update({ used_at: new Date().toISOString() })
		.eq("id", id)
		.is("used_at", null)
		.select("id");

	if (error) throw error;

	return data.length > 0;
}

export async function invalidateAllByUser(userId) {
	const { error } = await supabase
		.from("password_resets")
		.update({ used_at: new Date().toISOString() })
		.eq("user_id", userId)
		.is("used_at", null);

	if (error) throw error;
}
