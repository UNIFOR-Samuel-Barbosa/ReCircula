const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

const ACCESS_TOKEN_KEY = "recircula_access_token";
const REFRESH_TOKEN_KEY = "recircula_refresh_token";
const USER_KEY = "recircula_user";

export function getAccessToken() {
	return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function getRefreshToken() {
	return localStorage.getItem(REFRESH_TOKEN_KEY);
}

export function getStoredUser() {
	try {
		const raw = localStorage.getItem(USER_KEY);
		return raw ? JSON.parse(raw) : null;
	} catch {
		return null;
	}
}

export function setSession({ accessToken, refreshToken, user }) {
	if (accessToken) localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
	if (refreshToken) localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
	if (user) localStorage.setItem(USER_KEY, JSON.stringify(user));
	window.dispatchEvent(new Event("recircula_auth_change"));
}

export function clearSession() {
	localStorage.removeItem(ACCESS_TOKEN_KEY);
	localStorage.removeItem(REFRESH_TOKEN_KEY);
	localStorage.removeItem(USER_KEY);
	window.dispatchEvent(new Event("recircula_auth_change"));
}

let refreshPromise = null;

async function doRefreshToken() {
	const currentRefreshToken = getRefreshToken();
	if (!currentRefreshToken) {
		clearSession();
		throw new Error("Sessão expirada.");
	}

	const res = await fetch(`${API_URL}/auth/refresh`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ refreshToken: currentRefreshToken }),
	});

	if (!res.ok) {
		clearSession();
		throw new Error("Sessão expirada. Faça login novamente.");
	}

	const data = await res.json();
	setSession(data);
	return data;
}

export async function apiRequest(endpoint, options = {}) {
	const {
		method = "GET",
		headers = {},
		body,
		skipAuth = false,
		_isRetry = false,
	} = options;

	const requestHeaders = { ...headers };
	const isFormData = typeof FormData !== "undefined" && body instanceof FormData;

	if (!isFormData && body && !requestHeaders["Content-Type"]) {
		requestHeaders["Content-Type"] = "application/json";
	}

	const token = getAccessToken();
	if (!skipAuth && token) {
		requestHeaders["Authorization"] = `Bearer ${token}`;
	}

	const url = endpoint.startsWith("http") ? endpoint : `${API_URL}${endpoint}`;

	const config = {
		method,
		headers: requestHeaders,
		body: isFormData ? body : (body && typeof body === "object" ? JSON.stringify(body) : body),
	};

	let response;
	try {
		response = await fetch(url, config);
	} catch {
		throw new Error("Não foi possível conectar ao servidor. Verifique se a API está em execução.");
	}

	// Token expirado: tenta renovar via refresh token (apenas 1 tentativa)
	if (response.status === 401 && !skipAuth && !_isRetry && getRefreshToken()) {
		if (!refreshPromise) {
			refreshPromise = doRefreshToken().finally(() => {
				refreshPromise = null;
			});
		}

		try {
			const newSession = await refreshPromise;
			// Repete a requisição original com o novo accessToken
			return apiRequest(endpoint, {
				...options,
				_isRetry: true,
				headers: {
					...headers,
					Authorization: `Bearer ${newSession.accessToken}`,
				},
			});
		} catch (refreshError) {
			clearSession();
			throw refreshError;
		}
	}

	if (response.status === 204) {
		return null;
	}

	const contentType = response.headers.get("content-type");
	let responseData = null;
	if (contentType && contentType.includes("application/json")) {
		responseData = await response.json().catch(() => null);
	} else {
		responseData = await response.text().catch(() => null);
	}

	if (!response.ok) {
		const errorMessage =
			responseData?.error ||
			responseData?.message ||
			`Erro ${response.status}: Falha na operação.`;
		const error = new Error(errorMessage);
		error.status = response.status;
		error.data = responseData;
		throw error;
	}

	return responseData;
}

// Métodos de Autenticação
export const authApi = {
	async login({ email, password }) {
		const session = await apiRequest("/auth/login", {
			method: "POST",
			body: { email, password },
			skipAuth: true,
		});
		setSession(session);
		return session;
	},

	async register({ name, email, password }) {
		const session = await apiRequest("/auth/register", {
			method: "POST",
			body: { name, email, password },
			skipAuth: true,
		});
		setSession(session);
		return session;
	},

	async registerAdmin({ name, email, password, accessCode }) {
		const session = await apiRequest("/auth/register-admin", {
			method: "POST",
			body: { name, email, password, accessCode },
			skipAuth: true,
		});
		setSession(session);
		return session;
	},

	async logout() {
		const refreshToken = getRefreshToken();
		if (refreshToken) {
			try {
				await apiRequest("/auth/logout", {
					method: "POST",
					body: { refreshToken },
					skipAuth: true,
				});
			} catch {
				// Ignora falha na rota de logout para sempre limpar localmente
			}
		}
		clearSession();
	},

	async forgotPassword(email) {
		return apiRequest("/auth/forgot-password", {
			method: "POST",
			body: { email },
			skipAuth: true,
		});
	},

	async resetPassword({ token, password }) {
		return apiRequest("/auth/reset-password", {
			method: "POST",
			body: { token, password },
			skipAuth: true,
		});
	},
};

// Métodos de Perfil
export const profileApi = {
	async getMe() {
		return apiRequest("/profiles");
	},

	async getById(id) {
		return apiRequest(`/profiles/${id}`);
	},

	async update(data) {
		const updated = await apiRequest("/profiles", {
			method: "PATCH",
			body: data,
		});
		// Atualiza o usuário gravado na sessão local mantendo o id/role
		const currentUser = getStoredUser();
		if (currentUser) {
			const merged = { ...currentUser, ...updated };
			localStorage.setItem(USER_KEY, JSON.stringify(merged));
			window.dispatchEvent(new Event("recircula_auth_change"));
		}
		return updated;
	},

	async getAll() {
		return apiRequest("/profiles/all");
	},

	async deleteUser(id) {
		return apiRequest(`/profiles/${id}`, {
			method: "DELETE",
		});
	},
};

// Métodos de Anúncios
export const announceApi = {
	async getAll(params = {}) {
		const query = new URLSearchParams();
		if (params.category && params.category !== "Todos") query.set("category", params.category);
		if (params.donation !== undefined && params.donation !== null) query.set("donation", params.donation);
		if (params.search) query.set("search", params.search);
		if (params.sort) query.set("sort", params.sort);

		const queryString = query.toString();
		return apiRequest(`/announces${queryString ? `?${queryString}` : ""}`);
	},

	async getById(id) {
		return apiRequest(`/announces/${id}`);
	},

	async getMine(params = {}) {
		const query = new URLSearchParams();
		if (params.search) query.set("search", params.search);
		const queryString = query.toString();
		return apiRequest(`/announces/me${queryString ? `?${queryString}` : ""}`);
	},

	async getByUserId(userId) {
		return apiRequest(`/announces/user/${userId}`);
	},

	async getCategories() {
		return apiRequest("/announces/categories");
	},

	async create(data) {
		return apiRequest("/announces", {
			method: "POST",
			body: data,
		});
	},

	async update(id, data) {
		return apiRequest(`/announces/${id}`, {
			method: "PATCH",
			body: data,
		});
	},

	async delete(id) {
		return apiRequest(`/announces/${id}`, {
			method: "DELETE",
		});
	},

	async uploadImage(file) {
		const formData = new FormData();
		formData.append("image", file);
		return apiRequest("/upload", {
			method: "POST",
			body: formData,
		});
	},
};
