'use client';

import { useEffect, useState } from 'react';
import { Produto } from '@/types/produto';
import { getProdutos } from '@/services/api';
import LojaBanner from '@/components/LojaBanner';
import ProdutoListagem from '@/components/ProdutoListagem';
import LojaNavbar from '@/components/LojaNavbar';
import Link from 'next/link';

export default function LojaPage() {
    const [produtos, setProdutos] = useState<Produto[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Forçar barra de rolagem imediatamente
        document.documentElement.style.overflowY = 'scroll';
        
        const fetchProdutos = async () => {
            try {
                const produtosData = await getProdutos();
                setProdutos(produtosData);
                
                // Salva os produtos no localStorage para uso em outras páginas
                localStorage.setItem('produtos_loja', JSON.stringify(produtosData));
                
                setLoading(false);
            } catch (err) {
                console.error('Erro ao buscar produtos:', err);
                setError('Erro ao carregar produtos');
                setLoading(false);
            }
        };

        fetchProdutos();
        
        // Cleanup function
        return () => {
            document.documentElement.style.overflowY = '';
        };
    }, []);

    if (loading) {
        return (
            <div className="min-h-[101vh]">
                <LojaNavbar />
                <main className="container mx-auto px-4 py-8 max-w-7xl">
                    <div className="flex justify-center items-center min-h-[400px]">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                    </div>
                </main>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-[101vh]">
                <LojaNavbar />
                <main className="container mx-auto px-4 py-8 max-w-7xl">
                    <div className="flex justify-center items-center min-h-[400px]">
                        <p className="text-red-500">{error}</p>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div style={{ minHeight: 'calc(100vh + 1px)' }}>
            <LojaNavbar />
            <main className="container mx-auto px-4 max-w-7xl">
                <div className="flex items-center mt-1 p-3 pl-0  text-sm">
                    <Link href="/"
                        className="text-gray-700 hover:text-orange-600 cursor-pointer font-medium transition-colors whitespace-nowrap" 
                    >
                        Centro Acadêmico
                    </Link>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mx-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                    <span className="text-orange-600 font-medium truncate">
                        Loja
                    </span>
                </div>
            </main>
            <main className="container mx-auto px-4 py-8 max-w-7xl">
                <LojaBanner produtos={produtos} />
                
                <div className="mt-8">
                    <ProdutoListagem produtos={produtos} />
                </div>
                <div className="h-px"></div>
            </main>
        </div>
    );
}
