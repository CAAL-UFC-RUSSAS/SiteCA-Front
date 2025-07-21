'use client';

import React, { useState, useEffect } from 'react';
import { MembroGestao } from '@/services/api';

interface MembroFormProps {
  membro?: MembroGestao;
  onSubmit: (membro: Partial<MembroGestao>) => void;
  onCancel: () => void;
  selectedImage?: string | null;
  onImageSelect: (image: string) => void;
}

export function MembroForm({ membro, onSubmit, onCancel, selectedImage, onImageSelect }: MembroFormProps) {
  const [formData, setFormData] = useState({
    nome: membro?.nome || '',
    cargo: membro?.cargo || '',
    area: membro?.area || '',
    descricao: membro?.descricao || '',
    contato: membro?.contato || '',
    gestao: membro?.gestao || '',
    status: membro?.status || 'atual' as 'atual' | 'antiga',
    ordem: membro?.ordem || 0,
    ativo: membro?.ativo !== undefined ? membro.ativo : true
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (membro && membro.foto_url && !selectedImage) {
      onImageSelect(membro.foto_url);
    }
  }, [membro, selectedImage, onImageSelect]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : 
              name === 'ordem' ? parseInt(value) || 0 : value
    }));
    
    // Limpar erro específico quando o usuário começar a digitar
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Verificar tamanho (5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({
          ...prev,
          foto: 'A foto deve ter no máximo 5MB'
        }));
        return;
      }

      // Verificar tipo de arquivo
      if (!file.type.startsWith('image/')) {
        setErrors(prev => ({
          ...prev,
          foto: 'Por favor, selecione uma imagem válida'
        }));
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        onImageSelect(result);
        // Limpar erro de foto
        setErrors(prev => ({
          ...prev,
          foto: ''
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.nome.trim()) {
      newErrors.nome = 'Nome é obrigatório';
    }
    if (!formData.cargo.trim()) {
      newErrors.cargo = 'Cargo é obrigatório';
    }
    if (!formData.area.trim()) {
      newErrors.area = 'Área é obrigatória';
    }
    if (!formData.descricao.trim()) {
      newErrors.descricao = 'Descrição é obrigatória';
    }
    if (!formData.gestao.trim()) {
      newErrors.gestao = 'Gestão é obrigatória';
    }
    if (!selectedImage) {
      newErrors.foto = 'Foto é obrigatória';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const membroData = {
        ...formData,
        foto: selectedImage || undefined
      };
      
      await onSubmit(membroData);
    } catch (error) {
      console.error('Erro ao salvar membro:', error);
      setErrors({ form: 'Erro ao salvar membro. Tente novamente.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {errors.form && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {errors.form}
        </div>
      )}

      {/* Nome */}
      <div>
        <label htmlFor="nome" className="block text-sm font-medium text-gray-700 mb-1">
          Nome *
        </label>
        <input
          type="text"
          id="nome"
          name="nome"
          value={formData.nome}
          onChange={handleInputChange}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.nome ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {errors.nome && <p className="text-red-500 text-sm mt-1">{errors.nome}</p>}
      </div>

      {/* Cargo */}
      <div>
        <label htmlFor="cargo" className="block text-sm font-medium text-gray-700 mb-1">
          Cargo *
        </label>
        <input
          type="text"
          id="cargo"
          name="cargo"
          value={formData.cargo}
          onChange={handleInputChange}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.cargo ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {errors.cargo && <p className="text-red-500 text-sm mt-1">{errors.cargo}</p>}
      </div>

      {/* Área */}
      <div>
        <label htmlFor="area" className="block text-sm font-medium text-gray-700 mb-1">
          Área *
        </label>
        <input
          type="text"
          id="area"
          name="area"
          value={formData.area}
          onChange={handleInputChange}
          placeholder="Ex: Coordenação Geral, Eventos e Cultura, Finanças"
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.area ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {errors.area && <p className="text-red-500 text-sm mt-1">{errors.area}</p>}
      </div>

      {/* Descrição */}
      <div>
        <label htmlFor="descricao" className="block text-sm font-medium text-gray-700 mb-1">
          Descrição *
        </label>
        <textarea
          id="descricao"
          name="descricao"
          value={formData.descricao}
          onChange={handleInputChange}
          rows={3}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.descricao ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {errors.descricao && <p className="text-red-500 text-sm mt-1">{errors.descricao}</p>}
      </div>

      {/* Contato */}
      <div>
        <label htmlFor="contato" className="block text-sm font-medium text-gray-700 mb-1">
          Contato (E-mail)
        </label>
        <input
          type="email"
          id="contato"
          name="contato"
          value={formData.contato}
          onChange={handleInputChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Gestão */}
      <div>
        <label htmlFor="gestao" className="block text-sm font-medium text-gray-700 mb-1">
          Gestão *
        </label>
        <input
          type="text"
          id="gestao"
          name="gestao"
          value={formData.gestao}
          onChange={handleInputChange}
          placeholder="Ex: 2023-2024, 2024-2025"
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.gestao ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {errors.gestao && <p className="text-red-500 text-sm mt-1">{errors.gestao}</p>}
      </div>

      {/* Status */}
      <div>
        <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
          Status
        </label>
        <select
          id="status"
          name="status"
          value={formData.status}
          onChange={handleInputChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="atual">Atual</option>
          <option value="antiga">Antiga</option>
        </select>
      </div>

      {/* Ordem */}
      <div>
        <label htmlFor="ordem" className="block text-sm font-medium text-gray-700 mb-1">
          Ordem de Exibição
        </label>
        <input
          type="number"
          id="ordem"
          name="ordem"
          value={formData.ordem}
          onChange={handleInputChange}
          min="0"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Foto */}
      <div>
        <label htmlFor="foto" className="block text-sm font-medium text-gray-700 mb-1">
          Foto *
        </label>
        <input
          type="file"
          id="foto"
          accept="image/*"
          onChange={handleImageUpload}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.foto ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {errors.foto && <p className="text-red-500 text-sm mt-1">{errors.foto}</p>}
        
        {selectedImage && (
          <div className="mt-2">
            <img
              src={selectedImage}
              alt="Preview"
              className="w-32 h-32 object-cover rounded-md border"
            />
          </div>
        )}
      </div>

      {/* Ativo */}
      <div className="flex items-center">
        <input
          type="checkbox"
          id="ativo"
          name="ativo"
          checked={formData.ativo}
          onChange={handleInputChange}
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
        <label htmlFor="ativo" className="ml-2 block text-sm text-gray-700">
          Membro ativo
        </label>
      </div>

      {/* Botões */}
      <div className="flex justify-end space-x-2 pt-4 border-t">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isSubmitting ? 'Salvando...' : (membro ? 'Atualizar' : 'Criar')}
        </button>
      </div>
    </form>
  );
} 