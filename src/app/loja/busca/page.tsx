'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Produto } from '@/types/produto';
import { getProdutos } from '@/services/api';
import LojaNavbar from '@/components/LojaNavbar';
import ProdutoListagem from '@/components/ProdutoListagem';

function BuscaContent() {
    const searchParams = useSearchParams();
    const query = searchParams.get('q');
    const [produtos, setProdutos] = useState<Produto[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const buscarProdutos = async () => {
            try {
                setLoading(true);
                const todosProdutos = await getProdutos();
                
                if (query) {
                    const termoBusca = query.toLowerCase();
                    const produtosFiltrados = todosProdutos.filter(produto => {
                        // Busca no nome e descrição
                        const matchNomeDescricao = 
                            produto.nome.toLowerCase().includes(termoBusca) ||
                            produto.descricao.toLowerCase().includes(termoBusca);
                        
                        // Busca nas tags
                        const produtoTags = Array.isArray(produto.tags) 
                            ? produto.tags 
                            : typeof produto.tags === 'string' 
                                ? JSON.parse(produto.tags) 
                                : [];
                        
                        const matchTags = produtoTags.some((tag: string) => 
                            tag.toLowerCase().includes(termoBusca)
                        );

                        return matchNomeDescricao || matchTags;
                    });
                    setProdutos(produtosFiltrados);
                } else {
                    setProdutos(todosProdutos);
                }
                
                setLoading(false);
            } catch (err) {
                console.error('Erro ao buscar produtos:', err);
                setError('Erro ao carregar produtos');
                setLoading(false);
            }
        };

        buscarProdutos();
    }, [query]);

    if (loading) {
        return (
            <main className="container mx-auto px-4 py-8 max-w-7xl">
                <div className="flex justify-center items-center min-h-[400px]">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
            </main>
        );
    }

    if (error) {
        return (
            <main className="container mx-auto px-4 py-8 max-w-7xl">
                <div className="flex justify-center items-center min-h-[400px]">
                    <p className="text-red-500">{error}</p>
                </div>
            </main>
        );
    }

    return (
        <main className="container mx-auto px-4 py-8 max-w-7xl">
            <h1 className="text-2xl font-bold mb-6">
                {query ? `Resultados para: "${query}"` : 'Todos os produtos'}
            </h1>
            {produtos.length === 0 ? (
                <p className="text-center text-gray-500">Nenhum produto encontrado.</p>
            ) : (
                <ProdutoListagem produtos={produtos} />
            )}
        </main>
    );
}

function LoadingFallback() {
    return (
        <main className="container mx-auto px-4 py-8 max-w-7xl">
            <div className="flex justify-center items-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        </main>
    );
}

export default function BuscaPage() {
    return (
        <>
            <LojaNavbar />
            <Suspense fallback={<LoadingFallback />}>
                <BuscaContent />
            </Suspense>
        </>
    );
} 