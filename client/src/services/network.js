import { showToast } from "./toast";

const OFFLINE_TOAST_KEY = "__recircula_offline_toast_shown__";

export function isOnline() {
	if (typeof navigator === "undefined") return true;
	return navigator.onLine;
}

export function assertWriteOnline(operationName = "Essa operação") {
	if (!isOnline()) {
		const message = `${operationName} exige conexão com a internet. Conecte-se e tente novamente.`;
		const error = new Error(message);
		error.code = "OFFLINE";
		error.isOffline = true;
		if (!globalThis[OFFLINE_TOAST_KEY]) {
			globalThis[OFFLINE_TOAST_KEY] = true;
			showToast({ text: message, color: "red" });
			window.setTimeout(() => {
				globalThis[OFFLINE_TOAST_KEY] = false;
			}, 3000);
		}
		throw error;
	}
}
