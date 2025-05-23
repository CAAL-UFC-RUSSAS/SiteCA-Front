import ProdutoCardSobreposto, { Produto } from "./ProdutoCardSobreposto";

export default function LojaBanner({ produtos }: { produtos: Produto[] }) {
    // Filtra apenas produtos disponíveis (quantidade > 0)
    const disponiveis = produtos.filter(p => p.disponivel && p.quantidade > 0);
    if (disponiveis.length === 0) return null;

    // O primeiro disponível é o destaque, os próximos 4 são os quadrados
    const destaque = disponiveis[0];
    const quadrados = disponiveis.slice(1, 5);

    return (
        <div className="flex flex-col lg:flex-row gap-2 w-full mx-auto mb-8">
            <div className="lg:w-3/5 w-full">
                <ProdutoCardSobreposto produto={destaque} grande />
            </div>
            <div className="grid grid-cols-2 grid-rows-2 gap-2 lg:w-2/5 w-full">
                {quadrados.map((produto) => (
                    <ProdutoCardSobreposto produto={produto} key={produto.id} quadrado />
                ))}
            </div>
        </div>
    );
} 