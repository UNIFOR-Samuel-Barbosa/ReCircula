import { createContext } from "react";

export const AUTH_CONTEXT_DEFAULT_VALUE = {
	user: null,
	token: null,
	isLoggedIn: false,
	isAdmin: false,
	isLoading: true,
	signIn: async () => {},
	signUp: async () => {},
	signUpAdmin: async () => {},
	forgotPassword: async () => {},
	resetPassword: async () => {},
	signOut: async () => {},
	deleteAccount: async () => {},
	updateUser: async () => {},
	reloadUser: async () => {},
};

export const AuthContext = createContext(AUTH_CONTEXT_DEFAULT_VALUE);
