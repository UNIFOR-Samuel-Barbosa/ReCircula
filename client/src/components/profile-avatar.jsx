import { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { Camera, X } from "lucide-react";

/**
 * Componente de foto de perfil com suporte a:
 * - Preview ampliado mantendo o formato redondo ao segurar o clique/toque (quando fora do modo edição).
 *   O preview permanece aberto após segurar e só fecha com clique fora da foto ou tecla Escape.
 * - Botão pequeno sobrepondo a foto no canto inferior direito para adicionar/alterar foto (quando em modo edição).
 */
export function ProfileAvatar({
	src,
	alt = "Usuário",
	initials = "U",
	size = "size-24",
	isEditing = false,
	onEditClick,
	className = "",
}) {
	const [isPreviewOpen, setIsPreviewOpen] = useState(false);
	const timerRef = useRef(null);
	const isHoldingRef = useRef(false);
	const startPosRef = useRef({ x: 0, y: 0 });
	const openedAtRef = useRef(0);

	const clearHoldTimer = useCallback(() => {
		if (timerRef.current) {
			clearTimeout(timerRef.current);
			timerRef.current = null;
		}
		isHoldingRef.current = false;
	}, []);

	const closePreview = useCallback(() => {
		clearHoldTimer();
		setIsPreviewOpen(false);
	}, [clearHoldTimer]);

	const handlePointerDown = (e) => {
		if (isEditing) return;
		// Apenas clique principal (botão esquerdo ou toque)
		if (e.button !== undefined && e.button !== 0) return;

		startPosRef.current = { x: e.clientX, y: e.clientY };
		isHoldingRef.current = true;

		if (timerRef.current) {
			clearTimeout(timerRef.current);
		}

		timerRef.current = setTimeout(() => {
			if (isHoldingRef.current) {
				openedAtRef.current = Date.now();
				setIsPreviewOpen(true);
				if (typeof navigator !== "undefined" && navigator.vibrate) {
					try {
						navigator.vibrate(40);
					} catch {
						// Ignora navegadores sem suporte
					}
				}
			}
		}, 350);
	};

	const handlePointerMove = (e) => {
		if (!isHoldingRef.current) return;
		const dx = Math.abs(e.clientX - startPosRef.current.x);
		const dy = Math.abs(e.clientY - startPosRef.current.y);
		// Se o usuário arrastar (scroll em telas touch) antes de abrir, cancela o timer
		if (dx > 12 || dy > 12) {
			clearHoldTimer();
		}
	};

	const handlePointerUp = () => {
		clearHoldTimer();
	};

	const handleContextMenu = (e) => {
		if (isHoldingRef.current || isPreviewOpen) {
			e.preventDefault();
		}
	};

	const handleBackdropClick = () => {
		// Evita que o clique de liberação do mesmo toque feche o modal imediatamente
		if (Date.now() - openedAtRef.current < 250) return;
		closePreview();
	};

	// Fecha ao pressionar Escape
	useEffect(() => {
		if (!isPreviewOpen) return;

		const handleKeyDown = (e) => {
			if (e.key === "Escape") {
				closePreview();
			}
		};

		window.addEventListener("keydown", handleKeyDown);
		return () => {
			window.removeEventListener("keydown", handleKeyDown);
		};
	}, [closePreview, isPreviewOpen]);

	// Limpa timer ao desmontar
	useEffect(() => {
		return () => {
			if (timerRef.current) {
				clearTimeout(timerRef.current);
			}
		};
	}, []);

	const previewModal =
		isPreviewOpen && typeof document !== "undefined"
			? createPortal(
					<div
						className="fixed inset-0 z-70 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm p-4 select-none animate-in fade-in duration-200 cursor-pointer"
						onClick={handleBackdropClick}
						role="dialog"
						aria-modal="true"
						aria-label={`Foto de perfil ampliada de ${alt}`}
					>
						<button
							type="button"
							onClick={closePreview}
							className="absolute top-4 right-4 grid size-10 place-items-center rounded-full bg-secondary/80 text-foreground hover:bg-secondary transition-colors cursor-pointer"
							aria-label="Fechar pré-visualização"
						>
							<X className="size-5" />
						</button>

						<div
							className="relative size-64 sm:size-80 md:size-96 shrink-0 overflow-hidden rounded-full border-4 border-primary/50 bg-secondary shadow-2xl transition-transform scale-100 animate-in zoom-in-95 duration-200 select-none cursor-default"
							onClick={(e) => e.stopPropagation()}
						>
							{src ? (
								<img
									src={src}
									alt={alt}
									className="size-full object-cover select-none pointer-events-none"
									draggable={false}
								/>
							) : (
								<div className="grid size-full place-items-center font-display text-7xl sm:text-8xl font-bold text-foreground select-none">
									{initials}
								</div>
							)}
						</div>
						{alt && (
							<p
								className="mt-4 max-w-xs truncate text-center font-display text-lg font-semibold text-foreground drop-shadow cursor-default"
								onClick={(e) => e.stopPropagation()}
							>
								{alt}
							</p>
						)}
					</div>,
					document.body
				)
			: null;

	return (
		<>
			<div className={`relative inline-block ${size} shrink-0 ${className}`}>
				<div
					onPointerDown={handlePointerDown}
					onPointerMove={handlePointerMove}
					onPointerUp={handlePointerUp}
					onPointerCancel={handlePointerUp}
					onPointerLeave={handlePointerUp}
					onContextMenu={handleContextMenu}
					onClick={isEditing ? onEditClick : undefined}
					className={`grid size-full place-items-center overflow-hidden rounded-full bg-secondary font-display text-2xl font-bold select-none cursor-pointer ${
						isEditing
							? "ring-2 ring-primary/40 hover:ring-primary transition-all"
							: "active:scale-98 transition-transform"
					}`}
					title={
						isEditing
							? "Clique para alterar a foto de perfil"
							: "Segure para ampliar a foto de perfil"
					}
				>
					{src ? (
						<img
							src={src}
							alt={alt}
							className="size-full object-cover select-none pointer-events-none"
							draggable={false}
						/>
					) : (
						<span>{initials}</span>
					)}
				</div>

				{isEditing && (
					<button
						type="button"
						onClick={(e) => {
							e.stopPropagation();
							onEditClick?.();
						}}
						className="absolute bottom-0 right-0 grid size-8 place-items-center rounded-full bg-primary text-primary-foreground shadow-md ring-2 ring-background transition-transform hover:scale-110 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-pointer"
						aria-label="Adicionar ou alterar foto de perfil"
						title="Adicionar ou alterar foto de perfil"
					>
						<Camera className="size-4" />
					</button>
				)}
			</div>

			{previewModal}
		</>
	);
}
