import { useState, useRef } from "react";
import {
	BookOpen,
	Search,
	UserPlus,
	ShoppingBag,
	Gift,
	Camera,
	MessageCircle,
	ArrowRight,
	ArrowLeft,
	CheckCircle2,
	Sparkles,
	HelpCircle,
	Lightbulb,
	ChevronDown,
} from "lucide-react";
import { Button } from "../components/ui";
import { Link } from "../components/link";

const steps = [
	{
		shortTitle: "Cadastro",
		icon: UserPlus,
		title: "Crie sua conta",
		description:
			"Cadastre-se com seus dados para ter acesso completo. Basta informar nome, e-mail e criar uma senha segura.",
		details: [
			'Acesse a tela de cadastro pelo botão "Entrar" ou cadastre-se direto',
			"Preencha seus dados — nome, e-mail universitário e senha",
			"Pronto! Sua conta estará pronta para publicar e negociar no campus",
		],
		color: "text-primary",
		bgColor: "bg-primary/10",
		borderColor: "border-primary/30",
	},
	{
		shortTitle: "Explorar",
		icon: Search,
		title: "Explore os anúncios",
		description:
			"Na página inicial, navegue pela vitrine de materiais acadêmicos. Use filtros de categoria, busca por texto e ordenação.",
		details: [
			"Use a barra de busca inteligente para pesquisar pelo nome do material",
			"Filtre por categoria: livros, calculadoras, jalecos, anotações e mais",
			'Ative o filtro "Somente doações" para encontrar materiais gratuitos',
		],
		color: "text-emerald-400",
		bgColor: "bg-emerald-400/10",
		borderColor: "border-emerald-400/30",
	},
	{
		shortTitle: "Detalhes",
		icon: ShoppingBag,
		title: "Veja os detalhes do item",
		description:
			"Clique em qualquer anúncio para ver fotos em alta resolução, descrição completa, preço e informações de contato do estudante.",
		details: [
			"Veja fotos e a descrição do estado de conservação do material",
			"Confira o valor ou se trata de uma doação solidária",
			"Acesse o perfil do vendedor para ver reputação e outros itens",
		],
		color: "text-sky-400",
		bgColor: "bg-sky-400/10",
		borderColor: "border-sky-400/30",
	},
	{
		shortTitle: "Publicar",
		icon: Camera,
		title: "Publique seu anúncio",
		description:
			"Tem algo que não usa mais? Publique em poucos segundos. Adicione fotos, escolha a categoria e defina seu preço justo.",
		details: [
			'Toque em "Publicar anúncio" no topo da página ou no menu',
			"Envie fotos nítidas do material e escreva um título explicativo",
			"Defina a categoria e informe o valor de venda ou marque como doação",
		],
		color: "text-amber-400",
		bgColor: "bg-amber-400/10",
		borderColor: "border-amber-400/30",
	},
	{
		shortTitle: "Doações",
		icon: Gift,
		title: "Doe materiais acadêmicos",
		description:
			"O ReCircula incentiva a economia circular no campus. Ao doar o que você já usou, você apoia outros estudantes sem custo algum.",
		details: [
			'Ao publicar seu anúncio, basta marcar a opção "Doação"',
			"Seu item ganha destaque com selo especial de doação na vitrine",
			"Ajude calouros e colegas de curso a economizarem nos estudos",
		],
		color: "text-rose-400",
		bgColor: "bg-rose-400/10",
		borderColor: "border-rose-400/30",
	},
	{
		shortTitle: "Painel",
		icon: MessageCircle,
		title: "Gerencie pelo painel",
		description:
			"Acompanhe todos os seus anúncios publicados em um único lugar. Você pode editar valores, pausar ou excluir itens quando quiser.",
		details: [
			'Acesse a aba "Meus anúncios" na barra de navegação',
			"Atualize fotos, valores e descrições a qualquer momento",
			"Mantenha seus dados e fotos de perfil sempre em dia",
		],
		color: "text-violet-400",
		bgColor: "bg-violet-400/10",
		borderColor: "border-violet-400/30",
	},
];

function StepIndicator({ current, total, onSelect }) {
	return (
		<div className="flex items-center gap-1.5" role="tablist" aria-label="Passos do tutorial">
			{Array.from({ length: total }, (_, i) => (
				<button
					key={i}
					role="tab"
					aria-selected={i === current}
					onClick={() => onSelect(i)}
					aria-label={`Ir para o passo ${i + 1}`}
					className="group flex h-7 items-center p-1 cursor-pointer focus-visible:outline-none"
				>
					<span
						className={`h-2 rounded-full transition-all duration-300 ${
							i === current
								? "w-7 sm:w-8 bg-primary shadow-sm shadow-primary/30"
								: "w-2 bg-muted-foreground/30 group-hover:bg-muted-foreground/60"
						}`}
					/>
				</button>
			))}
		</div>
	);
}

