import { createContext, useContext, useEffect, useState, useCallback } from "react";
import {
	authApi,
	profileApi,
	getStoredUser,
	getAccessToken,
} from "../services/api";

export const AuthContext = createContext({
	user: null,
	token: null,
	isLoggedIn: false,
	isAdmin: false,
	isLoading: true,
	signIn: async () => {},
	signUp: async () => {},
	signUpAdmin: async () => {},
	signOut: async () => {},
	updateUser: async () => {},
	reloadUser: async () => {},
});

export function AuthProvider({ children }) {
	const [user, setUser] = useState(() => getStoredUser());
	const [token, setToken] = useState(() => getAccessToken());
	const [isLoading, setIsLoading] = useState(true);

	const syncState = useCallback(() => {
		const storedUser = getStoredUser();
		const storedToken = getAccessToken();
		setUser(storedUser);
		setToken(storedToken);
	}, []);

	useEffect(() => {
		const handleAuthChange = () => {
			syncState();
		};

		window.addEventListener("recircula_auth_change", handleAuthChange);
		window.addEventListener("storage", handleAuthChange);

		// Ao carregar, se houver token, atualiza dados frescos do perfil
		if (getAccessToken()) {
			profileApi
				.getMe()
				.then((profile) => {
					if (profile) {
						setUser((prev) => {
							const updated = { ...(prev || {}), ...profile };
							localStorage.setItem("recircula_user", JSON.stringify(updated));
							return updated;
						});
					}
				})
				.catch((err) => {
					console.warn("Falha ao sincronizar perfil inicial:", err);
				})
				.finally(() => {
					setIsLoading(false);
				});
		} else {
			setIsLoading(false);
		}

		return () => {
			window.removeEventListener("recircula_auth_change", handleAuthChange);
			window.removeEventListener("storage", handleAuthChange);
		};
	}, [syncState]);

	const signIn = useCallback(async (credentials) => {
		const session = await authApi.login(credentials);
		setUser(session.user);
		setToken(session.accessToken);
		return session;
	}, []);

	const signUp = useCallback(async (data) => {
		const session = await authApi.register(data);
		setUser(session.user);
		setToken(session.accessToken);
		return session;
	}, []);

	const signUpAdmin = useCallback(async (data) => {
		const session = await authApi.registerAdmin(data);
		setUser(session.user);
		setToken(session.accessToken);
		return session;
	}, []);

	const signOut = useCallback(async () => {
		await authApi.logout();
		setUser(null);
		setToken(null);
	}, []);

	const updateUser = useCallback(async (data) => {
		const updated = await profileApi.update(data);
		setUser((prev) => ({ ...(prev || {}), ...updated }));
		return updated;
	}, []);

	const reloadUser = useCallback(async () => {
		const profile = await profileApi.getMe();
		if (profile) {
			setUser((prev) => {
				const merged = { ...(prev || {}), ...profile };
				localStorage.setItem("recircula_user", JSON.stringify(merged));
				return merged;
			});
		}
		return profile;
	}, []);

	const value = {
		user,
		token,
		isLoggedIn: Boolean(user && token),
		isAdmin: user?.role === "admin",
		isLoading,
		signIn,
		signUp,
		signUpAdmin,
		signOut,
		updateUser,
		reloadUser,
	};

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error("useAuth deve ser utilizado dentro de um AuthProvider");
	}
	return context;
}
