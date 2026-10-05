import { useCallback, useContext } from "react";
import { NavigationContext } from "../context/NavigationContext";

export function buildHref(to, params = {}, search) {
	const pathname = to.replace(/\$([\w]+)/g, (_, key) => {
		const value = params[key];
		if (value == null) throw new Error(`Missing route parameter: ${key}`);
		return encodeURIComponent(value);
	});
	const query = new URLSearchParams(search ?? {}).toString();
	return query ? `${pathname}?${query}` : pathname;
}

export function navigate({ to, params, search, replace = false }) {
	const href = buildHref(to, params, search);
	if (replace) window.history.replaceState({}, "", href);
	else window.history.pushState({}, "", href);
	window.dispatchEvent(new Event("app:navigate"));
}

export function useNavigation() {
	return useContext(NavigationContext);
}

export function useNavigate() {
	return useCallback((options) => navigate(options), []);
}

export function useParams() {
	return useNavigation().params;
}
