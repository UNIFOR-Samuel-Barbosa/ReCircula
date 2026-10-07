import * as healthService from "../services/health.service.js";

export async function keepalive(_req, res) {
	try {
		await healthService.checkDatabaseConnection();

		return res.status(200).json({
			status: "ok",
			timestamp: new Date().toISOString(),
		});
	} catch (error) {
		const message =
			typeof error === "object" &&
			error !== null &&
			"message" in error &&
			typeof error.message === "string"
				? error.message
				: undefined;

		return res.status(500).json({
			status: "error",
			...(message && { message }),
		});
	}
}

