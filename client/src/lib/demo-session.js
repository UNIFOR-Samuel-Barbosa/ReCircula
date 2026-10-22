import { useAuth } from "../hooks/useAuth";

/**
 * Hook de sessão integrado com a API real e autenticação JWT/bcrypt.
 * Mantém compatibilidade com referências existentes de useDemoSession.
 */
export function useDemoSession() {
	const auth = useAuth();
	return {
		...auth,
		isLoggedIn: auth.isLoggedIn,
		isAdmin: auth.isAdmin,
		user: auth.user,
		signIn: auth.signIn,
		signInAsAdmin: auth.signUpAdmin,
		signOut: auth.signOut,
	};
}

export { useAuth };
