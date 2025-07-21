'use client';

import { useState } from 'react';
import { ProjetoCampanha } from '@/services/api';

interface ProjetoTableProps {
  projetos: ProjetoCampanha[];
  onEdit: (projeto: ProjetoCampanha) => void;
  onDelete: (id: number) => void;
  loading?: boolean;
}

type SortField = 'titulo' | 'status' | 'progresso' | 'gestao' | 'ordem' | 'created_at';
type SortDirection = 'asc' | 'desc';

export default function ProjetoTable({ projetos, onEdit, onDelete, loading = false }: ProjetoTableProps) {
  const [sortField, setSortField] = useState<SortField>('ordem');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedProjetos = [...projetos].sort((a, b) => {
    let aValue = a[sortField];
    let bValue = b[sortField];

    // Tratar valores undefined
    if (aValue === undefined) aValue = '';
    if (bValue === undefined) bValue = '';

    // Converter para string para comparação consistente
    if (typeof aValue === 'string') aValue = aValue.toLowerCase();
    if (typeof bValue === 'string') bValue = bValue.toLowerCase();

    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return '—';
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch (error) {
      console.error('Erro ao formatar data:', error);
      return dateString.split('T')[0];
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'concluído':
        return 'bg-green-100 text-green-800';
      case 'em andamento':
        return 'bg-blue-100 text-blue-800';
      case 'planejado':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'concluído':
        return 'Concluído';
      case 'em andamento':
        return 'Em Andamento';
      case 'planejado':
        return 'Planejado';
      default:
        return status;
    }
  };

  const renderProgressBar = (progresso: number) => {
    let colorClass = 'bg-blue-600';
    if (progresso >= 100) colorClass = 'bg-green-500';
    else if (progresso >= 75) colorClass = 'bg-blue-500';
    else if (progresso >= 50) colorClass = 'bg-yellow-500';
    else if (progresso > 0) colorClass = 'bg-orange-500';
    else colorClass = 'bg-gray-300';

    return (
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className={`${colorClass} h-2 rounded-full transition-all duration-300`}
          style={{ width: `${Math.min(100, Math.max(0, progresso))}%` }}
        />
      </div>
    );
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) {
      return <span className="text-gray-400">⇅</span>;
    }
    return sortDirection === 'asc' ? <span className="text-blue-600">↑</span> : <span className="text-blue-600">↓</span>;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (projetos.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">Nenhum projeto encontrado</p>
        <p className="text-gray-400 mt-2">Crie seu primeiro projeto de campanha!</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-300 rounded-lg">
        <thead className="bg-gray-50">
          <tr>
            <th 
              onClick={() => handleSort('titulo')}
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
            >
              <div className="flex items-center space-x-1">
                <span>Título</span>
                <SortIcon field="titulo" />
              </div>
            </th>
            <th 
              onClick={() => handleSort('status')}
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
            >
              <div className="flex items-center space-x-1">
                <span>Status</span>
                <SortIcon field="status" />
              </div>
            </th>
            <th 
              onClick={() => handleSort('progresso')}
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
            >
              <div className="flex items-center space-x-1">
                <span>Progresso</span>
                <SortIcon field="progresso" />
              </div>
            </th>
            <th 
              onClick={() => handleSort('gestao')}
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
            >
              <div className="flex items-center space-x-1">
                <span>Gestão</span>
                <SortIcon field="gestao" />
              </div>
            </th>
            <th 
              onClick={() => handleSort('ordem')}
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
            >
              <div className="flex items-center space-x-1">
                <span>Ordem</span>
                <SortIcon field="ordem" />
              </div>
            </th>
            <th 
              onClick={() => handleSort('created_at')}
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
            >
              <div className="flex items-center space-x-1">
                <span>Criado em</span>
                <SortIcon field="created_at" />
              </div>
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Ações
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {sortedProjetos.map((projeto) => (
            <tr key={projeto.id} className="hover:bg-gray-50">
              <td className="px-6 py-4">
                <div>
                  <div className="text-sm font-medium text-gray-900 max-w-xs truncate" title={projeto.titulo}>
                    {projeto.titulo}
                  </div>
                  <div className="text-sm text-gray-500 max-w-xs truncate" title={projeto.descricao}>
                    {projeto.descricao}
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(projeto.status)}`}>
                  {getStatusLabel(projeto.status)}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center space-x-2">
                  <div className="w-16">
                    {renderProgressBar(projeto.progresso)}
                  </div>
                  <span className="text-sm text-gray-700 min-w-[3rem]">
                    {projeto.progresso}%
                  </span>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {projeto.gestao}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {projeto.ordem}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {formatDate(projeto.created_at)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                <button
                  onClick={() => onEdit(projeto)}
                  className="text-blue-600 hover:text-blue-900 transition-colors"
                >
                  Editar
                </button>
                <button
                  onClick={() => onDelete(projeto.id)}
                  className="text-red-600 hover:text-red-900 transition-colors"
                >
                  Excluir
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
} 