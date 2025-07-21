'use client';

import { useState, useEffect, useCallback } from 'react';
import { 
  ProjetoCampanha, 
  getProjetos, 
  createProjeto, 
  updateProjeto, 
  deleteProjeto,
  getGestoes 
} from '@/services/api';
import ProjetoForm from '@/components/ProjetoForm';
import ProjetoTable from '@/components/ProjetoTable';
import { Modal } from '@/components/Modal';
import { Filter } from 'lucide-react';

// Definir o tipo ProjetoFormData para corresponder ao do componente
interface ProjetoFormData {
  titulo: string;
  descricao: string;
  status: 'planejado' | 'em andamento' | 'concluído';
  progresso: number;
  gestao: string;
  ordem: number;
}

export default function ProjetosPage() {
  const [projetos, setProjetos] = useState<ProjetoCampanha[]>([]);
  const [gestoes, setGestoes] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Estados do modal e formulário
  const [showForm, setShowForm] = useState(false);
  const [editingProjeto, setEditingProjeto] = useState<ProjetoCampanha | undefined>();
  
  // Estados dos filtros
  const [filtroGestao, setFiltroGestao] = useState('');
  const [filtroStatus, setFiltroStatus] = useState('');
  const [showFiltros, setShowFiltros] = useState(false);

  // Carregar projetos quando filtros mudarem
  const loadProjetos = useCallback(async () => {
    try {
      setLoading(true);
      const params: { gestao?: string; status?: string } = {};
      if (filtroGestao) params.gestao = filtroGestao;
      if (filtroStatus) params.status = filtroStatus;
      
      const data = await getProjetos(params);
      setProjetos(data);
      setError(null);
    } catch (error) {
      console.error('Erro ao carregar projetos:', error);
      setError('Erro ao carregar projetos. Tente novamente.');
      setProjetos([]);
    } finally {
      setLoading(false);
    }
  }, [filtroGestao, filtroStatus]);

  // Carregar gestões disponíveis
  useEffect(() => {
    loadGestoes();
  }, []);

  // Carregar projetos quando filtros mudarem
  useEffect(() => {
    loadProjetos();
  }, [loadProjetos]);

  async function loadGestoes() {
    try {
      const data = await getGestoes();
      setGestoes(data);
    } catch (error) {
      console.error('Erro ao carregar gestões:', error);
    }
  }

  const handleCreateProjeto = async (projetoData: ProjetoFormData) => {
    try {
      // Adicionar o campo ativo que está faltando
      const projetoCompleto = {
        ...projetoData,
        ativo: true
      };
      
      const novoProjeto = await createProjeto(projetoCompleto);
      setProjetos(prev => [...prev, novoProjeto]);
      setShowForm(false);
      await loadProjetos(); // Recarregar para garantir ordem correta
    } catch (error) {
      console.error('Erro ao criar projeto:', error);
      throw error;
    }
  };

  const handleUpdateProjeto = async (projetoData: ProjetoFormData) => {
    if (!editingProjeto) return;
    
    try {
      // Manter o campo ativo do projeto original
      const projetoAtualizado = await updateProjeto(editingProjeto.id, {
        ...projetoData,
        ativo: editingProjeto.ativo
      });
      
      setProjetos(prev => 
        prev.map(p => p.id === editingProjeto.id ? projetoAtualizado : p)
      );
      setShowForm(false);
      setEditingProjeto(undefined);
      await loadProjetos(); // Recarregar para garantir ordem correta
    } catch (error) {
      console.error('Erro ao atualizar projeto:', error);
      throw error;
    }
  };

  const handleDeleteProjeto = async (id: number) => {
    if (!window.confirm('Tem certeza que deseja excluir este projeto? Esta ação não pode ser desfeita.')) {
      return;
    }

    try {
      await deleteProjeto(id);
      setProjetos(prev => prev.filter(p => p.id !== id));
    } catch (error) {
      console.error('Erro ao excluir projeto:', error);
      alert('Erro ao excluir projeto. Tente novamente.');
    }
  };

  const handleEditProjeto = (projeto: ProjetoCampanha) => {
    setEditingProjeto(projeto);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingProjeto(undefined);
  };

  const handleOpenCreateForm = () => {
    setEditingProjeto(undefined);
    setShowForm(true);
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Projetos de Campanha</h1>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowFiltros(!showFiltros)}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <Filter className="h-4 w-4" />
            Filtros
          </button>
          <button
            onClick={handleOpenCreateForm}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Novo Projeto
          </button>
        </div>
      </div>

      {/* Filtros */}
      {showFiltros && (
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
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
                <option value="planejado">Planejado</option>
                <option value="em andamento">Em Andamento</option>
                <option value="concluído">Concluído</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={() => {
                  setFiltroGestao('');
                  setFiltroStatus('');
                }}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
              >
                Limpar Filtros
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mensagem de erro */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Erro</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error}</p>
              </div>
              <div className="mt-4">
                <button
                  onClick={loadProjetos}
                  className="text-sm bg-red-100 text-red-800 px-3 py-1 rounded-md hover:bg-red-200"
                >
                  Tentar novamente
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Informações de filtros aplicados */}
      {(filtroGestao || filtroStatus) && (
        <div className="mb-4 text-sm text-gray-600">
          <span>Filtros aplicados: </span>
          {filtroGestao && <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded mr-2">Gestão: {filtroGestao}</span>}
          {filtroStatus && <span className="bg-green-100 text-green-800 px-2 py-1 rounded mr-2">Status: {filtroStatus}</span>}
          <span className="text-gray-500">({projetos.length} projeto{projetos.length !== 1 ? 's' : ''} encontrado{projetos.length !== 1 ? 's' : ''})</span>
        </div>
      )}

      {/* Tabela de projetos */}
      <div className="bg-white rounded-lg shadow">
        <ProjetoTable
          projetos={projetos}
          onEdit={handleEditProjeto}
          onDelete={handleDeleteProjeto}
          loading={loading}
        />
      </div>

      {/* Modal do formulário */}
      {showForm && (
        <Modal
          onClose={handleCloseForm}
          title={editingProjeto ? 'Editar Projeto' : 'Criar Novo Projeto'}
        >
          <ProjetoForm
            projeto={editingProjeto}
            onSubmit={editingProjeto ? handleUpdateProjeto : handleCreateProjeto}
            onCancel={handleCloseForm}
          />
        </Modal>
      )}
    </div>
  );
} 