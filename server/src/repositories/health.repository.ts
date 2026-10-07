import { supabase } from "../config/supabase.js";

export async function checkDatabaseConnection() {
	const { error } = await supabase
		.from("announces")
		.select("*")

	if (error) throw error;
}