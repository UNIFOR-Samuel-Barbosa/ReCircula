import express from "express";
import cors from "cors";
import "dotenv/config";

import authRoutes from "./routes/auth.routes.js";
import announceRoutes from "./routes/announces.routes.js";
import profileRoutes from "./routes/profiles.routes.js";
import uploadRoutes from "./routes/upload.routes.js";
import healthRoutes from "./routes/health.routes.js";

import { errorMiddleware } from "./middlewares/error.middleware.js";

const app = express();

const allowedOrigins = [
	"http://localhost:5173",
	"http://127.0.0.1:5173",
	process.env.FRONTEND_URL,
	process.env.VERCEL_URL && `https://${process.env.VERCEL_URL}`,
	process.env.VERCEL_URL,
].filter(Boolean);

app.use(
	cors({
		origin: (origin, callback) => {
			if (
				!origin ||
				allowedOrigins.includes(origin) ||
				origin.startsWith("http://localhost:") ||
				origin.startsWith("http://127.0.0.1:")
			) {
				return callback(null, true);
			}
			return callback(null, true);
		},
		credentials: true,
	})
);

app.use(express.json());

app.use("/auth", authRoutes);
app.use("/announces", announceRoutes);
app.use("/profiles", profileRoutes);
app.use("/upload", uploadRoutes);
app.use("/health", healthRoutes);

app.use(errorMiddleware);

export default app;
