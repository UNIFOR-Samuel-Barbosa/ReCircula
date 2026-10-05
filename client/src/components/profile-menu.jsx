import { Link } from "./link";
import { useNavigate } from "../hooks/useNavigation";
import { useEffect, useRef, useState } from "react";
import { LayoutDashboard, LogOut, UserRound } from "lucide-react";
import { useDemoSession } from "../lib/demo-session";
const itemClass =
	"flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm text-foreground transition-colors hover:bg-accent";
export function ProfileMenu() {
	const { isAdmin, signOut } = useDemoSession();
	const [open, setOpen] = useState(false);
	const ref = useRef(null);
	const nav = useNavigate();
	useEffect(() => {
		if (!open) return;
		const close = (e) => {
			if (!ref.current?.contains(e.target)) setOpen(false);
		};
		const esc = (e) => {
			if (e.key === "Escape") setOpen(false);
		};
		document.addEventListener("mousedown", close);
		document.addEventListener("keydown", esc);
		return () => {
			document.removeEventListener("mousedown", close);
			document.removeEventListener("keydown", esc);
		};
	}, [open]);
	return (
		<div ref={ref} className="relative">
			<button
				type="button"
				aria-label="Abrir menu da conta"
				aria-expanded={open}
				aria-haspopup="menu"
				onClick={() => setOpen(!open)}
				className="grid size-9 place-items-center rounded-full border border-border bg-secondary text-xs font-bold transition-colors hover:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
			>
				MC
			</button>
			{open && (
				<div
					role="menu"
					className="absolute right-0 top-12 z-50 w-52 rounded-lg border border-border bg-popover p-1.5 shadow-2xl"
				>
					<div className="absolute -top-1.5 right-3 size-3 rotate-45 border-l border-t border-border bg-popover" />
					<Link
						to="/perfil"
						role="menuitem"
						className={itemClass}
						onClick={() => setOpen(false)}
					>
						<UserRound className="size-4" />
						Perfil
					</Link>
					{isAdmin && (
						<Link
							to="/dashboard"
							role="menuitem"
							className={itemClass}
							onClick={() => setOpen(false)}
						>
							<LayoutDashboard className="size-4" />
							Dashboard
						</Link>
					)}
					<div className="my-1 h-px bg-border" />
					<button
						role="menuitem"
						type="button"
						className={`${itemClass} text-destructive`}
						onClick={() => {
							setOpen(false);
							signOut();
							nav({ to: "/entrar" });
						}}
					>
						<LogOut className="size-4" />
						Sair
					</button>
				</div>
			)}
		</div>
	);
}
