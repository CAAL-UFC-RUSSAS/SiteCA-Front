'use client';

import { useState, useEffect, useCallback } from 'react';
import { getMembros, createMembro, updateMembro, deleteMembro, getGestoes, MembroGestao } from '@/services/api';
import { MembroTable } from '@/components/MembroTable';
import { MembroForm } from '@/components/MembroForm';
import { Modal } from '@/components/Modal';
import { Users } from 'lucide-react';


export default function MembrosPage() {
  const [membros, setMembros] = useState<MembroGestao[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingMembro, setEditingMembro] = useState<MembroGestao | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [filtroGestao, setFiltroGestao] = useState('');
  const [filtroStatus, setFiltroStatus] = useState('');
  const [gestoes, setGestoes] = useState<string[]>([]);

  const loadMembros = useCallback(async () => {
    try {
      setLoading(true);
      const params: { gestao?: string; status?: string } = {};
      if (filtroGestao) params.gestao = filtroGestao;
      if (filtroStatus) params.status = filtroStatus;
      
      const data = await getMembros(params);
      console.log('Membros carregados:', data);
      setMembros(data);
      setError('');
    } catch (err) {
      console.error('Erro ao carregar membros:', err);
      setError('Erro ao carregar membros');
    } finally {
      setLoading(false);
    }
  }, [filtroGestao, filtroStatus]);

  useEffect(() => {
    loadMembros();
    loadGestoes();
  }, [loadMembros]);

  async function loadGestoes() {
    try {
      const data = await getGestoes();
      setGestoes(data);
    } catch (err) {
      console.error('Erro ao carregar gestões:', err);
    }
  }

  const handleSubmit = async (membro: Partial<MembroGestao>) => {
    try {
      if (!membro.nome || !membro.cargo || !membro.area || !membro.descricao || !membro.gestao) {
        alert('Por favor, preencha todos os campos obrigatórios.');
        return;
      }

      const membroFormatado = {
        nome: membro.nome,
        cargo: membro.cargo,
        area: membro.area,
        descricao: membro.descricao,
        contato: membro.contato || '',
        gestao: membro.gestao,
        status: membro.status || 'atual',
        ordem: membro.ordem || 0,
        ativo: membro.ativo !== undefined ? membro.ativo : true,
        foto: selectedImage || undefined
      };

      console.log('Enviando membro formatado:', membroFormatado);

      if (editingMembro) {
        await updateMembro(editingMembro.id, membroFormatado);
      } else {
        await createMembro(membroFormatado);
      }
      
      setShowForm(false);
      setEditingMembro(null);
      setSelectedImage(null);
      loadMembros();
      loadGestoes(); // Recarregar gestões para pegar novas adicionadas
    } catch (error) {
      console.error('Erro ao salvar membro:', error);
      alert('Erro ao salvar membro. Por favor, tente novamente.');
    }
  };

  const handleEdit = (membro: MembroGestao) => {
    console.log('Editando membro:', membro);
    setEditingMembro(membro);
    setSelectedImage(membro.foto_url || null);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteMembro(id);
      loadMembros();
    } catch (error) {
      console.error('Erro ao deletar membro:', error);
      alert('Erro ao deletar membro. Por favor, tente novamente.');
    }
  };


  const handleImageSelect = (image: string) => {
    setSelectedImage(image);
  };

  const handleNewMembro = () => {
    setEditingMembro(null);
    setSelectedImage(null);
    setShowForm(true);
  };

  const handleCloseModal = () => {
    setShowForm(false);
    setEditingMembro(null);
    setSelectedImage(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-0 mb-6">
        <h1 className="text-xl md:text-2xl font-bold text-black">Gerenciar Membros da Gestão</h1>
        <button
          onClick={handleNewMembro}
          className="w-full md:w-auto bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition-colors"
        >
          Adicionar Membro
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-sm md:text-base">
          {error}
        </div>
      )}

      {/* Filtros */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Filtros</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="filtroGestao" className="block text-sm font-medium text-gray-700 mb-1">
              Gestão
            </label>
            <select
              id="filtroGestao"
              value={filtroGestao}
              onChange={(e) => setFiltroGestao(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Todas as gestões</option>
              {gestoes.map(gestao => (
                <option key={gestao} value={gestao}>{gestao}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="filtroStatus" className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              id="filtroStatus"
              value={filtroStatus}
              onChange={(e) => setFiltroStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Todos os status</option>
              <option value="atual">Atual</option>
              <option value="antiga">Antiga</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={() => {
                setFiltroGestao('');
                setFiltroStatus('');
              }}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
            >
              Limpar filtros
            </button>
          </div>
        </div>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
                <Users className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total de Membros</p>
              <p className="text-2xl font-semibold text-gray-900">{membros.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Gestão Atual</p>
              <p className="text-2xl font-semibold text-gray-900">
                {membros.filter(m => m.status === 'atual').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-8 w-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Gestões Anteriores</p>
              <p className="text-2xl font-semibold text-gray-900">
                {membros.filter(m => m.status === 'antiga').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <MembroTable
          membros={membros}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>

      {showForm && (
        <Modal
          title={editingMembro ? 'Editar Membro' : 'Novo Membro'}
          onClose={handleCloseModal}
        >
          <MembroForm
            membro={editingMembro || undefined}
            onSubmit={handleSubmit}
            onCancel={handleCloseModal}
            selectedImage={selectedImage}
            onImageSelect={handleImageSelect}
          />
        </Modal>
      )}
    </div>
  );
} 