import { z } from "zod";

export const createAnnounceSchema = z.object({
	image_url: z.string().trim().min(1, "Imagem é obrigatória."),

	title: z.string().trim().min(1, "Título é obrigatório."),

	description: z.string().trim().nullable().optional(),

	category: z.string().trim().min(1, "Categoria é obrigatória."),

	price: z.number().nullable().optional(),

	donation: z.boolean(),
});

export const updateAnnounceSchema = createAnnounceSchema.partial();