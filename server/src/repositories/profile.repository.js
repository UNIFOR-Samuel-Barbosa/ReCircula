import { supabase } from "../config/supabase.js";

// Nunca incluir password_hash aqui: estas colunas podem chegar ao cliente.
const PROFILE_COLUMNS =
	"id, email, role, name, photo_url, biography, telephone, created_at";

export async function findById(id) {
	const { data, error } = await supabase
		.from("profiles")
		.select(PROFILE_COLUMNS)
		.eq("id", id)
		.maybeSingle();

	if (error) throw error;

	return data;
}

export async function findByEmail(email) {
	const { data, error } = await supabase
		.from("profiles")
		.select(PROFILE_COLUMNS)
		.eq("email", email)
		.maybeSingle();

	if (error) throw error;

	return data;
}

export async function findByEmailWithPassword(email) {
	const { data, error } = await supabase
		.from("profiles")
		.select(`${PROFILE_COLUMNS}, password_hash`)
		.eq("email", email)
		.maybeSingle();

	if (error) throw error;

	return data;
}

export async function findByIdWithPassword(id) {
	const { data, error } = await supabase
		.from("profiles")
		.select(`${PROFILE_COLUMNS}, password_hash`)
		.eq("id", id)
		.maybeSingle();

	if (error) throw error;

	return data;
}

export async function create(data) {
	const { data: profile, error } = await supabase
		.from("profiles")
		.insert(data)
		.select(PROFILE_COLUMNS)
		.single();

	if (error) throw error;

	return profile;
}

export async function update(id, data) {
	const { data: profile, error } = await supabase
		.from("profiles")
		.update(data)
		.eq("id", id)
		.select(PROFILE_COLUMNS)
		.single();

	if (error) throw error;

	return profile;
}

export async function updatePassword(id, passwordHash) {
	const { error } = await supabase
		.from("profiles")
		.update({ password_hash: passwordHash })
		.eq("id", id);

	if (error) throw error;
}

export async function findAll() {
	const { data, error } = await supabase
		.from("profiles")
		.select(PROFILE_COLUMNS)
		.order("created_at", { ascending: false });

	if (error) throw error;

	return data;
}

export async function remove(id) {
	const { error } = await supabase.from("profiles").delete().eq("id", id);

	if (error) throw error;
}
