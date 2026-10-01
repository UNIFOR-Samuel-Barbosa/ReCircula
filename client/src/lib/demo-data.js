import calculatorImage from "../assets/calculadora.jpg";
import booksImage from "../assets/livros.jpg";
import coatImage from "../assets/jaleco.jpg";
import electronicsImage from "../assets/kit-eletronica.jpg";
export const listings = [
	{
		id: "calculadora-cientifica",
		title: "Calculadora científica",
		category: "Eletrônicos",
		price: 85,
		donation: false,
		image: calculatorImage,
		seller: "Marina Costa",
		sellerId: "marina",
		course: "Engenharia Civil · 7º semestre",
		time: "Há 2 horas",
		description:
			"Calculadora em ótimo estado, usada por dois semestres. Todas as funções estão funcionando e acompanha capa protetora.",
	},
	{
		id: "livros-engenharia",
		title: "Coleção de livros de engenharia",
		category: "Livros",
		price: 120,
		donation: false,
		image: booksImage,
		seller: "Lucas Almeida",
		sellerId: "lucas",
		course: "Engenharia Mecânica · 9º semestre",
		time: "Ontem",
		description:
			"Três livros essenciais do ciclo básico. Possuem poucas marcações a lápis e estão bem conservados.",
	},
	{
		id: "jaleco-laboratorio",
		title: "Jaleco branco tamanho M",
		category: "Jalecos",
		price: null,
		donation: true,
		image: coatImage,
		seller: "Ana Beatriz",
		sellerId: "ana",
		course: "Farmácia · 6º semestre",
		time: "Há 1 dia",
		description:
			"Jaleco higienizado, sem manchas e com identificação removida. Retirada no campus.",
	},
	{
		id: "kit-eletronica",
		title: "Kit completo de eletrônica",
		category: "Computação",
		price: 65,
		donation: false,
		image: electronicsImage,
		seller: "Rafael Melo",
		sellerId: "rafael",
		course: "Ciência da Computação · 8º semestre",
		time: "Há 3 dias",
		description:
			"Kit para disciplinas de sistemas embarcados: placa, protoboard, sensores, LEDs e cabos.",
	},
	{
		id: "calculo-vol-1",
		title: "Cálculo — Volume 1",
		category: "Livros",
		price: 45,
		donation: false,
		image: booksImage,
		seller: "Marina Costa",
		sellerId: "marina",
		course: "Engenharia Civil · 7º semestre",
		time: "Há 4 dias",
		description: "Livro conservado, edição atual e sem páginas faltando.",
	},
	{
		id: "protoboard",
		title: "Protoboard e jumpers",
		category: "Engenharia",
		price: null,
		donation: true,
		image: electronicsImage,
		seller: "Rafael Melo",
		sellerId: "rafael",
		course: "Ciência da Computação · 8º semestre",
		time: "Há 5 dias",
		description: "Material excedente de projeto, funcionando normalmente.",
	},
];
export const categories = [
	"Todos",
	...Array.from(new Set(listings.map((item) => item.category))),
];
export const currentUser = {
	id: "marina",
	name: "Marina Costa",
	initials: "MC",
	course: "Engenharia Civil · 7º semestre",
	email: "marina@edu.unifor.br",
	phone: "(85) 99999-1204",
	bio: "Dou uma nova vida aos materiais que já cumpriram seu papel comigo. Entregas no campus de segunda a quinta.",
};
export function formatPrice(item) {
	return item.donation
		? "Doação"
		: (item.price?.toLocaleString("pt-BR", {
				style: "currency",
				currency: "BRL",
			}) ?? "A combinar");
}
