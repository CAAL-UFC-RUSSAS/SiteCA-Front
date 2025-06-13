'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Banner } from '@/services/api';

interface BannerFormProps {
  banner?: Banner;
  onSubmit: (banner: Partial<Banner>) => void;
  onCancel: () => void;
  selectedImage: string | null;
  onImageSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function BannerForm({
  banner,
  onSubmit,
  onCancel,
  selectedImage,
  onImageSelect
}: BannerFormProps) {
  const [formData, setFormData] = useState<Partial<Banner>>({
    titulo: '',
    descricao: '',
    link: '',
    tipo: 'principal',
    ativo: true,
    posicao: 0
  });

  useEffect(() => {
    if (banner) {
      setFormData({
        titulo: banner.titulo,
        descricao: banner.descricao || '',
        link: banner.link || '',
        tipo: banner.tipo,
        ativo: banner.ativo,
        posicao: banner.posicao
      });
    }
  }, [banner]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const target = e.target as HTMLInputElement;
      setFormData({
        ...formData,
        [name]: target.checked
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const bannerData: Partial<Banner> = {
      ...formData
    };
    
    if (selectedImage) {
      console.log('Enviando imagem no formato base64');
      bannerData.imagem = selectedImage;
    }
    
    console.log('Dados do banner a serem enviados:', bannerData);
    onSubmit(bannerData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="titulo" className="block text-sm font-medium text-gray-700">
          Título*
        </label>
        <input
          type="text"
          id="titulo"
          name="titulo"
          value={formData.titulo}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
        />
      </div>

      <div>
        <label htmlFor="descricao" className="block text-sm font-medium text-gray-700">
          Descrição
        </label>
        <textarea
          id="descricao"
          name="descricao"
          value={formData.descricao}
          onChange={handleChange}
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
        />
      </div>

      <div>
        <label htmlFor="link" className="block text-sm font-medium text-gray-700">
          Link
        </label>
        <input
          type="text"
          id="link"
          name="link"
          value={formData.link}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
        />
      </div>

      <div>
        <label htmlFor="tipo" className="block text-sm font-medium text-gray-700">
          Tipo*
        </label>
        <select
          id="tipo"
          name="tipo"
          value={formData.tipo}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
        >
          <option value="principal">Principal</option>
        </select>
      </div>

      <div>
        <label htmlFor="posicao" className="block text-sm font-medium text-gray-700">
          Posição
        </label>
        <input
          type="number"
          id="posicao"
          name="posicao"
          value={formData.posicao}
          onChange={handleChange}
          min="0"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
        />
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          id="ativo"
          name="ativo"
          checked={formData.ativo}
          onChange={(e) => setFormData({ ...formData, ativo: e.target.checked })}
          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
        />
        <label htmlFor="ativo" className="ml-2 block text-sm text-gray-900">
          Ativo
        </label>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Imagem
        </label>
        <div className="mt-1 flex items-center">
          <input
            type="file"
            accept="image/*"
            onChange={onImageSelect}
            className="mt-1 block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-md file:border-0
              file:text-sm file:font-semibold
              file:bg-indigo-50 file:text-indigo-700
              hover:file:bg-indigo-100"
          />
        </div>
        {(selectedImage || banner?.imagem_url) && (
          <div className="mt-2">
            <p className="text-sm text-gray-500">Visualização:</p>
            <Image
              src={selectedImage || banner?.imagem_url || ''}
              alt="Visualização do banner"
              className="mt-2 max-w-full h-auto border rounded-md"
              style={{ maxHeight: '200px' }}
            />
          </div>
        )}
      </div>

      <div className="flex justify-end space-x-3 pt-5">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
        >
          {banner ? 'Atualizar' : 'Criar'}
        </button>
      </div>
    </form>
  );
} 