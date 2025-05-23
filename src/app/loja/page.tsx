'use client';

import { useEffect, useState } from 'react';
import { Produto } from '@/types/produto';
import { getProdutos } from '@/services/api';
import LojaBanner from '@/components/LojaBanner';
import ProdutoListagem from '@/components/ProdutoListagem';
import LojaNavbar from '@/components/LojaNavbar';

export default function LojaPage() {
    const [produtos, setProdutos] = useState<Produto[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProdutos = async () => {
            try {
                const produtosData = await getProdutos();
                setProdutos(produtosData);
                setLoading(false);
            } catch (err) {
                console.error('Erro ao buscar produtos:', err);
                setError('Erro ao carregar produtos');
                setLoading(false);
            }
        };

        fetchProdutos();
    }, []);

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

    if (error) {
        return (
            <>
                <LojaNavbar />
                <main className="container mx-auto px-4 py-8 max-w-7xl">
                    <div className="flex justify-center items-center min-h-[400px]">
                        <p className="text-red-500">{error}</p>
                    </div>
                </main>
            </>
        );
    }

    return (
        <>
            <LojaNavbar />
            <main className="container mx-auto px-4 py-8 max-w-7xl">
                <LojaBanner produtos={produtos} />
                <ProdutoListagem produtos={produtos} />
            </main>
        </>
    );
}
