import { showToast } from "../../services/toast";
import { isOnline } from "../../services/network";

export function ensureOnlineForAuthAction(actionLabel = "Esta ação") {
	if (typeof navigator !== "undefined" && !navigator.onLine) {
		const message = `${actionLabel} exige conexão com a internet. Conecte-se e tente novamente.`;
		showToast({ text: message, color: "red" });
		const error = new Error(message);
		error.code = "OFFLINE";
		error.isOffline = true;
		throw error;
	}

	if (typeof navigator === "undefined" && !isOnline()) {
		const message = `${actionLabel} exige conexão com a internet. Conecte-se e tente novamente.`;
		showToast({ text: message, color: "red" });
		const error = new Error(message);
		error.code = "OFFLINE";
		error.isOffline = true;
		throw error;
	}
}
