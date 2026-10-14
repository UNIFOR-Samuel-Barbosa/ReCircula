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

export function normalizeTelephone(value) {
	let digits = String(value ?? "").replace(/\D/g, "");
	if ((digits.length === 12 || digits.length === 13) && digits.startsWith("55")) {
		digits = digits.slice(2);
	}
	return digits.slice(0, 11);
}

export function formatTelephone(value) {
	const digits = normalizeTelephone(value);
	if (!digits) return "";
	if (digits.length < 3) {
		return digits.length === 2 ? `(${digits})` : `(${digits}`;
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
}
