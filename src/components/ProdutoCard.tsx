import { Produto } from '@/types/produto';

type ProdutoCardProps = {
  produto: Produto;
  onEdit: (produto: Produto) => void;
  onDelete: (id: number) => void;
};

export function ProdutoCard({ produto, onEdit, onDelete }: ProdutoCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {produto.imagem && (
        <div className="h-48 overflow-hidden">
          <img
            src={produto.imagem}
            alt={produto.nome}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <div className="p-6">
        <h3 className="text-lg font-semibold mb-2">{produto.nome}</h3>
        <p className="text-gray-600 mb-4 line-clamp-2">{produto.descricao}</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {Array.isArray(produto.tags) && produto.tags.map((tag, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-indigo-100 text-indigo-800 text-xs rounded-full"
            >
              {String(tag)}
            </span>
          ))}
        </div>
        <div className="flex justify-between items-center mb-4">
          <span className="text-indigo-600 font-bold">
            R$ {(Number(produto.preco) / 100).toFixed(2)}
          </span>
          <span className="text-gray-500">
            Quantidade: {produto.quantidade}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <button
            onClick={() => onEdit(produto)}
            className="text-indigo-600 hover:text-indigo-800 flex items-center"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Editar
          </button>
          <button
            onClick={() => onDelete(produto.id)}
            className="text-red-600 hover:text-red-800 flex items-center"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Excluir
          </button>
        </div>
      </div>
    </div>
  );
} 