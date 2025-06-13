'use client';

import { Banner } from '@/services/api';
import { useState, useRef } from 'react';

interface BannerTableProps {
  banners: Banner[];
  onEdit: (banner: Banner) => void;
  onDelete: (id: number) => void;
  onReorder?: (banners: Banner[]) => void;
}

export function BannerTable({ banners, onEdit, onDelete, onReorder }: BannerTableProps) {
  const [expandedBanner, setExpandedBanner] = useState<number | null>(null);
  const [draggedItem, setDraggedItem] = useState<number | null>(null);
  const [touchStartY, setTouchStartY] = useState<number | null>(null);
  const [currentTouchIndex, setCurrentTouchIndex] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const touchTimeout = useRef<NodeJS.Timeout>();

  const toggleExpand = (id: number) => {
    setExpandedBanner(expandedBanner === id ? null : id);
  };
  
  const handleDragStart = (e: React.DragEvent, index: number) => {
    if (!onReorder) return;
    setDraggedItem(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    if (!onReorder || draggedItem === null) return;
    
    const items = Array.from(banners);
    const [reorderedItem] = items.splice(draggedItem, 1);
    items.splice(targetIndex, 0, reorderedItem);
    
    const reorderedWithPositions = items.map((item, index) => ({
      ...item,
      posicao: index
    }));
    
    onReorder(reorderedWithPositions);
    setDraggedItem(null);
  };

  const handleTouchStart = (e: React.TouchEvent, index: number) => {
    if (!onReorder) return;
    
    // Previne o scroll da página
    e.preventDefault();
    
    // Aguarda um pequeno toque para iniciar o arrasto
    touchTimeout.current = setTimeout(() => {
      setIsDragging(true);
      setTouchStartY(e.touches[0].clientY);
      setCurrentTouchIndex(index);
      setDraggedItem(index);
    }, 200); // 200ms de delay para diferenciar toque de arrasto
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!onReorder || !isDragging || touchStartY === null || currentTouchIndex === null) return;
    
    // Previne o scroll da página
    e.preventDefault();

    const touchY = e.touches[0].clientY;
    const cardHeight = 200; // Altura aproximada do card
    const moveDistance = touchY - touchStartY;
    const moveIndex = Math.round(moveDistance / cardHeight);

    if (moveIndex !== 0) {
      const newIndex = currentTouchIndex + moveIndex;
      if (newIndex >= 0 && newIndex < banners.length) {
        const newBanners = [...banners];
        const [movedBanner] = newBanners.splice(currentTouchIndex, 1);
        newBanners.splice(newIndex, 0, movedBanner);
        onReorder(newBanners);
        setCurrentTouchIndex(newIndex);
        setTouchStartY(touchY);
      }
    }
  };

  const handleTouchEnd = () => {
    // Limpa o timeout se o toque for cancelado antes do delay
    if (touchTimeout.current) {
      clearTimeout(touchTimeout.current);
    }
    
    setIsDragging(false);
    setTouchStartY(null);
    setCurrentTouchIndex(null);
    setDraggedItem(null);
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
    <div className="bg-white rounded-lg shadow overflow-hidden">
      {/* Versão Desktop */}
      <div className="hidden md:block">
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
              <tr 
                    key={banner.id} 
                draggable={!!onReorder}
                onDragStart={(e) => handleDragStart(e, index)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, index)}
                className={`${draggedItem === index ? 'opacity-50 bg-gray-50' : ''} ${onReorder ? 'cursor-move hover:bg-gray-50 transition-colors' : ''}`}
                      >
                        {onReorder && (
                  <td className="px-2">
                    <div className="flex items-center justify-center h-full">
                      <svg 
                        className="w-5 h-5 text-gray-400 hover:text-gray-600 transition-colors" 
                        fill="currentColor" 
                        viewBox="0 0 24 24"
                        style={{ pointerEvents: 'none' }}
                      >
                              <path d="M8 5h2v14H8zm6 0h2v14h-2z" />
                            </svg>
                    </div>
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
                <td className="px-6 py-4">
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
                ))}
              </tbody>
            </table>
      </div>

      {/* Versão Mobile */}
      <div className="md:hidden divide-y divide-gray-200">
        {banners.map((banner, index) => (
          <div 
            key={banner.id} 
            className="p-4"
          >
            <div className="flex flex-col space-y-3">
              <div className="relative w-full h-40">
                {onReorder && (
                  <div 
                    className="absolute top-2 left-2 bg-white/80 p-2 rounded-lg shadow-lg touch-none"
                    style={{ touchAction: 'none' }}
                    onTouchStart={(e) => {
                      e.preventDefault();
                      handleTouchStart(e, index);
                    }}
                    onTouchMove={(e) => {
                      e.preventDefault();
                      handleTouchMove(e);
                    }}
                    onTouchEnd={(e) => {
                      e.preventDefault();
                      handleTouchEnd();
                    }}
                    onTouchCancel={(e) => {
                      e.preventDefault();
                      handleTouchEnd();
                    }}
                  >
                    <svg 
                      className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
                        draggedItem === index ? 'scale-110' : ''
                      }`} 
                      fill="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path d="M8 5h2v14H8zm6 0h2v14h-2z" />
                    </svg>
                  </div>
                )}
                <img
                  src={banner.imagem_url}
                  alt={banner.titulo}
                  className={`w-full h-40 object-cover rounded-lg transition-all duration-200 ${
                    draggedItem === index ? 'opacity-50 scale-105 shadow-lg' : ''
                  }`}
                />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-medium text-gray-900">{banner.titulo}</h3>
                <p className="text-sm text-gray-500 break-all">{banner.link}</p>
                <div className="flex items-center justify-between">
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    banner.ativo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {banner.ativo ? 'Ativo' : 'Inativo'}
                  </span>
                  <div className="flex space-x-3">
                    <button
                      onClick={() => onEdit(banner)}
                      className="bg-indigo-50 text-indigo-600 px-3 py-1.5 rounded-md text-sm font-medium hover:bg-indigo-100"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => onDelete(banner.id)}
                      className="bg-red-50 text-red-600 px-3 py-1.5 rounded-md text-sm font-medium hover:bg-red-100"
                    >
                      Excluir
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 