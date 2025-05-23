import { useState, useMemo } from 'react';
import ProdutoCardSobreposto from './ProdutoCardSobreposto';
import { Produto } from '@/types/produto';

const todasCores = [
    "vermelho",
    "azul",
    "preto",
    "branco",
    "amarelo",
    "verde",
    "rosa",
    "roxo",
    "laranja",
    "marrom",
    "cinza",
    "bege",
    "dourado",
    "prata"
];

interface ProdutoListagemProps {
    produtos: Produto[];
}

export default function ProdutoListagem({ produtos }: ProdutoListagemProps) {
    const [busca, setBusca] = useState("");
    const [cor, setCor] = useState("");
    const [tag, setTag] = useState("");
    const [disponivel, setDisponivel] = useState(false);
    const [ordem, setOrdem] = useState("");

    // Extrair todas as tags únicas
    const todasTags = useMemo(() => {
        const tags = new Set<string>();
        produtos.forEach(p => p.tags.forEach(t => tags.add(t)));
        return Array.from(tags);
    }, [produtos]);

    // Cores realmente presentes nos produtos
    const coresDisponiveis = useMemo(() => {
        return todasCores.filter(cor => produtos.some(p => p.tags.includes(cor)));
    }, [produtos]);

    // Filtro e ordenação
    const produtosFiltrados = useMemo(() => {
        let filtrados = produtos.filter(p =>
            (!busca || p.nome.toLowerCase().includes(busca.toLowerCase())) &&
            (!cor || p.tags.includes(cor)) &&
            (!tag || p.tags.includes(tag)) &&
            (!disponivel || p.disponivel)
        );
        if (ordem === "maior") {
            filtrados = filtrados.slice().sort((a, b) => {
                const precoA = parseFloat(a.preco.replace(/[^\d,]/g, '').replace(',', '.'));
                const precoB = parseFloat(b.preco.replace(/[^\d,]/g, '').replace(',', '.'));
                return precoB - precoA;
            });
        } else if (ordem === "menor") {
            filtrados = filtrados.slice().sort((a, b) => {
                const precoA = parseFloat(a.preco.replace(/[^\d,]/g, '').replace(',', '.'));
                const precoB = parseFloat(b.preco.replace(/[^\d,]/g, '').replace(',', '.'));
                return precoA - precoB;
            });
        }
        return filtrados;
    }, [produtos, busca, cor, tag, disponivel, ordem]);

    return (
        <div className="flex flex-col lg:flex-row gap-8">
            {/* Filtros */}
            <aside className="lg:w-1/4 w-full bg-white rounded-xl shadow p-4 mb-4 lg:mb-0">
                <h2 className="font-bold text-lg mb-4">Filtrar produtos</h2>
                <input
                    type="text"
                    placeholder="Buscar por nome..."
                    className="w-full mb-3 px-3 py-2 border rounded"
                    value={busca}
                    onChange={e => setBusca(e.target.value)}
                />
                <div className="mb-3">
                    <label className="block font-semibold mb-1">Tipo</label>
                    <select className="w-full px-2 py-1 border rounded" value={tag} onChange={e => setTag(e.target.value)}>
                        <option value="">Todos</option>
                        {todasTags.filter(t => !todasCores.includes(t)).map(t => (
                            <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
                        ))}
                    </select>
                </div>
                <div className="mb-3">
                    <label className="block font-semibold mb-1">Cor</label>
                    <select className="w-full px-2 py-1 border rounded" value={cor} onChange={e => setCor(e.target.value)}>
                        <option value="">Todas</option>
                        {coresDisponiveis.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
                    </select>
                </div>
                <div className="mb-3 flex items-center gap-2">
                    <input type="checkbox" id="disponivel" checked={disponivel} onChange={e => setDisponivel(e.target.checked)} />
                    <label htmlFor="disponivel" className="font-semibold">Apenas disponíveis</label>
                </div>
                <div className="mb-3">
                    <label className="block font-semibold mb-1">Ordenar por</label>
                    <select className="w-full px-2 py-1 border rounded" value={ordem} onChange={e => setOrdem(e.target.value)}>
                        <option value="">Padrão</option>
                        <option value="maior">Maior preço</option>
                        <option value="menor">Menor preço</option>
                    </select>
                </div>
            </aside>
            {/* Lista de produtos */}
            <section className="flex-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
                {produtosFiltrados.length === 0 && <div className="col-span-full text-center text-gray-500">Nenhum produto encontrado.</div>}
                {produtosFiltrados.map(produto => (
                    <ProdutoCardSobreposto produto={produto} key={produto.id} />
                ))}
            </section>
        </div>
    );
} 