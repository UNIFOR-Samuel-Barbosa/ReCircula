import express from "express";
import cors from "cors";
import "dotenv/config";

import announceRoutes from "./routes/announces.routes.js";
import profileRoutes from "./routes/profiles.routes.js";
import uploadRoutes from "./routes/upload.routes.js";
import healthRoutes from "./routes/health.routes.js";

import { errorMiddleware } from "./middlewares/error.middleware.js";

const app = express();

app.use(
	cors({
		origin: ["http://localhost:5173", process.env.VERCEL_URL],
		credentials: true,
	})
);

app.use(express.json());

app.use("/announces", announceRoutes);
app.use("/profiles", profileRoutes);
app.use("/upload", uploadRoutes);
app.use("/health", healthRoutes);

app.use(errorMiddleware);

export default app;
