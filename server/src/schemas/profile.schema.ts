import { z } from "zod";

export const updateProfileSchema = z.object({
	name: z.string().trim().min(2).optional(),
	photo_url: z.string().trim().min(1).nullable().optional(),
	biography: z.string().max(500).nullable().optional(),
	telephone: z.string().max(20).nullable().optional(),
});