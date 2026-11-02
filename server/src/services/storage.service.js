import { Readable } from "node:stream";

import cloudinary from "../config/cloudinary.js";

import { AppError } from "../utils/AppError.js";

const MAX_MB_FILE_SIZE = 10;
const MAX_FILE_SIZE = MAX_MB_FILE_SIZE * 1024 * 1024;

const ALLOWED_TYPES = ["image/png", "image/jpeg", "image/webp"];

// Timeout por tentativa de upload (ms) — separado do timeout global do SDK.
const UPLOAD_TIMEOUT_MS = 90_000; // 90 s por tentativa
const MAX_RETRIES = 2;

/**
 * Tenta fazer upload de um buffer para o Cloudinary uma única vez.
 * Retorna a URL segura em caso de sucesso ou rejeita com o erro original.
 */
function attemptUpload(buffer) {
	return new Promise((resolve, reject) => {
		// Guard-timer independente: cancela a promessa se o Cloudinary
		// não responder dentro de UPLOAD_TIMEOUT_MS.
		const timer = setTimeout(() => {
			reject(new Error("Upload timeout: Cloudinary não respondeu a tempo."));
		}, UPLOAD_TIMEOUT_MS);

		const stream = cloudinary.uploader.upload_stream(
			{
				resource_type: "image",
				folder: "recircula",
				timeout: UPLOAD_TIMEOUT_MS,
			},
			(error, result) => {
				clearTimeout(timer);

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
			clearTimeout(timer);
			reject(err);
		});

		Readable.from(buffer).pipe(stream);
	});
}

/**
 * Indica se o erro é passível de retry (timeout ou falha de rede transitória).
 */
function isRetryable(error) {
	const retryableCodes = [408, 429, 499, 500, 502, 503, 504];
	const retryableNames = ["TimeoutError", "NetworkError"];

	return (
		retryableCodes.includes(error?.http_code) ||
		retryableNames.includes(error?.name) ||
		error?.message?.toLowerCase().includes("timeout") ||
		error?.message?.toLowerCase().includes("econnreset") ||
		error?.message?.toLowerCase().includes("network")
	);
}

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

	let lastError;

	for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
		try {
			const result = await attemptUpload(file.buffer);
			return result.secure_url;
		} catch (error) {
			lastError = error;
			console.error(`Cloudinary upload error (tentativa ${attempt}/${MAX_RETRIES}):`, error);

			const canRetry = attempt < MAX_RETRIES && isRetryable(error);
			if (!canRetry) break;

			// Espera exponencial antes de tentar novamente (1 s, 2 s, …).
			const delay = 1000 * attempt;
			console.warn(`Aguardando ${delay}ms antes de nova tentativa…`);
			await new Promise((r) => setTimeout(r, delay));
		}
	}

	const errorMessage =
		lastError?.message ||
		lastError?.error?.message ||
		"Não foi possível enviar a imagem.";

	throw new AppError(errorMessage, lastError?.http_code || 500);
}
