'use client';

import { useState, useEffect } from 'react';
import { ProjetoCampanha, getGestoes } from '@/services/api';

interface ProjetoFormData {
  titulo: string;
  descricao: string;
  status: 'planejado' | 'em andamento' | 'concluído';
  progresso: number;
  gestao: string;
  ordem: number;
}

interface ProjetoFormProps {
  projeto?: ProjetoCampanha;
  onSubmit: (projeto: ProjetoFormData) => Promise<void>;
  onCancel: () => void;
}

const statusOptions = [
  { value: 'planejado', label: 'Planejado' },
  { value: 'em andamento', label: 'Em Andamento' },
  { value: 'concluído', label: 'Concluído' }
] as const;

export default function ProjetoForm({ projeto, onSubmit, onCancel }: ProjetoFormProps) {
  const [formData, setFormData] = useState<ProjetoFormData>({
    titulo: projeto?.titulo || '',
    descricao: projeto?.descricao || '',
    status: projeto?.status || 'planejado',
    progresso: projeto?.progresso || 0,
    gestao: projeto?.gestao || '',
    ordem: projeto?.ordem || 0
  });
  
  const [gestoes, setGestoes] = useState<string[]>([]);
  const [errors, setErrors] = useState<Partial<ProjetoFormData>>({});
  const [loading, setLoading] = useState(false);
  const [loadingGestoes, setLoadingGestoes] = useState(true);

  // Carregar gestões disponíveis
  useEffect(() => {
    const fetchGestoes = async () => {
      try {
        setLoadingGestoes(true);
        const data = await getGestoes();
        setGestoes(data);
        
        // Se não há projeto sendo editado e não há gestão selecionada, usar a primeira
        if (!projeto && !formData.gestao && data.length > 0) {
          setFormData(prev => ({ ...prev, gestao: data[0] }));
        }
      } catch (error) {
        console.error('Erro ao carregar gestões:', error);
      } finally {
        setLoadingGestoes(false);
      }
    };

    fetchGestoes();
  }, [projeto, formData.gestao]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    
    // Converter progresso para número
    const finalValue = name === 'progresso' || name === 'ordem' ? Number(value) : value;
    
    setFormData(prev => ({
      ...prev,
      [name]: finalValue
    }));

    // Limpar erro do campo
    if (errors[name as keyof ProjetoFormData]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<ProjetoFormData> = {};

    if (!formData.titulo.trim()) {
      newErrors.titulo = 'Título é obrigatório';
    }

    if (!formData.descricao.trim()) {
      newErrors.descricao = 'Descrição é obrigatória';
    }

    if (!formData.gestao.trim()) {
      newErrors.gestao = 'Gestão é obrigatória';
    }

    if (formData.progresso < 0 || formData.progresso > 100) {
      newErrors.progresso = 'Progresso deve estar entre 0 e 100';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Erro ao salvar projeto:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="titulo" className="block text-sm font-medium text-gray-700 mb-1">
          Título *
        </label>
        <input
          type="text"
          id="titulo"
          name="titulo"
          value={formData.titulo}
          onChange={handleChange}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.titulo ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Ex: Semana da Computação"
        />
        {errors.titulo && (
          <p className="text-red-500 text-sm mt-1">{errors.titulo}</p>
        )}
      </div>

      <div>
        <label htmlFor="descricao" className="block text-sm font-medium text-gray-700 mb-1">
          Descrição *
        </label>
        <textarea
          id="descricao"
          name="descricao"
          value={formData.descricao}
          onChange={handleChange}
          rows={4}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.descricao ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Descreva o projeto de campanha..."
        />
        {errors.descricao && (
          <p className="text-red-500 text-sm mt-1">{errors.descricao}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {statusOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="progresso" className="block text-sm font-medium text-gray-700 mb-1">
            Progresso (%)
          </label>
          <input
            type="number"
            id="progresso"
            name="progresso"
            value={formData.progresso}
            onChange={handleChange}
            min="0"
            max="100"
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.progresso ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.progresso && (
            <p className="text-red-500 text-sm mt-1">{errors.progresso}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="gestao" className="block text-sm font-medium text-gray-700 mb-1">
            Gestão *
          </label>
          {loadingGestoes ? (
            <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100">
              Carregando gestões...
            </div>
          ) : (
            <select
              id="gestao"
              name="gestao"
              value={formData.gestao}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.gestao ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Selecione uma gestão</option>
              {gestoes.map(gestao => (
                <option key={gestao} value={gestao}>
                  {gestao}
                </option>
              ))}
            </select>
          )}
          {errors.gestao && (
            <p className="text-red-500 text-sm mt-1">{errors.gestao}</p>
          )}
        </div>

        <div>
          <label htmlFor="ordem" className="block text-sm font-medium text-gray-700 mb-1">
            Ordem de Exibição
          </label>
          <input
            type="number"
            id="ordem"
            name="ordem"
            value={formData.ordem}
            onChange={handleChange}
            min="0"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
          disabled={loading}
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          {loading ? 'Salvando...' : projeto ? 'Atualizar' : 'Criar'} Projeto
        </button>
      </div>
    </form>
  );
} 