function StepCard({ step, index, isActive }) {
	return (
		<div
			className={`rounded-xl border p-4 sm:p-5 transition-all duration-200 ${
				isActive
					? `${step.borderColor} bg-card shadow-md shadow-primary/5 ring-1 ring-primary/20`
					: "border-border/80 bg-card/40 opacity-75 hover:opacity-100 hover:border-border hover:bg-card/70"
			}`}
		>
			<div className="flex items-start gap-3 sm:gap-4">
				<div
					className={`grid size-10 sm:size-11 shrink-0 place-items-center rounded-lg ${step.bgColor}`}
				>
					<step.icon className={`size-5 ${step.color}`} />
				</div>
				<div className="min-w-0 flex-1">
					<div className="mb-0.5 flex items-center justify-between gap-2">
						<span className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-muted-foreground">
							Passo {index + 1}
						</span>
						{isActive && (
							<span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
								Visualizando
							</span>
						)}
					</div>
					<h3 className="font-display text-base sm:text-lg font-semibold text-foreground">
						{step.title}
					</h3>
					<p className="mt-1 text-xs sm:text-sm leading-relaxed text-muted-foreground">
						{step.description}
					</p>
				</div>
			</div>

			{isActive && (
				<div className="mt-4 border-t border-border/50 pt-3 space-y-2.5 sm:pl-14">
					{step.details.map((detail, i) => (
						<div key={i} className="flex items-start gap-2.5">
							<CheckCircle2
								className={`mt-0.5 size-4 shrink-0 ${step.color}`}
							/>
							<span className="text-xs sm:text-sm text-foreground/90">
								{detail}
							</span>
						</div>
					))}
				</div>
			)}
		</div>
	);
}

