import { createContext } from "react";

export const NavigationContext = createContext({ pathname: "/", params: {} });

export function NavigationProvider({ pathname, params, children }) {
	return (
		<NavigationContext.Provider value={{ pathname, params }}>
			{children}
		</NavigationContext.Provider>
	);
}
