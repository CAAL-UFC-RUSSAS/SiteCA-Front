'use client';

import { Banner } from '@/services/api';
import { useState } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';

interface BannerTableProps {
  banners: Banner[];
  onEdit: (banner: Banner) => void;
  onDelete: (id: number) => void;
  onReorder?: (bannersReordered: Banner[]) => void;
}

export function BannerTable({ banners, onEdit, onDelete, onReorder }: BannerTableProps) {
  const [expandedBanner, setExpandedBanner] = useState<number | null>(null);

  const toggleExpand = (id: number) => {
    setExpandedBanner(expandedBanner === id ? null : id);
  };
  
  const handleDragEnd = (result: DropResult) => {
    if (!result.destination || !onReorder) return;
    
    const items = Array.from(banners);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    
    const reorderedWithPositions = items.map((item, index) => ({
      ...item,
      posicao: index
    }));
    
    onReorder(reorderedWithPositions);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  if (!banners.length) {
    return <p className="text-gray-500 text-center py-8">Nenhum banner encontrado.</p>;
  }

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="banners" isDropDisabled={!onReorder}>
        {(provided) => (
          <div
            className="overflow-x-auto"
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {onReorder && (
                    <th scope="col" className="px-2 py-3 w-10"></th>
                  )}
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Imagem
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Título
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tipo
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Posição
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {banners.map((banner, index) => (
                  <Draggable 
                    key={banner.id} 
                    draggableId={banner.id.toString()} 
                    index={index}
                    isDragDisabled={!onReorder}
                  >
                    {(provided) => (
                      <tr 
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                      >
                        {onReorder && (
                          <td className="px-2" {...provided.dragHandleProps}>
                            <svg className="w-5 h-5 text-gray-400 cursor-move" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M8 5h2v14H8zm6 0h2v14h-2z" />
                            </svg>
                          </td>
                        )}
                        <td className="px-6 py-4 whitespace-nowrap">
                          {banner.imagem_url ? (
                            <img
                              src={banner.imagem_url}
                              alt={banner.titulo}
                              className="h-16 w-24 object-cover rounded"
                            />
                          ) : (
                            <div className="h-16 w-24 bg-gray-200 flex items-center justify-center rounded">
                              <span className="text-gray-500 text-xs">Sem imagem</span>
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {banner.titulo}
                          </div>
                          <button
                            onClick={() => toggleExpand(banner.id)}
                            className="text-xs text-indigo-600 hover:text-indigo-900"
                          >
                            {expandedBanner === banner.id ? 'Ocultar detalhes' : 'Ver detalhes'}
                          </button>
                          {expandedBanner === banner.id && (
                            <div className="mt-2 text-sm text-gray-500">
                              <p><strong>Descrição:</strong> {banner.descricao || 'N/A'}</p>
                              <p><strong>Link:</strong> {banner.link || 'N/A'}</p>
                              <p><strong>Criado em:</strong> {formatDate(banner.created_at)}</p>
                              <p><strong>Atualizado em:</strong> {formatDate(banner.updated_at)}</p>
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                            {banner.tipo.charAt(0).toUpperCase() + banner.tipo.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            banner.ativo
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {banner.ativo ? 'Ativo' : 'Inativo'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {banner.posicao}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => onEdit(banner)}
                            className="text-indigo-600 hover:text-indigo-900 mr-4"
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => {
                              if (confirm('Tem certeza que deseja excluir este banner?')) {
                                onDelete(banner.id);
                              }
                            }}
                            className="text-red-600 hover:text-red-900"
                          >
                            Excluir
                          </button>
                        </td>
                      </tr>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </tbody>
            </table>
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
} 