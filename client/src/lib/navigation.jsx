import { createContext, useCallback, useContext } from "react";

const NavigationContext = createContext({ pathname: "/", params: {} });

export function NavigationProvider({ pathname, params, children }) {
	return (
		<NavigationContext.Provider value={{ pathname, params }}>
			{children}
		</NavigationContext.Provider>
	);
}

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

export function useNavigate() {
	return useCallback((options) => navigate(options), []);
}

export function useParams() {
	return useContext(NavigationContext).params;
}

export function Link({
	to,
	params,
	search,
	activeOptions,
	className = "",
	onClick,
	...props
}) {
	const { pathname: currentPath } = useContext(NavigationContext);
	const href = buildHref(to, params, search);
	const targetPath = href.split(/[?#]/, 1)[0];
	const isActive = activeOptions?.exact
		? currentPath === targetPath
		: currentPath === targetPath || currentPath.startsWith(`${targetPath}/`);

	return (
		<a
			{...props}
			href={href}
			className={`${className}${isActive ? " active" : ""}`.trim()}
			aria-current={isActive ? "page" : undefined}
			onClick={(event) => {
				onClick?.(event);
				if (
					event.defaultPrevented ||
					event.button !== 0 ||
					event.metaKey ||
					event.ctrlKey ||
					event.shiftKey ||
					event.altKey
				) {
					return;
				}
				event.preventDefault();
				navigate({ to, params, search });
			}}
		/>
	);
}
