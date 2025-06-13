import { Produto } from '@/types/produto';

interface ProdutoTableProps {
    produtos: Produto[];
    onEdit: (produto: Produto) => void;
    onDelete: (id: number) => void;
}

export function ProdutoTable({ produtos, onEdit, onDelete }: ProdutoTableProps) {
    console.log('ProdutoTable - Produtos recebidos:', produtos);

    const getImagemPrincipal = (produto: Produto) => {
        console.log('ProdutoTable - Obtendo imagem principal para produto:', produto.id);
        const imagem = produto.imagens?.[0];
        console.log('ProdutoTable - Imagem principal:', imagem);
        if (imagem && typeof imagem === 'object' && imagem.url) {
            return imagem.url;
        }
        return '/placeholder.png';
    };

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Imagem
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Nome
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Preço
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Quantidade
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Ações
                        </th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {produtos.map((produto) => (
                        <tr key={produto.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="h-16 w-16 relative">
                                    <img
                                        src={getImagemPrincipal(produto)}
                                        alt={produto.nome}
                                        className="h-16 w-16 object-cover rounded-lg"
                                        onError={(e) => {
                                            console.log('Erro ao carregar imagem:', produto.id);
                                            (e.target as HTMLImageElement).src = '/placeholder.png';
                                        }}
                                    />
                                    {produto.imagens && produto.imagens.length > 1 && (
                                        <div className="absolute bottom-0 right-0 bg-black bg-opacity-50 text-white text-xs px-1 rounded">
                                            +{produto.imagens.length - 1}
                                        </div>
                                    )}
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900">{produto.nome}</div>
                                <div className="text-sm text-gray-500">{produto.tags?.join(', ')}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">
                                    {(Number(produto.preco) / 10000).toLocaleString('pt-BR', {
                                        style: 'currency',
                                        currency: 'BRL'
                                    })}
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">{produto.quantidade}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                    produto.disponivel
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-red-100 text-red-800'
                                }`}>
                                    {produto.disponivel ? 'Disponível' : 'Indisponível'}
                                </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <button
                                    onClick={() => onEdit(produto)}
                                    className="text-indigo-600 hover:text-indigo-900 mr-4"
                                >
                                    Editar
                                </button>
                                <button
                                    onClick={() => onDelete(produto.id)}
                                    className="text-red-600 hover:text-red-900"
                                >
                                    Excluir
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
} 