'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Aviso, createAviso, updateAviso, getAviso } from '@/services/api';

interface AvisoFormProps {
  id?: string;
  isEditing?: boolean;
}

export default function AvisoForm({ id, isEditing = false }: AvisoFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  
  const [formData, setFormData] = useState<Omit<Aviso, 'id'>>({
    titulo: '',
    descricao: '',
    link: '',
    data_inicio: new Date().toISOString().split('T')[0],
    data_fim: ''
  });
  
  useEffect(() => {
    if (isEditing && id) {
      const fetchAviso = async () => {
        try {
          setLoading(true);
          const aviso = await getAviso(parseInt(id));
          
          setFormData({
            titulo: aviso.titulo,
            descricao: aviso.descricao || '',
            link: aviso.link || '',
            data_inicio: aviso.data_inicio.split('T')[0],
            data_fim: aviso.data_fim ? aviso.data_fim.split('T')[0] : ''
          });
        } catch (error) {
          console.error('Erro ao buscar aviso:', error);
          alert('Erro ao carregar dados do aviso');
        } finally {
          setLoading(false);
        }
      };
      
      fetchAviso();
    }
  }, [id, isEditing]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formSubmitted) return;
    setFormSubmitted(true);
    
    try {
      setLoading(true);
      
      if (isEditing && id) {
        await updateAviso(parseInt(id), formData);
      } else {
        await createAviso(formData);
      }
      
      router.push('/dashboard/avisos');
      router.refresh();
    } catch (error) {
      console.error('Erro ao salvar aviso:', error);
      alert('Erro ao salvar aviso');
      setFormSubmitted(false);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-6">
        {isEditing ? 'Editar Aviso' : 'Novo Aviso'}
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Título */}
        <div>
          <label htmlFor="titulo" className="block text-sm font-medium text-gray-700 mb-1">
            Título <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="titulo"
            name="titulo"
            value={formData.titulo}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>
        
        {/* Descrição */}
        <div>
          <label htmlFor="descricao" className="block text-sm font-medium text-gray-700 mb-1">
            Descrição
          </label>
          <textarea
            id="descricao"
            name="descricao"
            value={formData.descricao}
            onChange={handleChange}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
          <p className="text-xs text-gray-500 mt-1">
            Dica: Você pode usar quebras de linha para formatar o texto.
          </p>
        </div>
        
        {/* Link */}
        <div>
          <label htmlFor="link" className="block text-sm font-medium text-gray-700 mb-1">
            Link (opcional)
          </label>
          <input
            type="text"
            id="link"
            name="link"
            value={formData.link}
            onChange={handleChange}
            placeholder="https://..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>
        
        {/* Data Início */}
        <div>
          <label htmlFor="data_inicio" className="block text-sm font-medium text-gray-700 mb-1">
            Data de Início <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            id="data_inicio"
            name="data_inicio"
            value={formData.data_inicio}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>
        
        {/* Data Fim */}
        <div>
          <label htmlFor="data_fim" className="block text-sm font-medium text-gray-700 mb-1">
            Data de Fim (opcional)
          </label>
          <input
            type="date"
            id="data_fim"
            name="data_fim"
            value={formData.data_fim}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
          <p className="text-xs text-gray-500 mt-1">
            Se não definir uma data de fim, o aviso será exibido indefinidamente.
          </p>
        </div>
        
        {/* Botões */}
        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={() => router.push('/dashboard/avisos')}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
            disabled={loading}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors"
            disabled={loading || formSubmitted}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Salvando...
              </span>
            ) : (
              'Salvar'
            )}
          </button>
        </div>
      </form>
    </div>
  );
} 