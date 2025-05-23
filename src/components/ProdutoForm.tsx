import { Produto } from '@/types/produto';

type ProdutoFormProps = {
  produto?: Produto;
  onSubmit: (produto: Partial<Produto>) => void;
  onCancel: () => void;
  selectedImage: string | null;
  onImageSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export function ProdutoForm({ produto, onSubmit, onCancel, selectedImage, onImageSelect }: ProdutoFormProps) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const tags = formData.get('tags')?.toString().split(',').map(tag => tag.trim()) || [];
    
    const produtoData: Partial<Produto> = {
      nome: formData.get('nome') as string,
      descricao: formData.get('descricao') as string,
      preco: formData.get('preco') as string,
      quantidade: Number(formData.get('quantidade')),
      disponivel: formData.get('disponivel') === 'true',
      tags,
      imagem_nome: selectedImage ? `${Date.now()}-${Math.random().toString(36).substring(7)}.${selectedImage.split(',')[0].split(':')[1].split(';')[0].split('/')[1]}` : produto?.imagem_nome,
      imagem_mime: selectedImage ? selectedImage.split(',')[0].split(':')[1].split(';')[0] : produto?.imagem_mime,
      imagem: selectedImage ? selectedImage.split(',')[1] : undefined
    };

    onSubmit(produtoData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nome</label>
            <input
              type="text"
              name="nome"
              defaultValue={produto?.nome}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Descrição</label>
            <textarea
              name="descricao"
              defaultValue={produto?.descricao}
              required
              rows={4}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Preço (R$)</label>
            <input
              type="number"
              name="preco"
              step="0.01"
              defaultValue={produto?.preco ? (Number(produto.preco) / 100).toFixed(2) : '0.00'}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Quantidade</label>
            <input
              type="number"
              name="quantidade"
              defaultValue={produto?.quantidade}
              required
              min="0"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Tags</label>
            <input
              type="text"
              name="tags"
              defaultValue={Array.isArray(produto?.tags) ? produto.tags.join(', ') : ''}
              placeholder="Ex: camiseta, algodão, P, M, G"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
            <p className="mt-1 text-sm text-gray-500">Separe as tags por vírgula</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Imagem</label>
            {(produto?.imagem || selectedImage) && (
              <div className="mb-2">
                <img
                  src={selectedImage || produto.imagem}
                  alt={produto?.nome || 'Preview'}
                  className="w-32 h-32 object-cover rounded"
                />
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={onImageSelect}
              className="mt-1 block w-full"
            />
          </div>
          <div>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="disponivel"
                value="true"
                defaultChecked={produto?.disponivel ?? true}
                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="text-sm font-medium text-gray-700">Disponível para venda</span>
            </label>
          </div>
        </div>
      </div>
      <div className="mt-6 flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-gray-700 bg-gray-100 rounded hover:bg-gray-200"
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
        >
          Salvar
        </button>
      </div>
    </form>
  );
} 