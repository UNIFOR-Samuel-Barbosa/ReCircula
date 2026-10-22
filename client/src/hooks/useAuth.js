import { useContext } from "react";
import {
	AuthContext,
	AUTH_CONTEXT_DEFAULT_VALUE,
} from "../context/auth/auth-context";

export function useAuth() {
	const context = useContext(AuthContext);
	if (!context || context === AUTH_CONTEXT_DEFAULT_VALUE) {
		throw new Error("useAuth deve ser utilizado dentro de um AuthProvider");
	}
	return context;
}
