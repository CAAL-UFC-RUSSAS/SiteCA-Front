'use client';

import { useState, useEffect } from 'react';
import { getBanners, createBanner, updateBanner, deleteBanner, reordenarBanners, Banner } from '@/services/api';
import { BannerTable } from '@/components/BannerTable';
import { BannerForm } from '@/components/BannerForm';
import { Modal } from '@/components/Modal';

export default function BannersPage() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    loadBanners();
  }, []);

  async function loadBanners() {
    try {
      setLoading(true);
      console.log('Iniciando carregamento de banners...');
      
      const data = await getBanners();
      console.log('Banners recebidos:', data);
      
      // Se não há dados, inicializar como array vazio
      setBanners(Array.isArray(data) ? data : []);
      setError('');
    } catch (err) {
      console.error('Erro ao carregar banners:', err);
      setBanners([]); // Garantir que temos um array vazio em caso de erro
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate(banner: Partial<Banner>) {
    try {
      console.log('Criando banner:', banner);
      await createBanner(banner as Omit<Banner, 'id'>);
      await loadBanners();
      setShowForm(false);
      setSelectedImage(null);
    } catch (err) {
      console.error('Erro ao criar banner:', err);
      setError(err instanceof Error ? err.message : 'Erro ao criar banner');
    }
  }

  async function handleUpdate(id: number, banner: Partial<Banner>) {
    try {
      console.log('Atualizando banner:', id, banner);
      await updateBanner(id, banner);
      await loadBanners();
      setEditingBanner(null);
      setSelectedImage(null);
    } catch (err) {
      console.error('Erro ao atualizar banner:', err);
      setError(err instanceof Error ? err.message : 'Erro ao atualizar banner');
    }
  }

  async function handleDelete(id: number) {
    try {
      console.log('Excluindo banner:', id);
      await deleteBanner(id);
      await loadBanners();
    } catch (err) {
      console.error('Erro ao deletar banner:', err);
      setError(err instanceof Error ? err.message : 'Erro ao deletar banner');
    }
  }

  async function handleReorder(bannersReordered: Banner[]) {
    try {
      const bannerIds = bannersReordered.map(banner => banner.id);
      console.log('Reordenando banners, nova ordem:', bannerIds);
      await reordenarBanners(bannerIds);
      setBanners(bannersReordered);
    } catch (err) {
      console.error('Erro ao reordenar banners:', err);
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
          setSelectedImage(compressedBase64);
        };
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
        <h1 className="text-2xl font-bold text-indigo-800">Gerenciar Banners</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition-colors"
        >
          Adicionar Banner
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <BannerTable
        banners={banners}
        onEdit={setEditingBanner}
        onDelete={handleDelete}
        onReorder={handleReorder}
      />

      {editingBanner && (
        <Modal
          title="Editar Banner"
          onClose={() => {
            setEditingBanner(null);
            setSelectedImage(null);
          }}
        >
          <BannerForm
            banner={editingBanner}
            onSubmit={(banner) => handleUpdate(editingBanner.id, banner)}
            onCancel={() => {
              setEditingBanner(null);
              setSelectedImage(null);
            }}
            selectedImage={selectedImage}
            onImageSelect={handleImageSelect}
          />
        </Modal>
      )}

      {showForm && (
        <Modal
          title="Novo Banner"
          onClose={() => {
            setShowForm(false);
            setSelectedImage(null);
          }}
        >
          <BannerForm
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