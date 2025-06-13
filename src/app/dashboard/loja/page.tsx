'use client';

import { useState, useEffect } from 'react';
import { getProdutos, createProduto, updateProduto, deleteProduto } from '@/services/api';
import { ProdutoTable } from '@/components/ProdutoTable';
import { ProdutoForm } from '@/components/ProdutoForm';
import { Modal } from '@/components/Modal';
import { Produto } from '@/types/produto';

export default function LojaPage() {
    const [produtos, setProdutos] = useState<Produto[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [editingProduto, setEditingProduto] = useState<Produto | null>(null);
    const [showForm, setShowForm] = useState(false);
    const [selectedImages, setSelectedImages] = useState<{ id: number; url: string; ordem: number; produto_id: number }[]>([]);

    useEffect(() => {
        loadProdutos();
    }, []);

    async function loadProdutos() {
        try {
            setLoading(true);
            const data = await getProdutos();
            console.log('Produtos carregados:', data);
            setProdutos(data);
            setError('');
        } catch (err) {
            console.error('Erro ao carregar produtos:', err);
            setError('Erro ao carregar produtos');
        } finally {
            setLoading(false);
        }
    }

    const handleSubmit = async (produto: Partial<Produto>) => {
        try {
            if (!produto.nome || !produto.descricao || !produto.preco || !produto.quantidade) {
                alert('Por favor, preencha todos os campos obrigatórios.');
                return;
            }

            const tagsArray = Array.isArray(produto.tags) 
                ? produto.tags 
                : String(produto.tags).split(',').map(tag => tag.trim());

            const produtoFormatado = {
                nome: produto.nome,
                descricao: produto.descricao,
                preco: String(Number(produto.preco) * 100),
                quantidade: produto.quantidade,
                tags: JSON.stringify(tagsArray),
                disponivel: produto.disponivel ?? true,
                imagens: selectedImages.map(img => img.url),
                campos_personalizados: produto.campos_personalizados || []
            };

            console.log('Enviando produto formatado:', produtoFormatado);

            if (editingProduto) {
                await updateProduto(editingProduto.id, produtoFormatado);
            } else {
                await createProduto(produtoFormatado);
            }
            setShowForm(false);
            setEditingProduto(null);
            setSelectedImages([]);
            loadProdutos();
        } catch (error) {
            console.error('Erro ao salvar produto:', error);
            alert('Erro ao salvar produto. Por favor, tente novamente.');
        }
    };

    const handleEdit = (produto: Produto) => {
        console.log('Editando produto:', produto);
        setEditingProduto(produto);
        setSelectedImages(produto.imagens?.map((img, index) => ({
            id: typeof img === 'string' ? Date.now() : img.id,
            url: typeof img === 'string' ? img : img.url,
            ordem: typeof img === 'string' ? index : img.ordem,
            produto_id: produto.id
        })) || []);
    };

    async function handleDelete(id: number) {
        if (!confirm('Tem certeza que deseja excluir este produto?')) return;

        try {
            await deleteProduto(id);
            await loadProdutos();
        } catch (err) {
            console.error('Erro ao deletar produto:', err);
            setError(err instanceof Error ? err.message : 'Erro ao deletar produto');
        }
    }

    const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            console.log('Arquivo de imagem selecionado:', file.name, `(${(file.size / 1024 / 1024).toFixed(2)}MB)`);
            const reader = new FileReader();
            reader.onloadend = async () => {
                const base64 = reader.result as string;
                // Compressão básica de imagem
                const img = new Image();
                img.src = base64;
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const MAX_WIDTH = 1200;
                    const scale = MAX_WIDTH / img.width;
                    canvas.width = MAX_WIDTH;
                    canvas.height = img.height * scale;
                    
                    const ctx = canvas.getContext('2d');
                    ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
                    
                    const compressedBase64 = canvas.toDataURL('image/jpeg', 0.7);
                    console.log('Imagem comprimida com sucesso');
                    setSelectedImages(prev => [...prev, {
                        id: Date.now(), // ID temporário para o frontend
                        url: compressedBase64,
                        ordem: prev.length,
                        produto_id: editingProduto?.id || 0 // Usa 0 como fallback
                    }]);
                };
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveImage = (index: number) => {
        console.log('Removendo imagem no índice:', index);
        console.log('Imagens antes da remoção:', selectedImages);
        const newImages = [...selectedImages];
        newImages.splice(index, 1);
        // Atualiza a ordem das imagens restantes
        newImages.forEach((img, idx) => {
            img.ordem = idx;
        });
        console.log('Imagens após remoção:', newImages);
        setSelectedImages(newImages);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
        );
    }

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-indigo-800">Gerenciar Produtos</h1>
                <button
                    onClick={() => setShowForm(true)}
                    className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition-colors"
                >
                    Adicionar Produto
                </button>
            </div>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            <ProdutoTable
                produtos={produtos}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />

            {editingProduto && (
                <Modal
                    title="Editar Produto"
                    onClose={() => {
                        setEditingProduto(null);
                        setSelectedImages([]);
                    }}
                >
                    <ProdutoForm
                        produto={editingProduto}
                        onSubmit={handleSubmit}
                        onCancel={() => {
                            setEditingProduto(null);
                            setSelectedImages([]);
                        }}
                        selectedImages={selectedImages}
                        onImageSelect={handleImageSelect}
                        onRemoveImage={handleRemoveImage}
                    />
                </Modal>
            )}

            {showForm && (
                <Modal
                    title="Novo Produto"
                    onClose={() => {
                        setShowForm(false);
                        setSelectedImages([]);
                    }}
                >
                    <ProdutoForm
                        onSubmit={handleSubmit}
                        onCancel={() => {
                            setShowForm(false);
                            setSelectedImages([]);
                        }}
                        selectedImages={selectedImages}
                        onImageSelect={handleImageSelect}
                    />
                </Modal>
            )}
        </div>
    );
} 