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
        <div className="bg-white rounded-lg shadow overflow-hidden">
            {/* Versão Desktop */}
            <div className="hidden md:block">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Produto</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Preço</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estoque</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {produtos.map((produto) => (
                            <tr key={produto.id}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0 h-10 w-10">
                                            {produto.imagens && produto.imagens.length > 0 && (
                                                <img
                                                    className="h-10 w-10 rounded object-cover"
                                                    src={typeof produto.imagens[0] === 'string' ? produto.imagens[0] : produto.imagens[0].url}
                                                    alt={produto.nome}
                                                />
                                            )}
                                        </div>
                                        <div className="ml-4">
                                            <div className="text-sm font-medium text-gray-900">{produto.nome}</div>
                                            <div className="text-sm text-gray-500">{produto.descricao}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-900">R$ {(Number(produto.preco) / 100).toFixed(2)}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-900">{produto.quantidade}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                        produto.disponivel ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
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

            {/* Versão Mobile */}
            <div className="md:hidden divide-y divide-gray-200">
                {produtos.map((produto) => (
                    <div key={produto.id} className="p-4">
                        <div className="flex items-start space-x-4">
                            <div className="flex-shrink-0">
                                {produto.imagens && produto.imagens.length > 0 && (
                                    <img
                                        className="h-16 w-16 rounded-lg object-cover"
                                        src={typeof produto.imagens[0] === 'string' ? produto.imagens[0] : produto.imagens[0].url}
                                        alt={produto.nome}
                                    />
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="text-sm font-medium text-gray-900 truncate">{produto.nome}</h3>
                                <p className="text-sm text-gray-500 line-clamp-2">{produto.descricao}</p>
                                <div className="mt-2 flex items-center justify-between">
                                    <div className="flex items-center space-x-4">
                                        <span className="text-sm font-medium text-gray-900">
                                            R$ {(Number(produto.preco) / 100).toFixed(2)}
                                        </span>
                                        <span className="text-sm text-gray-500">
                                            {produto.quantidade} em estoque
                                        </span>
                                    </div>
                                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                        produto.disponivel ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                    }`}>
                                        {produto.disponivel ? 'Disponível' : 'Indisponível'}
                                    </span>
                                </div>
                                <div className="mt-3 flex space-x-3">
                                    <button
                                        onClick={() => onEdit(produto)}
                                        className="flex-1 bg-indigo-50 text-indigo-600 px-3 py-1.5 rounded-md text-sm font-medium hover:bg-indigo-100"
                                    >
                                        Editar
                                    </button>
                                    <button
                                        onClick={() => onDelete(produto.id)}
                                        className="flex-1 bg-red-50 text-red-600 px-3 py-1.5 rounded-md text-sm font-medium hover:bg-red-100"
                                    >
                                        Excluir
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
} 