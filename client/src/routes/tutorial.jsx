import { useState } from "react";
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
} from "lucide-react";
import { Button } from "../components/ui";
import { Link } from "../components/link";

const steps = [
	{
		icon: UserPlus,
		title: "Crie sua conta",
		description:
			"Cadastre-se com seus dados para ter acesso completo. Basta informar nome, e-mail e criar uma senha segura.",
		details: [
			'Acesse a tela de cadastro pelo botão "Entrar"',
			"Preencha seus dados \u2014 nome, e-mail e senha",
			"Pronto! Você já pode publicar e negociar",
		],
		color: "text-primary",
		bgColor: "bg-primary/10",
		borderColor: "border-primary/20",
	},
	{
		icon: Search,
		title: "Explore os anúncios",
		description:
			"Na página inicial, navegue pela vitrine de materiais acadêmicos. Use filtros de categoria, busca por texto e ordenação.",
		details: [
			"Use a barra de busca para pesquisar por nome do item",
			"Filtre por categoria \u2014 livros, calculadoras, jalecos e mais",
			'Marque "Somente doações" para ver itens gratuitos',
		],
		color: "text-emerald-400",
		bgColor: "bg-emerald-400/10",
		borderColor: "border-emerald-400/20",
	},
	{
		icon: ShoppingBag,
		title: "Veja os detalhes",
		description:
			"Clique em qualquer anúncio para ver fotos, descrição completa, pre\u00e7o e informações do vendedor.",
		details: [
			"Veja a foto e a descrição completa do material",
			"Confira o pre\u00e7o ou se é uma doação",
			"Acesse o perfil do vendedor para saber mais",
		],
		color: "text-sky-400",
		bgColor: "bg-sky-400/10",
		borderColor: "border-sky-400/20",
	},
	{
		icon: Camera,
		title: "Publique um anúncio",
		description:
			"Tem algo que não usa mais? Publique em poucos passos. Adicione uma foto, escreva um título, escolha a categoria e defina o pre\u00e7o.",
		details: [
			'Clique em "Publicar anúncio" na barra superior',
			"Adicione uma foto do material e preencha os dados",
			"Escolha a categoria, defina o pre\u00e7o ou marque como doação",
		],
		color: "text-amber-400",
		bgColor: "bg-amber-400/10",
		borderColor: "border-amber-400/20",
	},
	{
		icon: Gift,
		title: "Doe materiais",
		description:
			"O ReCircula incentiva a economia circular. Marque a opção de doação ao publicar e contribua para a comunidade.",
		details: [
			'Ao publicar, marque a opção "Doação"',
			"Seu anúncio aparecerá com destaque na aba de doações",
			"Contribua para a comunidade acadêmica de forma solidária",
		],
		color: "text-rose-400",
		bgColor: "bg-rose-400/10",
		borderColor: "border-rose-400/20",
	},
	{
		icon: MessageCircle,
		title: "Gerencie seu painel",
		description:
			"Acompanhe todos os seus anúncios publicados. Edite, pause ou exclua qualquer publicação. Atualize seu perfil a qualquer momento.",
		details: [
			'Acesse "Meus anúncios" para gerenciar suas publicações',
			"Edite título, pre\u00e7o, fotos e descrição quando quiser",
			"No seu perfil, atualize foto e informações pessoais",
		],
		color: "text-violet-400",
		bgColor: "bg-violet-400/10",
		borderColor: "border-violet-400/20",
	},
];

