'use client';

import { useEffect, useState, use } from 'react';
import Image from 'next/image';
import { Produto } from '@/types/produto';
import { getProduto } from '@/services/api';
import LojaNavbar from '@/components/LojaNavbar';

export default function ProdutoPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = use(params);
    const [produto, setProduto] = useState<Produto | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [addedToCart, setAddedToCart] = useState(false);

    const formatarPreco = (preco: string) => {
        const precoNum = Number(preco);
        return (precoNum / 100).toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        });
    };

    useEffect(() => {
        const fetchProduto = async () => {
            try {
                const produtoData = await getProduto(resolvedParams.id);
                setProduto(produtoData);
                setLoading(false);
            } catch (err) {
                console.error('Erro ao buscar produto:', err);
                setError('Erro ao carregar produto');
                setLoading(false);
            }
        };

        fetchProduto();
    }, [resolvedParams.id]);

    // Verificar se o produto já está no carrinho
    useEffect(() => {
        if (produto) {
            try {
                const cart: Array<{id: number; nome: string; preco: string; imagem?: string; quantidade: number}> = JSON.parse(localStorage.getItem('cart') || '[]');
                const isInCart = cart.some((item) => item.id === produto.id);
                setAddedToCart(isInCart);
            } catch (error) {
                console.error('Erro ao verificar carrinho:', error);
            }
        }
    }, [produto]);

    const addToCart = () => {
        if (!produto) return;

        try {
            // Obter carrinho atual
            const currentCart: Array<{id: number; nome: string; preco: string; imagem?: string; quantidade: number}> = JSON.parse(localStorage.getItem('cart') || '[]');
            
            // Verificar se o produto já está no carrinho
            const existingItemIndex = currentCart.findIndex((item) => item.id === produto.id);
            
            if (existingItemIndex >= 0) {
                // Atualizar quantidade se já existe
                currentCart[existingItemIndex].quantidade += 1;
            } else {
                // Adicionar novo item
                currentCart.push({
                    id: produto.id,
                    nome: produto.nome,
                    preco: produto.preco,
                    imagem: produto.imagem,
                    quantidade: 1
                });
            }
            
            // Salvar no localStorage
            localStorage.setItem('cart', JSON.stringify(currentCart));
            
            // Atualizar estado
            setAddedToCart(true);
            
            // Disparar evento para atualizar o contador na navbar
            window.dispatchEvent(new CustomEvent('cartUpdated'));
        } catch (error) {
            console.error('Erro ao adicionar ao carrinho:', error);
        }
    };

    if (loading) {
        return (
            <>
                <LojaNavbar />
                <main className="container mx-auto px-4 py-8 max-w-7xl">
                    <div className="flex justify-center items-center min-h-[400px]">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                    </div>
                </main>
            </>
        );
    }

    if (error || !produto) {
        return (
            <>
                <LojaNavbar />
                <main className="container mx-auto px-4 py-8 max-w-7xl">
                    <div className="flex justify-center items-center min-h-[400px]">
                        <p className="text-red-500">{error || 'Produto não encontrado'}</p>
                    </div>
                </main>
            </>
        );
    }

    return (
        <>
            <LojaNavbar />
            <main className="container mx-auto px-4 py-8 max-w-7xl">
                <div className="flex flex-col md:flex-row gap-8 bg-white shadow p-6">
                    <div className="w-full md:w-1/2 flex justify-center items-center">
                        {produto.imagem ? (
                            <Image 
                                src={produto.imagem} 
                                alt={produto.nome} 
                                width={500} 
                                height={500} 
                                className="rounded-lg object-contain"
                            />
                        ) : (
                            <div className="w-full h-[500px] bg-gray-200 rounded-lg flex items-center justify-center">
                                <span className="text-gray-400 text-xl">Sem imagem</span>
                            </div>
                        )}
                    </div>
                    <div className="flex-1 flex flex-col gap-4">
                        <h1 className="text-3xl font-bold text-indigo-900">{produto.nome}</h1>
                        <span className="text-2xl text-yellow-600 font-bold">{formatarPreco(produto.preco)}</span>
                        <p className="text-gray-700 text-lg">{produto.descricao}</p>
                        <div className="flex flex-wrap gap-2">
                            {Array.isArray(produto.tags) && produto.tags.map((tag: string) => (
                                <span 
                                    key={tag} 
                                    className="bg-indigo-100 text-indigo-800 text-sm px-3 py-1 rounded-full"
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>
                        <div className="flex items-center gap-4 mt-2">
                            <span className={`text-base font-semibold ${produto.disponivel ? 'text-green-600' : 'text-red-600'}`}>
                                {produto.disponivel ? 'Disponível' : 'Indisponível'}
                            </span>
                            <span className="text-base text-gray-500">
                                {produto.quantidade} unidades
                            </span>
                        </div>
                        <div className="flex flex-wrap gap-4 mt-4">
                            <button 
                                className="px-8 py-3 rounded-lg bg-indigo-700 text-white font-bold text-lg shadow hover:bg-indigo-800 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                                disabled={!produto.disponivel}
                            >
                                {produto.disponivel ? 'Comprar' : 'Indisponível'}
                            </button>
                            <button 
                                onClick={addToCart}
                                disabled={!produto.disponivel}
                                className={`px-8 py-3 rounded-lg font-bold text-lg shadow transition-colors ${
                                    addedToCart 
                                        ? 'bg-green-600 hover:bg-green-700 text-white' 
                                        : 'bg-yellow-500 hover:bg-yellow-600 text-white'
                                } disabled:bg-gray-400 disabled:cursor-not-allowed`}
                            >
                                {addedToCart ? 'Adicionado ✓' : 'Adicionar ao Carrinho'}
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
} 