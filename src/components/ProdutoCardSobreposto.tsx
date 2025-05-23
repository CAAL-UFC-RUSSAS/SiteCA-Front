import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Produto } from '@/types/produto';

interface ProdutoCardSobrepostoProps {
    produto: Produto;
    grande?: boolean;
    quadrado?: boolean;
}

export default function ProdutoCardSobreposto({ produto, grande, quadrado }: ProdutoCardSobrepostoProps) {
    const [isHovered, setIsHovered] = useState(false);

    const formatarPreco = (preco: string) => {
        const precoNum = Number(preco);
        return (precoNum / 100).toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        });
    };

    return (
        <Link 
            href={`/loja/${produto.id}`}
            className="relative group"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className={`relative w-full ${grande ? 'h-[400px]' : quadrado ? 'h-[200px]' : 'h-[300px]'} bg-white rounded-xl shadow-lg overflow-hidden`}>
                {produto.imagem ? (
                    <Image
                        src={produto.imagem}
                        alt={produto.nome}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-400">Sem imagem</span>
                    </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <h3 className="text-lg font-bold mb-1">{produto.nome}</h3>
                    <p className="text-sm mb-2 line-clamp-2">{produto.descricao}</p>
                    <div className="flex justify-between items-center">
                        <span className="text-yellow-400 font-bold">{formatarPreco(produto.preco)}</span>
                        <span className={`text-sm ${produto.disponivel ? 'text-green-400' : 'text-red-400'}`}>
                            {produto.disponivel ? 'Disponível' : 'Indisponível'}
                        </span>
                    </div>
                </div>
            </div>
        </Link>
    );
} 