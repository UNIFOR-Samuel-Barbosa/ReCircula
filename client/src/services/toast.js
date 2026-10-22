import { createElement } from "react";
import { Loader2 } from "lucide-react";
import { Toaster, toast } from "sonner";

const toastPalette = {
	yellow: {
		background: "#111827",
		border: "#facc15",
		color: "white",
	},
	green: {
		background: "#111827",
		border: "#22c55e",
		color: "white",
	},
	red: {
		background: "#111827",
		border: "#ef4444",
		color: "white",
	},
	blue: {
		background: "#111827",
		border: "#3b82f6",
		color: "white",
	},
};

export function ToastProvider() {
	return createElement(Toaster, {
		position: "top-center", 
		closeButton: true,
		richColors: false,
		toastOptions: {
			classNames: {
				toast:
					"group toast border border-slate-200/80 shadow-[0_16px_38px_rgba(15,23,42,0.18)] rounded-xl px-4 py-3 text-base font-semibold",
				closeButton:
					"border-0 bg-transparent text-slate-700 hover:text-slate-950",
				description: "text-sm font-medium",
			},
		},
	});
}

export function showToast({
	text,
	color = "yellow",
	duration = 5000,
} = {}) {
	if (!text) {
		throw new Error("O texto do toast é obrigatório.");
	}

	const palette = toastPalette[color] ?? toastPalette.yellow;

	return toast(text, {
		duration,
		className: "text-2xl font-semibold",
		style: {
			backgroundColor: palette.background,
			borderLeft: `4px solid ${palette.border}`,
			borderTop: "transparent",
			borderBottom: "transparent",
			borderRight: "transparent",
			color: palette.color,
			boxShadow: "0 16px 38px rgba(15, 23, 42, 0.18)",
		},
	});
}

export function showLoadingToast() {
	return toast.custom(
		() =>
			createElement(
				"div",
				{
					role: "status",
					"aria-label": "Atualizando anúncios",
					className: "grid size-10 place-items-center rounded-xl",
				},
				createElement(Loader2, {
					className: "size-5 animate-spin text-white",
					"aria-hidden": true,
				})
			),
		{
			duration: Infinity,
			closeButton: false,
			className: "rounded-xl border",
			style: {
				backgroundColor: "#000000",
				border: "1px solid #111827",
				color: "white",
				boxShadow: "0 16px 38px rgba(15, 23, 42, 0.18)",
			},
		}
	);
}

export { toast };
