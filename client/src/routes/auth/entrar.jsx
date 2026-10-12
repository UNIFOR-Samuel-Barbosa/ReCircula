import { Link } from "../../components/link";
import { useNavigate } from "../../hooks/useNavigation";
import { ArrowRight } from "lucide-react";
import { Button, Field, Input } from "../../components/ui";
import { useDemoSession } from "../../lib/demo-session";
export default function Page() {
	const nav = useNavigate();
	const { signIn } = useDemoSession();
	return (
		<div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-md place-items-center px-4 py-10">
			<div className="w-full">
				<p className="text-sm font-semibold text-primary">
					Sua comunidade, seus materiais
				</p>
				<h1 className="mt-2 font-display text-3xl font-bold">
					Bem-vindo de volta
				</h1>
				<p className="mt-2 text-sm text-muted-foreground">
					Entre para publicar e gerenciar seus anúncios.
				</p>
				<form
					className="mt-8 grid gap-5"
					onSubmit={(e) => {
						e.preventDefault();
						signIn();
						nav({ to: "/" });
					}}
				>
					<Field label="E-mail">
						<Input type="email" required placeholder="nome@edu.unifor.br" />
					</Field>
					<Field label="Senha">
						<Input type="password" required placeholder="Sua senha" />
					</Field>
					<Link
						to="/recuperar-senha"
						className="justify-self-end text-sm text-primary"
					>
						Esqueci minha senha
					</Link>
					<Button type="submit" className="w-full">
						Entrar
						<ArrowRight className="size-4" />
					</Button>
				</form>
				<p className="mt-6 text-center text-sm text-muted-foreground">
					Ainda não tem conta?{" "}
					<Link to="/cadastro" className="font-semibold text-primary">
						Cadastre-se
					</Link>
				</p>
			</div>
		</div>
	);
}
