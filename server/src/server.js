import "dotenv/config";

import app from "./app.js";

const PORT = Number(process.env.PORT) || 3001;

const server = app.listen(PORT, "0.0.0.0", () => {
	console.log(`🚀 API iniciada na porta ${PORT}`);
});

// Aumenta o timeout do servidor HTTP para acomodar uploads lentos
// (ex.: Render free tier com cold start + rede lenta → TimeoutError do Cloudinary).
// O valor padrão do Node.js é 5 s, insuficiente para uploads via rede instável.
server.setTimeout(150_000); // 150 s > UPLOAD_TIMEOUT_MS (90 s) × MAX_RETRIES (2) + folga