function StepIndicator({ current, total, onSelect }) {
	return (
		<div className="flex items-center gap-2">
			{Array.from({ length: total }, (_, i) => (
				<button
					key={i}
					onClick={() => onSelect(i)}
					aria-label={`Ir para o passo ${i + 1}`}
					className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
						i === current
							? "w-8 bg-primary"
							: "w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50"
					}`}
				/>
			))}
		</div>
	);
}

function StepCard({ step, index, isActive }) {
	return (
		<div
			className={`rounded-xl border p-6 transition-all duration-300 ${
				isActive
					? `${step.borderColor} bg-card shadow-lg shadow-primary/5`
					: "border-border bg-card/50 opacity-60"
			}`}
		>
			<div className="flex items-start gap-4">
				<div
					className={`grid size-12 shrink-0 place-items-center rounded-lg ${step.bgColor}`}
				>
					<step.icon className={`size-6 ${step.color}`} />
				</div>
				<div className="min-w-0 flex-1">
					<div className="mb-1 flex items-center gap-2">
						<span className="text-xs font-semibold text-muted-foreground">
							Passo {index + 1}
						</span>
					</div>
					<h3 className="font-display text-lg font-semibold">
						{step.title}
					</h3>
					<p className="mt-2 text-sm leading-relaxed text-muted-foreground">
						{step.description}
					</p>
				</div>
			</div>

			{isActive && (
				<div className="mt-5 space-y-3 pl-16">
					{step.details.map((detail, i) => (
						<div key={i} className="flex items-start gap-3">
							<CheckCircle2
								className={`mt-0.5 size-4 shrink-0 ${step.color}`}
							/>
							<span className="text-sm text-foreground/80">
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

	const goNext = () =>
		setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
	const goPrev = () => setCurrentStep((prev) => Math.max(prev - 1, 0));

	return (
		<>
			{/* Hero */}
			<section className="border-b border-border">
				<div className="mx-auto max-w-7xl px-4 py-12 lg:px-8 lg:py-18">
					<div className="max-w-3xl">
						<div className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-primary">
							<BookOpen className="size-4" />
							Guia do iniciante
						</div>
						<h1 className="font-display text-4xl font-bold leading-tight sm:text-5xl">
							Como usar o <span className="text-primary">ReCircula</span>
						</h1>
						<p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
							Aprenda em poucos passos como comprar, vender e doar materiais
							acad&ecirc;micos na plataforma. Tudo simples, direto e feito para
							a comunidade universit&aacute;ria.
						</p>
					</div>
				</div>
			</section>

			{/* Tutorial interativo */}
			<section className="mx-auto max-w-7xl px-4 py-10 lg:px-8">
				<div className="mb-8 flex items-center justify-between">
					<h2 className="font-display text-2xl font-semibold">Passo a passo</h2>
					<StepIndicator
						current={currentStep}
						total={steps.length}
						onSelect={setCurrentStep}
					/>
				</div>

				<div className="grid gap-4 lg:grid-cols-2">
					{/* Passo ativo em destaque */}
					<div className="lg:sticky lg:top-24 lg:self-start">
						<div
							className={`rounded-2xl border p-8 ${steps[currentStep].borderColor} bg-card shadow-xl shadow-primary/5`}
						>
							<div
								className={`mb-6 inline-flex size-16 items-center justify-center rounded-xl ${steps[currentStep].bgColor}`}
							>
								{(() => {
									const Icon = steps[currentStep].icon;
									return (
										<Icon className={`size-8 ${steps[currentStep].color}`} />
									);
								})()}
							</div>
							<span className="mb-2 block text-xs font-bold uppercase tracking-wider text-muted-foreground">
								Passo {currentStep + 1} de {steps.length}
							</span>
							<h3 className="font-display text-2xl font-bold">
								{steps[currentStep].title}
							</h3>
							<p className="mt-3 leading-relaxed text-muted-foreground">
								{steps[currentStep].description}
							</p>
							<div className="mt-6 space-y-4">
								{steps[currentStep].details.map((detail, i) => (
									<div key={i} className="flex items-start gap-3">
										<CheckCircle2
											className={`mt-0.5 size-5 shrink-0 ${steps[currentStep].color}`}
										/>
										<span className="text-sm text-foreground/90">{detail}</span>
									</div>
								))}
							</div>
							<div className="mt-8 flex items-center justify-between">
								<Button
									variant="ghost"
									onClick={goPrev}
									className={currentStep === 0 ? "invisible" : undefined}
								>
									<ArrowLeft className="size-4" />
									Anterior
								</Button>
								{currentStep < steps.length - 1 ? (
									<Button onClick={goNext}>
										Próximo
										<ArrowRight className="size-4" />
									</Button>
								) : (
									<Link to="/">
										<Button>
											<Sparkles className="size-4" />
											Começar a explorar
										</Button>
									</Link>
								)}
							</div>
						</div>
					</div>

					{/* Lista de passos */}
					<div className="space-y-3">
						{steps.map((step, index) => (
							<button
								key={index}
								onClick={() => setCurrentStep(index)}
								className="w-full cursor-pointer text-left"
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
			<section className="border-t border-border" data-faq>
				<div className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
					<div className="mb-8 flex items-center gap-2">
						<HelpCircle className="size-5 text-primary" />
						<h2 className="font-display text-2xl font-semibold">
							Perguntas frequentes
						</h2>
					</div>
					<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
						{[
							{
								q: "Preciso pagar para usar?",
								a: "Não! O ReCircula é totalmente gratuita e sem taxas para estudantes.",
							},
							{
								q: "Quem pode publicar anúncios?",
								a: "Qualquer estudante cadastrado pode publicar anúncios de materiais acadêmicos.",
							},
							{
								q: "Como funciona a doação?",
								a: "Ao criar um anúncio, marque a opção de doação. O item aparecerá com destaque na seção de doações.",
							},
							{
								q: "Posso editar meu anúncio?",
								a: "Sim! No painel de anúncios você pode editar, pausar ou excluir suas publicações a qualquer momento.",
							},
							{
								q: "Como entro em contato com o vendedor?",
								a: "Acesse o perfil do vendedor no anúncio para ver as informações de contato disponíveis.",
							},
							{
								q: "Esqueci minha senha, e agora?",
								a: 'Na tela de login, clique em "Esqueceu a senha?" e siga as instruções para redefinir por e-mail.',
							},
						].map((faq, i) => (
							<div
								key={i}
								className="rounded-xl border border-border bg-card p-5"
							>
								<h3 className="font-semibold text-foreground">{faq.q}</h3>
								<p className="mt-2 text-sm leading-relaxed text-muted-foreground">
									{faq.a}
								</p>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* CTA final */}
			<section className="border-t border-border">
				<div className="mx-auto max-w-7xl px-4 py-14 text-center lg:px-8">
					<Sparkles className="mx-auto mb-4 size-8 text-primary" />
					<h2 className="font-display text-3xl font-bold">
						Pronto para começar?
					</h2>
					<p className="mx-auto mt-3 max-w-md text-muted-foreground">
						Explore os anúncios disponíveis ou publique o seu primeiro
						material acadêmico agora mesmo.
					</p>
					<div className="mt-8 flex flex-wrap items-center justify-center gap-3">
						<Link to="/">
							<Button className="h-12 px-6 text-base">
								<Search className="size-5" />
								Explorar anúncios
							</Button>
						</Link>
						<Link to="/publicar">
							<Button variant="secondary" className="h-12 px-6 text-base">
								<Camera className="size-5" />
								Publicar anúncio
							</Button>
						</Link>
					</div>
				</div>
			</section>
		</>
	);
}