export default function Tutorial() {
	const [currentStep, setCurrentStep] = useState(0);
	const activeCardRef = useRef(null);

	const selectStep = (index) => {
		setCurrentStep(index);
		if (window.innerWidth < 1024 && activeCardRef.current) {
			activeCardRef.current.scrollIntoView({ behavior: "smooth", block: "nearest" });
		}
	};

	const goNext = () => {
		setCurrentStep((prev) => {
			const next = Math.min(prev + 1, steps.length - 1);
			if (window.innerWidth < 1024 && activeCardRef.current) {
				activeCardRef.current.scrollIntoView({ behavior: "smooth", block: "nearest" });
			}
			return next;
		});
	};

	const goPrev = () => {
		setCurrentStep((prev) => {
			const prevIndex = Math.max(prev - 1, 0);
			if (window.innerWidth < 1024 && activeCardRef.current) {
				activeCardRef.current.scrollIntoView({ behavior: "smooth", block: "nearest" });
			}
			return prevIndex;
		});
	};

	const currentStepData = steps[currentStep];
	const CurrentIcon = currentStepData.icon;
	const progressPercent = Math.round(((currentStep + 1) / steps.length) * 100);

	return (
		<>
			{/* Hero */}
			<section className="border-b border-border bg-linear-to-b from-primary/5 via-transparent to-transparent">
				<div className="mx-auto max-w-7xl px-4 py-8 sm:py-12 lg:px-8 lg:py-16">
					<div className="max-w-3xl">
						<div className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
							<Lightbulb className="size-3.5" />
							Guia do estudante
						</div>
						<h1 className="font-display text-2xl font-bold leading-tight sm:text-4xl lg:text-5xl">
							Como usar o <span className="text-primary">ReCircula</span>
						</h1>
						<p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base sm:leading-7 lg:text-lg">
							Descubra como comprar, vender e doar materiais acadêmicos com
							facilidade. Economia circular, direto no campus e sem complicação.
						</p>

						{/* Botões rápidos de navegação no mobile/desktop */}
						<div className="mt-5 flex flex-wrap items-center gap-2.5">
							<button
								onClick={() => {
									const el = document.getElementById("passo-a-passo");
									el?.scrollIntoView({ behavior: "smooth" });
								}}
								className="inline-flex items-center gap-2 rounded-lg bg-primary/15 px-3.5 py-2 text-xs font-medium text-primary hover:bg-primary/25 cursor-pointer transition-colors"
							>
								<BookOpen className="size-3.5" />
								Ir para o passo a passo
							</button>
							<button
								onClick={() => {
									const el = document.getElementById("faq");
									el?.scrollIntoView({ behavior: "smooth" });
								}}
								className="inline-flex items-center gap-2 rounded-lg border border-border px-3.5 py-2 text-xs font-medium text-muted-foreground hover:bg-card hover:text-foreground cursor-pointer transition-colors"
							>
								<HelpCircle className="size-3.5" />
								Perguntas frequentes
							</button>
						</div>
					</div>
				</div>
			</section>

			{/* Tutorial interativo */}
			<section
				id="passo-a-passo"
				className="mx-auto max-w-7xl px-4 py-8 sm:py-10 lg:px-8"
			>
				{/* Cabeçalho da seção */}
				<div className="mb-4 flex flex-col gap-3 sm:mb-6 sm:flex-row sm:items-center sm:justify-between">
					<div>
						<h2 className="font-display text-xl sm:text-2xl font-semibold">
							Passo a passo interativo
						</h2>
						<p className="text-xs sm:text-sm text-muted-foreground">
							Navegue pelos passos abaixo para dominar a plataforma
						</p>
					</div>
					<div className="flex items-center justify-between sm:justify-end gap-3">
						<span className="text-xs font-medium text-muted-foreground">
							Passo {currentStep + 1} de {steps.length}
						</span>
						<StepIndicator
							current={currentStep}
							total={steps.length}
							onSelect={selectStep}
						/>
					</div>
				</div>

				{/* Pílulas horizontais de navegação rápida (especialmente útil no mobile) */}
				<div className="mb-6 flex gap-2 overflow-x-auto pb-2 scrollbar-none sm:hidden">
					{steps.map((step, idx) => {
						const Icon = step.icon;
						const isSelected = idx === currentStep;
						return (
							<button
								key={idx}
								onClick={() => selectStep(idx)}
								className={`flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all cursor-pointer ${
									isSelected
										? "bg-primary text-primary-foreground shadow-sm shadow-primary/25"
										: "border border-border bg-card/60 text-muted-foreground hover:bg-card hover:text-foreground"
								}`}
							>
								<Icon className="size-3.5" />
								<span>{step.shortTitle}</span>
							</button>
						);
					})}
				</div>

				<div className="grid gap-6 lg:grid-cols-2">
					{/* Card ativo em destaque (sticky em desktop) */}
					<div
						ref={activeCardRef}
						className="lg:sticky lg:top-24 lg:self-start"
					>
						<div
							className={`rounded-2xl border ${currentStepData.borderColor} bg-card p-5 sm:p-7 shadow-xl shadow-primary/5 transition-all duration-300`}
						>
							{/* Barra de progresso discreta no topo do card */}
							<div className="mb-5 h-1.5 w-full overflow-hidden rounded-full bg-secondary">
								<div
									className="h-full bg-primary transition-all duration-300"
									style={{ width: `${progressPercent}%` }}
								/>
							</div>

							<div className="flex items-start justify-between gap-4">
								<div
									className={`inline-flex size-12 sm:size-14 items-center justify-center rounded-xl ${currentStepData.bgColor}`}
								>
									<CurrentIcon
										className={`size-6 sm:size-7 ${currentStepData.color}`}
									/>
								</div>
								<span className="rounded-full border border-border bg-secondary/80 px-2.5 py-1 text-[11px] font-semibold text-muted-foreground">
									{progressPercent}% concluído
								</span>
							</div>

							<div className="mt-4">
								<span className="block text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
									Passo {currentStep + 1} de {steps.length}
								</span>
								<h3 className="mt-1 font-display text-xl sm:text-2xl font-bold text-foreground">
									{currentStepData.title}
								</h3>
								<p className="mt-2 text-sm leading-relaxed text-muted-foreground">
									{currentStepData.description}
								</p>
							</div>

							{/* Checklist de detalhes */}
							<div className="mt-5 space-y-3 rounded-xl border border-border/50 bg-secondary/30 p-3.5 sm:p-4">
								<p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
									O que você faz nesta etapa:
								</p>
								{currentStepData.details.map((detail, i) => (
									<div key={i} className="flex items-start gap-2.5">
										<CheckCircle2
											className={`mt-0.5 size-4 shrink-0 ${currentStepData.color}`}
										/>
										<span className="text-xs sm:text-sm text-foreground/90">
											{detail}
										</span>
									</div>
								))}
							</div>

							{/* Botões de navegação */}
							<div className="mt-6 flex items-center justify-between gap-3 pt-2">
								<Button
									variant="ghost"
									size="sm"
									onClick={goPrev}
									disabled={currentStep === 0}
									className={
										currentStep === 0
											? "invisible"
											: "h-10 px-3 text-xs sm:text-sm cursor-pointer"
									}
								>
									<ArrowLeft className="size-4" />
									Anterior
								</Button>

								{currentStep < steps.length - 1 ? (
									<Button
										size="sm"
										onClick={goNext}
										className="h-10 px-4 text-xs sm:text-sm cursor-pointer shadow-sm shadow-primary/20"
									>
										Próximo passo
										<ArrowRight className="size-4" />
									</Button>
								) : (
									<Link to="/">
										<Button
											size="sm"
											className="h-10 px-4 text-xs sm:text-sm cursor-pointer shadow-sm shadow-primary/20"
										>
											<Sparkles className="size-4" />
											Começar agora
										</Button>
									</Link>
								)}
							</div>
						</div>
					</div>

					{/* Lista completa de todos os passos */}
					<div className="space-y-3">
						<div className="flex items-center justify-between px-1">
							<span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
								Todos os passos
							</span>
							<span className="text-xs text-muted-foreground sm:hidden">
								Toque para visualizar
							</span>
						</div>

						{steps.map((step, index) => (
							<button
								key={index}
								onClick={() => selectStep(index)}
								className="w-full cursor-pointer text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-xl"
							>
								<StepCard
									step={step}
									index={index}
									isActive={index === currentStep}
								/>
							</button>
						))}
					</div>
				</div>
			</section>

			{/* FAQ */}
			<section id="faq" className="border-t border-border bg-card/20" data-faq>
				<div className="mx-auto max-w-7xl px-4 py-10 sm:py-14 lg:px-8">
					<div className="mb-6 flex items-center gap-2 sm:mb-8">
						<div className="grid size-8 place-items-center rounded-lg bg-primary/10 text-primary">
							<HelpCircle className="size-4.5" />
						</div>
						<div>
							<h2 className="font-display text-xl sm:text-2xl font-semibold">
								Dúvidas frequentes
							</h2>
							<p className="text-xs sm:text-sm text-muted-foreground">
								Respostas rápidas sobre o funcionamento da plataforma
							</p>
						</div>
					</div>

					<div className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
						{[
							{
								q: "Preciso pagar para usar?",
								a: "Não! O ReCircula é 100% gratuito e sem cobrança de taxas entre os estudantes.",
							},
							{
								q: "Quem pode publicar anúncios?",
								a: "Qualquer estudante cadastrado pode anunciar seus livros, equipamentos e materiais acadêmicos.",
							},
							{
								q: "Como funciona a doação?",
								a: 'Ao criar um anúncio, basta marcar a opção "Doação". O anúncio fica destacado com selo gratuito na vitrine.',
							},
							{
								q: "Posso editar meu anúncio depois?",
								a: 'Sim! Na aba "Meus anúncios" você pode alterar preço, descrição, fotos ou remover o anúncio quando for vendido.',
							},
							{
								q: "Como entro em contato com o anunciante?",
								a: "Abra a página do anúncio e acesse o perfil do estudante para ver os canais de contato cadastrados.",
							},
							{
								q: "Como recuperar minha senha?",
								a: 'Na tela de login, clique em "Esqueceu sua senha?" e informe seu e-mail para receber as instruções de recuperação.',
							},
						].map((faq, i) => (
							<div
								key={i}
								className="rounded-xl border border-border/80 bg-card p-4 sm:p-5 transition-all hover:border-border"
							>
								<h3 className="font-semibold text-sm sm:text-base text-foreground">
									{faq.q}
								</h3>
								<p className="mt-2 text-xs sm:text-sm leading-relaxed text-muted-foreground">
									{faq.a}
								</p>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* CTA final */}
			<section className="border-t border-border">
				<div className="mx-auto max-w-7xl px-4 py-10 sm:py-14 text-center lg:px-8">
					<div className="mx-auto mb-4 grid size-12 place-items-center rounded-2xl bg-primary/10 text-primary">
						<Sparkles className="size-6" />
					</div>
					<h2 className="font-display text-2xl sm:text-3xl font-bold">
						Tudo pronto para começar?
					</h2>
					<p className="mx-auto mt-2.5 max-w-md text-xs sm:text-sm leading-relaxed text-muted-foreground">
						Explore os materiais disponíveis no campus ou anuncie o que você já
						não usa mais.
					</p>

					{/* Botões empilhados no mobile e lado a lado em telas maiores */}
					<div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3 max-w-xs sm:max-w-none mx-auto">
						<Link to="/" className="w-full sm:w-auto">
							<Button className="w-full sm:w-auto h-11 px-6 text-sm cursor-pointer shadow-sm shadow-primary/20">
								<Search className="size-4" />
								Explorar materiais
							</Button>
						</Link>
						<Link to="/publicar" className="w-full sm:w-auto">
							<Button
								variant="secondary"
								className="w-full sm:w-auto h-11 px-6 text-sm cursor-pointer"
							>
								<Camera className="size-4" />
								Publicar anúncio
							</Button>
						</Link>
					</div>
				</div>
			</section>
		</>
	);
}
