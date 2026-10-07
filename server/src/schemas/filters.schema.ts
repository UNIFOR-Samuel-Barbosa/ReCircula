import { z } from "zod";

export const announceFiltersSchema = z.object({
	category: z.string().trim().min(1).optional(),
	search: z.string().trim().min(1).optional(),
	user_id: z.uuid().optional(),
	donation: z
		.enum(["true", "false"])
		.transform((value) => value === "true")
		.optional(),
	sort: z
		.enum(["recent", "price-asc", "price-desc", ""])
		.default(""),
});
