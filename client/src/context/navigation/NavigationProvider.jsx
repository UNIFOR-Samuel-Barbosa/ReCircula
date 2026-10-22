import { NavigationContext } from "./navigation-context";

export function NavigationProvider({ pathname, params, children }) {
	return (
		<NavigationContext.Provider value={{ pathname, params }}>
			{children}
		</NavigationContext.Provider>
	);
}
