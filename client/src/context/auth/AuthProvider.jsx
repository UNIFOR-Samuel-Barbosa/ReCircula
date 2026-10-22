import { useEffect, useState, useCallback } from "react";
import {
	authApi,
	profileApi,
	getStoredUser,
	getAccessToken,
} from "../../services/api";
import { AuthContext } from "./auth-context";
import { ensureOnlineForAuthAction } from "./auth-helpers";

export { useAuth } from "../../hooks/useAuth";

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
		ensureOnlineForAuthAction("Login");
		const session = await authApi.login(credentials);
		setUser(session.user);
		setToken(session.accessToken);
		return session;
	}, []);

	const signUp = useCallback(async (data) => {
		ensureOnlineForAuthAction("Cadastro");
		const session = await authApi.register(data);
		setUser(session.user);
		setToken(session.accessToken);
		return session;
	}, []);

	const signUpAdmin = useCallback(async (data) => {
		ensureOnlineForAuthAction("Cadastro de administrador");
		const session = await authApi.registerAdmin(data);
		setUser(session.user);
		setToken(session.accessToken);
		return session;
	}, []);

	const forgotPassword = useCallback(async (email) => {
		ensureOnlineForAuthAction("Recuperação de senha");
		return authApi.forgotPassword(email);
	}, []);

	const resetPassword = useCallback(async ({ token, password }) => {
		ensureOnlineForAuthAction("Redefinição de senha");
		return authApi.resetPassword({ token, password });
	}, []);

	const signOut = useCallback(async () => {
		ensureOnlineForAuthAction("Logout");
		await authApi.logout();
		setUser(null);
		setToken(null);
	}, []);

	const updateUser = useCallback(async (data) => {
		ensureOnlineForAuthAction("Atualização do perfil");
		const updated = await profileApi.update(data);
		setUser((prev) => ({ ...(prev || {}), ...updated }));
		return updated;
	}, []);

	const reloadUser = useCallback(async () => {
		ensureOnlineForAuthAction("Sincronização do perfil");
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
		forgotPassword,
		resetPassword,
		signOut,
		updateUser,
		reloadUser,
	};

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
