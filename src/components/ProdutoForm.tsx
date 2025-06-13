import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Produto, ProdutoImagem, ProdutoCampoPersonalizado } from '@/types/produto';

interface ProdutoFormProps {
  produto?: Produto;
  onSubmit: (produto: Partial<Produto>) => void;
  onCancel: () => void;
    selectedImages: ProdutoImagem[];
  onImageSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onRemoveImage?: (index: number) => void;
}

export function ProdutoForm({ 
    produto, 
    onSubmit, 
    onCancel, 
    selectedImages = [], 
    onImageSelect,
    onRemoveImage 
}: ProdutoFormProps) {
    const [nome, setNome] = useState(produto?.nome || '');
    const [descricao, setDescricao] = useState(produto?.descricao || '');
    const [preco, setPreco] = useState(produto?.preco ? (Number(produto.preco) / 10000).toFixed(2) : '');
    const [quantidade, setQuantidade] = useState(produto?.quantidade?.toString() || '');
    const [tags, setTags] = useState(
        Array.isArray(produto?.tags) 
            ? produto.tags.join(', ') 
            : typeof produto?.tags === 'string' 
                ? JSON.parse(produto.tags).join(', ')
                : ''
    );
    const [disponivel, setDisponivel] = useState(produto?.disponivel ?? true);
    const [camposPersonalizados, setCamposPersonalizados] = useState<ProdutoCampoPersonalizado[]>(
        produto?.campos_personalizados?.map(campo => ({
            ...campo,
            opcoes: typeof campo.opcoes === 'string' ? JSON.parse(campo.opcoes) : campo.opcoes || []
        })) || []
    );

    useEffect(() => {
        console.log('=== DEBUG TAGS ===');
        console.log('Produto recebido:', produto);
        console.log('Tipo das tags:', typeof produto?.tags);
        console.log('Valor das tags:', produto?.tags);
        console.log('Tags após processamento:', tags);
        console.log('================');
    }, [produto, tags]);

    useEffect(() => {
        console.log('Produto recebido:', produto);
        console.log('Campos personalizados do produto:', produto?.campos_personalizados);
        console.log('Estado atual dos campos personalizados:', camposPersonalizados);
    }, [produto, camposPersonalizados]);

    const handleAddCampoPersonalizado = () => {
        if (camposPersonalizados.length >= 5) {
            alert('Máximo de 5 campos personalizados atingido');
            return;
        }

        const novoCampo: ProdutoCampoPersonalizado = {
            id: Date.now(),
            produto_id: produto?.id || 0,
            nome: '',
            tipo: 'texto',
            valor: '',
            opcoes: []
        };

        console.log('Adicionando novo campo:', novoCampo);
        setCamposPersonalizados([...camposPersonalizados, novoCampo]);
    };

    const handleRemoveCampoPersonalizado = (index: number) => {
        console.log('Removendo campo no índice:', index);
        setCamposPersonalizados(camposPersonalizados.filter((_, i) => i !== index));
    };

    const handleCampoPersonalizadoChange = (
        index: number, 
        field: keyof ProdutoCampoPersonalizado, 
        value: string | string[] | number
    ) => {
        console.log('Alterando campo:', { index, field, value });
        const novosCampos = [...camposPersonalizados];
        novosCampos[index] = {
            ...novosCampos[index],
            [field]: field === 'opcoes' 
                ? (typeof value === 'string' 
                    ? value.split(',').map((o: string) => o.trim())
                    : Array.isArray(value) 
                        ? value 
                        : [])
                : value
        };
        setCamposPersonalizados(novosCampos);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('=== DEBUG ENVIO ===');
        console.log('Tags antes do processamento:', tags);
        
        // Filtrar campos personalizados vazios e garantir que seja um array
        const camposValidos = camposPersonalizados
            .filter(campo => campo && campo.nome && campo.nome.trim() !== '')
            .map(campo => {
                console.log('Processando campo:', campo);
                return {
                    nome: campo.nome.trim(),
                    tipo: campo.tipo,
                    valor: campo.valor || '',
                    opcoes: campo.tipo === 'opcao' ? campo.opcoes || [] : undefined
                };
            });

        console.log('Campos válidos após processamento:', camposValidos);

        // Processar tags
        const tagsArray = tags.split(',')
            .map((tag: string) => tag.trim())
            .filter((tag: string) => tag !== '');

        console.log('Tags após processamento:', tagsArray);

        const produtoData = {
            nome,
            descricao,
            preco: Math.round(parseFloat(preco) * 100).toString(),
            quantidade: parseInt(quantidade),
            tags: tagsArray,
            disponivel,
            imagens: selectedImages || [],
            campos_personalizados: camposValidos
        };

        console.log('Dados finais do produto:', produtoData);
        console.log('==================');
    onSubmit(produtoData);
  };

  return (
        <form onSubmit={handleSubmit} className="space-y-4 bg-transparent p-4 md:p-6 rounded-lg shadow-lg max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nome</label>
            <input
              type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Preço (R$)</label>
              <input
                type="number"
                step="0.01"
                value={preco}
                onChange={(e) => setPreco(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
            />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Descrição</label>
            <textarea
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              rows={3}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Quantidade</label>
            <input
              type="number"
                value={quantidade}
                onChange={(e) => setQuantidade(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>

          <div>
              <label className="block text-sm font-medium text-gray-700">Tags (separadas por vírgula)</label>
            <input
              type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                placeholder="Ex: masculino, feminino, P, M, G"
            />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-700">Campos Personalizados</label>
              {camposPersonalizados.length < 5 && (
                <button
                  type="button"
                  onClick={handleAddCampoPersonalizado}
                  className="text-sm text-indigo-600 hover:text-indigo-500"
                >
                  + Adicionar campo
                </button>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {camposPersonalizados.map((campo, index) => (
                <div key={campo.id} className="p-4 border rounded-lg bg-white/70">
                  <div className="flex flex-col md:flex-row justify-between items-start gap-2 mb-2">
                    <div className="w-full md:flex-1 md:mr-1 md:min-w-[120px]">
                      <input
                        type="text"
                        value={campo.nome}
                        onChange={(e) => handleCampoPersonalizadoChange(index, 'nome', e.target.value)}
                        placeholder="Nome do campo"
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      />
                    </div>
                    <div className="flex items-center gap-2 w-full md:w-auto">
                      <select
                        value={campo.tipo}
                        onChange={(e) => handleCampoPersonalizadoChange(index, 'tipo', e.target.value)}
                        className="block w-full md:w-40 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 md:max-w-[80px]"
                      >
                        <option value="texto">Texto</option>
                        <option value="numero">Número</option>
                        <option value="opcao">Opção</option>
                      </select>
                      <button
                        type="button"
                        onClick={() => handleRemoveCampoPersonalizado(index)}
                        className="text-red-600 hover:text-red-500"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  {campo.tipo === 'opcao' && (
                    <div className="mt-2">
                      <input
                        type="text"
                        value={Array.isArray(campo.opcoes) ? campo.opcoes.join(', ') : ''}
                        onChange={(e) => handleCampoPersonalizadoChange(index, 'opcoes', e.target.value)}
                        placeholder="Opções (separadas por vírgula)"
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            )}
                  <div className="mt-2">
                    {campo.tipo === 'opcao' ? (
                      <select
                        value={campo.valor}
                        onChange={(e) => handleCampoPersonalizadoChange(index, 'valor', e.target.value)}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      >
                        <option value="">Selecione uma opção</option>
                        {Array.isArray(campo.opcoes) && campo.opcoes.map((opcao, i) => (
                          <option key={i} value={opcao}>{opcao}</option>
                        ))}
                      </select>
                    ) : campo.tipo === 'numero' ? (
                      <input
                        type="number"
                        value={campo.valor}
                        onChange={(e) => handleCampoPersonalizadoChange(index, 'valor', e.target.value)}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      />
                    ) : (
                      <input
                        type="text"
                        value={campo.valor}
                        onChange={(e) => handleCampoPersonalizadoChange(index, 'valor', e.target.value)}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">Imagens (máximo 8)</label>
                <div className="mt-1 grid grid-cols-4 gap-2">
                    {selectedImages.map((image, index) => (
                        <div key={image.id} className="relative aspect-square">
                            <Image
                                src={image.url}
                                alt={`Preview ${index + 1}`}
                                className="w-full h-full object-cover rounded-lg"
                            />
                            <button
                                type="button"
                                onClick={() => onRemoveImage?.(index)}
                                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                            </button>
                        </div>
                    ))}
                    {selectedImages.length < 8 && (
                        <label className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-indigo-500">
            <input
              type="file"
              accept="image/*"
              onChange={onImageSelect}
                                className="hidden"
                            />
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                        </label>
                    )}
                </div>
          </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                    id="disponivel"
                    checked={disponivel}
                    onChange={(e) => setDisponivel(e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <label htmlFor="disponivel" className="ml-2 block text-sm text-gray-900">
                    Produto disponível
            </label>
          </div>

            <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Cancelar
        </button>
        <button
          type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
                    {produto ? 'Atualizar' : 'Criar'}
        </button>
      </div>
    </form>
  );
} 