import { buildHref, navigate, useNavigation } from "../hooks/useNavigation";

export function Link({
	to,
	params,
	search,
	activeOptions,
	className = "",
	onClick,
	...props
}) {
	const { pathname: currentPath } = useNavigation();
	const href = buildHref(to, params, search);
	const targetPath = href.split(/[?#]/, 1)[0];
	const isActive = activeOptions?.exact
		? currentPath === targetPath
		: currentPath === targetPath || currentPath.startsWith(`${targetPath}/`);

	return (
		<a
			{...props}
			href={href}
			className={`${className}${isActive ? " active" : ""}`.trim()}
			aria-current={isActive ? "page" : undefined}
			onClick={(event) => {
				onClick?.(event);
				if (
					event.defaultPrevented ||
					event.button !== 0 ||
					event.metaKey ||
					event.ctrlKey ||
					event.shiftKey ||
					event.altKey
				) {
					return;
				}
				event.preventDefault();
				navigate({ to, params, search });
			}}
		/>
	);
}
