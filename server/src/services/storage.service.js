import { Readable } from "node:stream";

import cloudinary from "../config/cloudinary.js";

import { AppError } from "../utils/AppError.js";

const MAX_MB_FILE_SIZE = 10;
const MAX_FILE_SIZE = MAX_MB_FILE_SIZE * 1024 * 1024;

const ALLOWED_TYPES = ["image/png", "image/jpeg", "image/webp"];

export async function uploadImage(file) {
	if (!file) {
		throw new AppError("Imagem não enviada.");
	}

	if (!ALLOWED_TYPES.includes(file.mimetype)) {
		throw new AppError("Formato de imagem inválido.");
	}

	if (file.size > MAX_FILE_SIZE) {
		throw new AppError(`A imagem excede o limite de ${MAX_MB_FILE_SIZE} MB.`);
	}

	try {
		const result = await new Promise((resolve, reject) => {
			const stream = cloudinary.uploader.upload_stream(
				{
					resource_type: "image",
					folder: "recircula",
				},
				(error, result) => {
					if (error) {
						reject(error);
						return;
					}

					if (!result?.secure_url) {
						reject(new Error("Cloudinary não retornou a URL da imagem."));
						return;
					}

					resolve(result);
				}
			);

			stream.on("error", (err) => {
				reject(err);
			});

			Readable.from(file.buffer).pipe(stream);
		});

		return result.secure_url;
	} catch (error) {
		console.error("Cloudinary upload error:", error);

		const errorMessage =
			error?.message || error?.error?.message || "Não foi possível enviar a imagem.";

		throw new AppError(errorMessage, error?.http_code || 500);
	}
}

