'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { MembroGestao } from '@/services/api';
import { FaUserAlt } from 'react-icons/fa';

interface MembroTableProps {
  membros: MembroGestao[];
  onEdit: (membro: MembroGestao) => void;
  onDelete: (id: number) => void;
}

export function MembroTable({ membros, onEdit, onDelete }: MembroTableProps) {
  const [sortField, setSortField] = useState<keyof MembroGestao>('ordem');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const handleSort = (field: keyof MembroGestao) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleDeleteClick = (membro: MembroGestao) => {
    if (window.confirm(`Tem certeza que deseja excluir ${membro.nome}?`)) {
      onDelete(membro.id);
    }
  };

  const sortedMembros = [...membros].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];
    
    if (aValue === bValue) return 0;
    
    const comparison = aValue! < bValue! ? -1 : 1;
    return sortDirection === 'asc' ? comparison : -comparison;
  });

  const getStatusBadge = (status: string) => {
    const styles = {
      atual: 'bg-green-100 text-green-800',
      antiga: 'bg-gray-100 text-gray-800'
    };
    
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${styles[status as keyof typeof styles] || styles.atual}`}>
        {status === 'atual' ? 'Atual' : 'Antiga'}
      </span>
    );
  };

  const SortIcon = ({ field }: { field: keyof MembroGestao }) => {
    if (sortField !== field) {
      return (
        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
        </svg>
      );
    }
    
    return sortDirection === 'asc' ? (
      <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
      </svg>
    ) : (
      <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    );
  };

  if (membros.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-8 text-center">
            <FaUserAlt className="h-8 w-8 text-black" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhum membro</h3>
          <p className="mt-1 text-sm text-gray-500">Comece adicionando um novo membro da gestão.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Foto
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('nome')}
              >
                <div className="flex items-center space-x-1">
                  <span>Nome</span>
                  <SortIcon field="nome" />
                </div>
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('cargo')}
              >
                <div className="flex items-center space-x-1">
                  <span>Cargo</span>
                  <SortIcon field="cargo" />
                </div>
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('area')}
              >
                <div className="flex items-center space-x-1">
                  <span>Área</span>
                  <SortIcon field="area" />
                </div>
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('gestao')}
              >
                <div className="flex items-center space-x-1">
                  <span>Gestão</span>
                  <SortIcon field="gestao" />
                </div>
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('status')}
              >
                <div className="flex items-center space-x-1">
                  <span>Status</span>
                  <SortIcon field="status" />
                </div>
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('ordem')}
              >
                <div className="flex items-center space-x-1">
                  <span>Ordem</span>
                  <SortIcon field="ordem" />
                </div>
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedMembros.map((membro) => (
              <tr key={membro.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="h-12 w-12 rounded-full overflow-hidden bg-gray-200">
                    {membro.foto_url ? (
                      <div className="relative h-12 w-12">
                        <Image
                          src={membro.foto_url}
                          alt={`Foto de ${membro.nome}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="h-12 w-12 flex items-center justify-center">
                        <svg className="h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{membro.nome}</div>
                  {membro.contato && (
                    <div className="text-sm text-gray-500">{membro.contato}</div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{membro.cargo}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{membro.area}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{membro.gestao}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getStatusBadge(membro.status)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{membro.ordem}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => onEdit(membro)}
                      className="text-indigo-600 hover:text-indigo-900 transition-colors"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDeleteClick(membro)}
                      className="text-red-600 hover:text-red-900 transition-colors"
                    >
                      Excluir
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 