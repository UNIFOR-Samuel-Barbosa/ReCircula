import { forwardRef } from "react";
import { cn } from "../lib/utils";
export const Button = forwardRef(function Button(
	{ className, variant = "primary", size = "md", ...props },
	ref
) {
	const variants = {
		primary: "bg-primary text-primary-foreground hover:bg-primary/90",
		secondary:
			"border border-border bg-secondary text-secondary-foreground hover:bg-accent",
		ghost: "text-muted-foreground hover:bg-accent hover:text-foreground",
		danger:
			"bg-destructive text-destructive-foreground hover:bg-destructive/90",
	};
	const sizes = {
		sm: "h-9 px-3 text-sm",
		md: "h-11 px-4 text-sm",
		icon: "size-10",
	};
	return (
		<button
			ref={ref}
			className={cn(
				"inline-flex items-center justify-center gap-2 rounded-md font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
				variants[variant],
				sizes[size],
				className
			)}
			{...props}
		/>
	);
});
export const Input = forwardRef(function Input({ className, ...props }, ref) {
	return (
		<input
			ref={ref}
			className={cn(
				"h-11 w-full rounded-md border border-input bg-card px-3 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20",
				className
			)}
			{...props}
		/>
	);
});
export const Select = forwardRef(function Select({ className, ...props }, ref) {
	return (
		<select
			ref={ref}
			className={cn(
				"h-11 w-full rounded-md border border-input bg-card px-3 text-sm text-foreground outline-none focus:border-primary",
				className
			)}
			{...props}
		/>
	);
});
export const Textarea = forwardRef(function Textarea(
	{ className, ...props },
	ref
) {
	return (
		<textarea
			ref={ref}
			className={cn(
				"min-h-28 w-full resize-none rounded-md border border-input bg-card px-3 py-3 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-primary",
				className
			)}
			{...props}
		/>
	);
});
export function Field({ label, children, hint }) {
	return (
		<label className="grid gap-2 text-sm font-medium text-foreground">
			<span>{label}</span>
			{children}
			{hint && (
				<span className="text-xs font-normal text-muted-foreground">
					{hint}
				</span>
			)}
		</label>
	);
}
