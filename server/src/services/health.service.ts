import * as healthRepository from "../repositories/health.repository.js";

export async function checkDatabaseConnection() {
	await healthRepository.checkDatabaseConnection();
}