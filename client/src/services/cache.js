const CACHE_PREFIX = "recircula_cache";

function stableStringify(value) {
	if (value === undefined) return "undefined";
	if (value === null) return "null";
	if (Array.isArray(value)) {
		return `[${value.map((item) => stableStringify(item)).join(",")}]`;
	}
	if (typeof value === "object") {
		return `{${Object.keys(value)
			.sort()
			.map((key) => `${JSON.stringify(key)}:${stableStringify(value[key])}`)
			.join(",")}}`;
	}
	return JSON.stringify(value);
}

export function buildCacheKey(namespace, params = {}) {
	return `${CACHE_PREFIX}:${namespace}:${stableStringify(params)}`;
}

export function readCacheEntry(cacheKey) {
	try {
		if (typeof localStorage === "undefined") return null;
		const rawValue = localStorage.getItem(cacheKey);
		if (!rawValue) return null;

		const parsedValue = JSON.parse(rawValue);
		if (parsedValue.expiresAt && Date.now() > parsedValue.expiresAt) {
			localStorage.removeItem(cacheKey);
			return null;
		}

		return parsedValue.value;
	} catch {
		try {
			localStorage.removeItem(cacheKey);
		} catch {
			// Ignora falha de limpeza do cache quando localStorage não estiver acessível.
		}
		return null;
	}
}

export function writeCacheEntry(cacheKey, value, ttlMs = 1000 * 60 * 60 * 24) {
	try {
		if (typeof localStorage === "undefined") return value;
		const payload = {
			value,
			cachedAt: Date.now(),
			expiresAt: Date.now() + ttlMs,
		};
		localStorage.setItem(cacheKey, JSON.stringify(payload));
	} catch {
		// Ignora falhas do browser ao persistir dados em cache.
	}
	return value;
}

export function clearCacheEntry(cacheKey) {
	try {
		if (typeof localStorage !== "undefined") {
			localStorage.removeItem(cacheKey);
		}
	} catch {
		// Ignora falhas de remoção.
	}
}
