import { useSyncExternalStore } from "react";
const SESSION_KEY = "recircula-demo-session";
const SESSION_EVENT = "recircula-session-change";
function readSession() {
	if (typeof window === "undefined") return "signed-in";
	const value = window.localStorage.getItem(SESSION_KEY);
	return value === "signed-out" || value === "admin" ? value : "signed-in";
}
function subscribe(callback) {
	window.addEventListener(SESSION_EVENT, callback);
	window.addEventListener("storage", callback);
	return () => {
		window.removeEventListener(SESSION_EVENT, callback);
		window.removeEventListener("storage", callback);
	};
}
function updateSession(state) {
	window.localStorage.setItem(SESSION_KEY, state);
	window.dispatchEvent(new Event(SESSION_EVENT));
}
export function useDemoSession() {
	const state = useSyncExternalStore(subscribe, readSession, () => "signed-in");
	return {
		isLoggedIn: state !== "signed-out",
		isAdmin: state === "admin",
		signIn: () => updateSession("signed-in"),
		signInAsAdmin: () => updateSession("admin"),
		signOut: () => updateSession("signed-out"),
	};
}
