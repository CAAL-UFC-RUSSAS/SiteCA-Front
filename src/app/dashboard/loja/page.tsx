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
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    useEffect(() => {
        loadProdutos();
    }, []);

    async function loadProdutos() {
        try {
            setLoading(true);
            const data = await getProdutos();
            setProdutos(data);
            setError('');
        } catch (err) {
            console.error('Erro ao carregar produtos:', err);
            setError('Erro ao carregar produtos');
        } finally {
            setLoading(false);
        }
    }

    async function handleCreate(produto: Partial<Produto>) {
        try {
            const produtoFormatado = {
                ...produto,
                preco: String(Number(produto.preco || 0) * 100),
                tags: Array.isArray(produto.tags) ? produto.tags : String(produto.tags).split(',').map(tag => tag.trim())
            };
            await createProduto(produtoFormatado as Omit<Produto, 'id'>);
            await loadProdutos();
            setShowForm(false);
            setSelectedImage(null);
        } catch (err) {
            console.error('Erro ao criar produto:', err);
            setError(err instanceof Error ? err.message : 'Erro ao criar produto');
        }
    }

    async function handleUpdate(id: number, produto: Partial<Produto>) {
        try {
            console.log('Iniciando atualização do produto:', { id, produto });

            const tagsArray = Array.isArray(produto.tags) 
                ? produto.tags 
                : String(produto.tags).split(',').map(tag => tag.trim());

            const produtoFormatado = {
                ...produto,
                preco: produto.preco ? String(Number(produto.preco || 0) * 100) : undefined,
                tags: JSON.stringify(tagsArray),
                imagem_nome: produto.imagem_nome,
                imagem_mime: produto.imagem_mime
            };

            if (selectedImage) {
                produtoFormatado.imagem = selectedImage.split(',')[1];
            }

            console.log('Dados formatados para atualização:', produtoFormatado);

            await updateProduto(id, produtoFormatado);
            await loadProdutos();
            setEditingProduto(null);
            setSelectedImage(null);
        } catch (err) {
            console.error('Erro ao atualizar produto:', err);
            setError(err instanceof Error ? err.message : 'Erro ao atualizar produto');
        }
    }

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

    const compressImage = (base64: string, maxWidth = 800): Promise<string> => {
        return new Promise((resolve) => {
            const img = new Image();
            img.src = base64;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                let width = img.width;
                let height = img.height;
                
                if (width > maxWidth) {
                    height = (maxWidth * height) / width;
                    width = maxWidth;
                }
                
                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx?.drawImage(img, 0, 0, width, height);
                
                resolve(canvas.toDataURL('image/jpeg', 0.7));
            };
        });
    };

    const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = async () => {
                const base64 = reader.result as string;
                const compressedBase64 = await compressImage(base64);
                setSelectedImage(compressedBase64);
            };
            reader.readAsDataURL(file);
        }
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
                onEdit={setEditingProduto}
                onDelete={handleDelete}
            />

            {editingProduto && (
                <Modal
                    title="Editar Produto"
                    onClose={() => {
                        setEditingProduto(null);
                        setSelectedImage(null);
                    }}
                >
                    <ProdutoForm
                        produto={editingProduto}
                        onSubmit={(produto) => handleUpdate(editingProduto.id, produto)}
                        onCancel={() => {
                            setEditingProduto(null);
                            setSelectedImage(null);
                        }}
                        selectedImage={selectedImage}
                        onImageSelect={handleImageSelect}
                    />
                </Modal>
            )}

            {showForm && (
                <Modal
                    title="Novo Produto"
                    onClose={() => {
                        setShowForm(false);
                        setSelectedImage(null);
                    }}
                >
                    <ProdutoForm
                        onSubmit={handleCreate}
                        onCancel={() => {
                            setShowForm(false);
                            setSelectedImage(null);
                        }}
                        selectedImage={selectedImage}
                        onImageSelect={handleImageSelect}
                    />
                </Modal>
            )}
        </div>
    );
} 