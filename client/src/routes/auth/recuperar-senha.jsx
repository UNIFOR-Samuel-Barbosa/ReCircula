import { Link } from "../../components/link";
import { Button, Field, Input } from "../../components/ui";
import { showToast } from "../../service/toast";

export default function Page() {
	return (
		<div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-md place-items-center px-4 py-10">
			<div className="w-full">
				<h1 className="font-display text-3xl font-bold">Recuperar senha</h1>
				<p className="mt-2 text-sm text-muted-foreground">
					Informe seu e-mail para receber as instruções de troca de senha.
				</p>
				<form
					className="mt-8 grid gap-5"
					onSubmit={(e) => {
						e.preventDefault();
						showToast({ text: "Verifique seu e-mail para trocar sua senha." });
					}}
				>
					<Field label="E-mail">
						<Input
							type="email"
							required
							placeholder="nome@edu.unifor.br"
							autoComplete="email"
						/>
					</Field>
					<Button type="submit" className="w-full">
						Enviar instruções
					</Button>
				</form>
				<p className="mt-6 text-center text-sm text-muted-foreground">
					Lembrou sua senha?{" "}
					<Link to="/entrar" className="font-semibold text-primary">
						Voltar ao login
					</Link>
				</p>
			</div>
		</div>
	);
}
