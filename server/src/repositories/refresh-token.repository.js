import { supabase } from "../config/supabase.js";

export async function create(data) {
	const { error } = await supabase.from("refresh_tokens").insert(data);

	if (error) throw error;
}

export async function findByHash(tokenHash) {
	const { data, error } = await supabase
		.from("refresh_tokens")
		.select("*")
		.eq("token_hash", tokenHash)
		.maybeSingle();

	if (error) throw error;

	return data;
}

// Retorna false se o token já estava revogado (outra requisição chegou antes).
export async function revoke(id) {
	const { data, error } = await supabase
		.from("refresh_tokens")
		.update({ revoked_at: new Date().toISOString() })
		.eq("id", id)
		.is("revoked_at", null)
		.select("id");

	if (error) throw error;

	return data.length > 0;
}

export async function revokeAllByUser(userId) {
	const { error } = await supabase
		.from("refresh_tokens")
		.update({ revoked_at: new Date().toISOString() })
		.eq("user_id", userId)
		.is("revoked_at", null);

	if (error) throw error;
}
