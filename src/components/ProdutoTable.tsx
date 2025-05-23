import { Produto } from '@/types/produto';

type ProdutoTableProps = {
    produtos: Produto[];
    onEdit: (produto: Produto) => void;
    onDelete: (id: number) => void;
};

export function ProdutoTable({ produtos, onEdit, onDelete }: ProdutoTableProps) {
    return (
        <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Imagem</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Preço</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantidade</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tags</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {produtos.map((produto) => (
                        <tr key={produto.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                                {produto.imagem ? (
                                    <div className="relative">
                                        <img
                                            src={produto.imagem}
                                            alt={produto.nome}
                                            className="h-20 w-20 object-cover rounded"
                                            onError={(e) => {
                                                e.currentTarget.style.display = 'none';
                                                const placeholder = e.currentTarget.parentElement?.querySelector('.placeholder');
                                                if (placeholder) {
                                                    placeholder.classList.remove('hidden');
                                                }
                                            }}
                                        />
                                        <div className="h-20 w-20 bg-gray-200 rounded flex items-center justify-center placeholder hidden">
                                            <span className="text-gray-400">Sem<br/>imagem</span>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="h-20 w-20 bg-gray-200 rounded flex items-center justify-center">
                                        <span className="text-gray-400">Sem<br/>imagem</span>
                                    </div>
                                )}
                            </td>
                            <td className="px-6 py-4">
                                <div className="text-sm font-medium text-gray-900">{produto.nome}</div>
                                <div className="text-sm text-gray-500 line-clamp-2">{produto.descricao}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">
                                    R$ {(() => {
                                        const precoNum = Number(produto.preco);
                                        return isNaN(precoNum) ? '0.00' : (precoNum / 100).toFixed(2);
                                    })()}
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">{produto.quantidade}</div>
                            </td>
                            <td className="px-6 py-4">
                                <div className="flex flex-wrap gap-1">
                                    {Array.isArray(produto.tags) && produto.tags.map((tag, index) => (
                                        <span
                                            key={index}
                                            className="px-2 py-1 bg-indigo-100 text-indigo-800 text-xs rounded-full"
                                        >
                                            {String(tag)}
                                        </span>
                                    ))}
                                </div>
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