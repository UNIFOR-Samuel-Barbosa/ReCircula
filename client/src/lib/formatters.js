const relativeTimeFormatter = new Intl.RelativeTimeFormat("pt-BR", {
	numeric: "always",
});

export function formatRelativeTime(value) {
	if (value == null || value === "") return "";
	const timestamp = new Date(value).getTime();
	if (!Number.isFinite(timestamp)) return "";

	const differenceInSeconds = (timestamp - Date.now()) / 1000;
	if (Math.abs(differenceInSeconds) < 60) return "agora";

	const units = [
		{ limit: 60 * 60, seconds: 60, unit: "minute" },
		{ limit: 24 * 60 * 60, seconds: 60 * 60, unit: "hour" },
		{ limit: 30 * 24 * 60 * 60, seconds: 24 * 60 * 60, unit: "day" },
		{ limit: 365 * 24 * 60 * 60, seconds: 30 * 24 * 60 * 60, unit: "month" },
		{
			limit: Infinity,
			seconds: 365 * 24 * 60 * 60,
			unit: "year",
		},
	];

	const { seconds, unit } =
		units.find(({ limit }) => Math.abs(differenceInSeconds) < limit) ??
		units.at(-1);

	return relativeTimeFormatter.format(
		Math.round(differenceInSeconds / seconds),
		unit
	);
}

export function getCountryCodeFromTelephone(value) {
	const digits = String(value ?? "").replace(/\D/g, "");
	if (digits.length <= 11) return "";
	return digits.slice(0, digits.length - 11);
}

export function normalizeTelephone(value) {
	const digits = String(value ?? "").replace(/\D/g, "");
	if (digits.length <= 11) return digits.slice(0, 11);
	return digits.slice(digits.length - 11);
}

export function buildWhatsappNumber(value, countryCode = "") {
	const digits = String(value ?? "").replace(/\D/g, "");
	if (!digits) return "";
	const normalized = normalizeTelephone(digits);
	const code = String(countryCode ?? "").replace(/\D/g, "");
	if (code) return `${code}${normalized}`;
	if (digits.length > 11) return digits;
	return `55${normalized}`;
}

export function formatTelephone(value, options = {}) {
	const { includeCountryCode = false, countryCode = "" } = options;
	const digits = normalizeTelephone(value);
	if (!digits) return "";

	const visualCountryCode = includeCountryCode
		? String(countryCode || getCountryCodeFromTelephone(value) || "").replace(/\D/g, "")
		: "";

	const formatted = (() => {
		if (digits.length < 3) {
			return `(${digits}`;
		}

		const areaCode = digits.slice(0, 2);
		const subscriber = digits.slice(2);
		if (digits.length === 10) {
			return `(${areaCode}) ${subscriber.slice(0, 4)}-${subscriber.slice(4)}`;
		}

		return `(${areaCode}) ${subscriber[0]}${
			subscriber.length > 1
				? ` ${subscriber.slice(1, 5)}${subscriber.length > 5 ? `-${subscriber.slice(5)}` : ""}`
				: ""
		}`;
	})();

	if (!visualCountryCode) return formatted;
	return `+${visualCountryCode} ${formatted}`;
}

export function formatPrice(item) {
	return item.donation
		? "Doação"
		: (item.price?.toLocaleString("pt-BR", {
				style: "currency",
				currency: "BRL",
			}) ?? "A combinar");
}
