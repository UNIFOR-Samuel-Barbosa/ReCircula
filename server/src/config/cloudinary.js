import "dotenv/config";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME?.trim(),
	api_key: process.env.CLOUDINARY_API_KEY?.trim(),
	api_secret: process.env.CLOUDINARY_API_SECRET?.trim(),
	secure: true,
	// Timeout global para chamadas à API do Cloudinary (em ms).
	// O free tier do Render tem rede lenta / cold start; 120 s evita o TimeoutError (HTTP 499).
	timeout: 120_000,
});

export default cloudinary;
