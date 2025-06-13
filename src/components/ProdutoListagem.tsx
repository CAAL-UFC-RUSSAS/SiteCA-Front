import { useState, useMemo } from 'react';
import ProdutoCardSobreposto from './ProdutoCardSobreposto';
import { Produto } from '@/types/produto';
import Image from 'next/image';
import Link from 'next/link';

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
        produtos.forEach(p => {
            const produtoTags = typeof p.tags === 'string' 
                ? JSON.parse(p.tags) 
                : Array.isArray(p.tags) 
                    ? p.tags 
                    : [];
            produtoTags.forEach((t: string) => tags.add(t));
        });
        return Array.from(tags);
    }, [produtos]);

    // Cores realmente presentes nos produtos
    const coresDisponiveis = useMemo(() => {
        return todasCores.filter(cor => produtos.some(p => {
            const produtoTags = typeof p.tags === 'string' 
                ? JSON.parse(p.tags) 
                : Array.isArray(p.tags) 
                    ? p.tags 
                    : [];
            return produtoTags.includes(cor);
        }));
    }, [produtos]);

    // Filtro e ordenação
    const produtosFiltrados = useMemo(() => {
        let filtrados = produtos.filter(p => {
            const produtoTags = typeof p.tags === 'string' 
                ? JSON.parse(p.tags) 
                : Array.isArray(p.tags) 
                    ? p.tags 
                    : [];
            return (!busca || p.nome.toLowerCase().includes(busca.toLowerCase())) &&
                (!cor || produtoTags.includes(cor)) &&
                (!tag || produtoTags.includes(tag)) &&
                (!disponivel || p.disponivel);
        });
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

    const formatarPreco = (preco: string) => {
        const precoNum = Number(preco);
        return (precoNum / 100).toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        });
    };

    const getImagemPrincipal = (produto: Produto) => {
        if (produto.imagens && produto.imagens.length > 0) {
            const primeiraImagem = produto.imagens[0];
            if (typeof primeiraImagem === 'string') {
                return primeiraImagem;
            }
            return primeiraImagem.url;
        }
        return null;
    };

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {produtos.map((produto) => {
                const imagemPrincipal = getImagemPrincipal(produto);
                
                return (
                    <Link 
                        href={`/loja/${produto.id}`} 
                        key={produto.id}
                        className="group"
                    >
                        <div className="bg-white rounded-lg shadow-sm overflow-hidden transition-transform duration-300 hover:shadow-md hover:-translate-y-1">
                            <div className="aspect-square relative">
                                {imagemPrincipal ? (
                                    <Image
                                        src={imagemPrincipal}
                                        alt={produto.nome}
                                        fill
                                        className="object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                        <span className="text-gray-400">Sem imagem</span>
                                    </div>
                                )}
                            </div>
                            <div className="p-4">
                                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-orange-600 transition-colors">
                                    {produto.nome}
                                </h3>
                                <p className="mt-1 text-2xl font-bold text-[#ee4d2d]">
                                    {formatarPreco(produto.preco)}
                                </p>
                                {!produto.disponivel && (
                                    <span className="inline-block mt-2 px-2 py-1 text-sm text-red-600 bg-red-100 rounded-full">
                                        Indisponível
                                    </span>
                                )}
                            </div>
                        </div>
                    </Link>
                );
            })}
        </div>
    );
} 