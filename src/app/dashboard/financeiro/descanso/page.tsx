'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import axios from 'axios';
import { useToast } from '@/hooks/useToast';

type Transacao = {
  id: number;
  descricao: string;
  valor: number;
  tipo: 'entrada' | 'saida';
  data: string;
  created_at: string;
};

type Meta = {
  id: number;
  descricao: string;
  valorNecessario: number;
  valorArrecadado: number;
  dataLimite: string;
  tipo: 'ca' | 'descanso';
  concluida?: boolean;
};

type Relatorio = {
  transacoes: Transacao[];
  resumo: {
    saldoTotal: number;
    totalEntradas: number;
    totalSaidas: number;
  };
};

export default function FinanceiroDescansoPage() {
  const [transacoes, setTransacoes] = useState<Transacao[]>([]);
  const [resumo, setResumo] = useState({ saldoTotal: 0, totalEntradas: 0, totalSaidas: 0 });
  const [descricao, setDescricao] = useState('');
  const [valor, setValor] = useState('');
  const [tipo, setTipo] = useState<'entrada' | 'saida'>('entrada');
  const [data, setData] = useState('');
  const [carregando, setCarregando] = useState(true);
  const [editando, setEditando] = useState<number | null>(null);
  const [ano, setAno] = useState(new Date().getFullYear().toString());
  const [mes, setMes] = useState((new Date().getMonth() + 1).toString().padStart(2, '0'));
  const [metas, setMetas] = useState<Meta[]>([]);
  const [novaMeta, setNovaMeta] = useState<Omit<Meta, 'id' | 'tipo' | 'concluida'>>({
    descricao: '',
    valorNecessario: 0,
    valorArrecadado: 0,
    dataLimite: new Date().toISOString().split('T')[0]
  });
  const [mostrarFormMeta, setMostrarFormMeta] = useState(false);
  const [carregandoMetas, setCarregandoMetas] = useState(true);
  const [editandoMeta, setEditandoMeta] = useState<number | null>(null);
  
  const router = useRouter();
  const { toast } = useToast();
  
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

  const carregarTransacoes = async () => {
    setCarregando(true);
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.get<Relatorio>(`${API_URL}/financeiro/descanso/relatorio`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      setTransacoes(response.data.transacoes);
      setResumo(response.data.resumo);
    } catch (error) {
      console.error('Erro ao carregar transações:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar as transações',
        variant: 'destructive',
      });
    } finally {
      setCarregando(false);
    }
  };

  const carregarMetas = async () => {
    setCarregandoMetas(true);
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.get<Meta[]>(`${API_URL}/financeiro/metas`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      // Filtrar apenas metas da sala de descanso
      const metasDescanso = response.data.filter(meta => meta.tipo === 'descanso');
      setMetas(metasDescanso);
    } catch (error) {
      console.error('Erro ao carregar metas:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar as metas',
        variant: 'destructive',
      });
    } finally {
      setCarregandoMetas(false);
    }
  };

  const atualizarProgressoMetas = async () => {
    try {
      const token = localStorage.getItem('authToken');
      await axios.get(`${API_URL}/financeiro/metas/progresso/descanso`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      // Recarregar metas após atualização
      carregarMetas();
      
      toast({
        title: 'Sucesso',
        description: 'Progresso das metas atualizado com o saldo disponível',
      });
    } catch (error) {
      console.error('Erro ao atualizar progresso das metas:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível atualizar o progresso das metas',
        variant: 'destructive',
      });
    }
  };

  useEffect(() => {
    carregarTransacoes();
    carregarMetas();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!descricao || !valor || !data) {
      toast({
        title: 'Erro',
        description: 'Preencha todos os campos',
        variant: 'destructive',
      });
      return;
    }

    const token = localStorage.getItem('authToken');
    const valorNumerico = parseFloat(valor.replace(',', '.'));

    try {
      if (editando) {
        await axios.put(
          `${API_URL}/financeiro/descanso/${editando}`,
          { descricao, valor: valorNumerico, tipo, data },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast({
          title: 'Sucesso',
          description: 'Transação atualizada com sucesso',
        });
      } else {
        await axios.post(
          `${API_URL}/financeiro/descanso`,
          { descricao, valor: valorNumerico, tipo, data },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast({
          title: 'Sucesso',
          description: 'Transação registrada com sucesso',
        });
      }

      // Limpar formulário
      setDescricao('');
      setValor('');
      setTipo('entrada');
      setData('');
      setEditando(null);
      
      // Recarregar transações
      carregarTransacoes();
    } catch (error) {
      console.error('Erro ao salvar transação:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível salvar a transação',
        variant: 'destructive',
      });
    }
  };

  const handleEditar = (transacao: Transacao) => {
    setEditando(transacao.id);
    setDescricao(transacao.descricao);
    setValor(transacao.valor.toString());
    setTipo(transacao.tipo);
    setData(transacao.data.split('T')[0]);
  };

  const handleExcluir = async (id: number) => {
    if (!confirm('Tem certeza que deseja excluir esta transação?')) {
      return;
    }

    try {
      const token = localStorage.getItem('authToken');
      await axios.delete(`${API_URL}/financeiro/descanso/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      toast({
        title: 'Sucesso',
        description: 'Transação excluída com sucesso',
      });
      
      carregarTransacoes();
    } catch (error) {
      console.error('Erro ao excluir transação:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível excluir a transação',
        variant: 'destructive',
      });
    }
  };

  const gerarRelatorioMensal = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.get(
        `${API_URL}/financeiro/descanso/relatorio/${mes}/${ano}`,
        {
          headers: { 
            Authorization: `Bearer ${token}` 
          },
          responseType: 'blob',
        }
      );
      
      // Criar link para download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `relatorio_descanso_${mes}_${ano}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      toast({
        title: 'Sucesso',
        description: 'Relatório gerado com sucesso',
      });
    } catch (error) {
      console.error('Erro ao gerar relatório:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível gerar o relatório',
        variant: 'destructive',
      });
    }
  };

  const handleSubmitMeta = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!novaMeta.descricao || novaMeta.valorNecessario <= 0 || !novaMeta.dataLimite) {
      toast({
        title: 'Erro',
        description: 'Preencha todos os campos obrigatórios da meta',
        variant: 'destructive',
      });
      return;
    }

    try {
      const token = localStorage.getItem('authToken');
      
      if (editandoMeta) {
        // Atualizar meta existente
        await axios.put(
          `${API_URL}/financeiro/metas/${editandoMeta}`,
          {
            ...novaMeta,
            tipo: 'descanso',
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        
        toast({
          title: 'Sucesso',
          description: 'Meta atualizada com sucesso',
        });
      } else {
        // Adicionar nova meta
        await axios.post(
          `${API_URL}/financeiro/metas`,
          {
            ...novaMeta,
            tipo: 'descanso',
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        
        toast({
          title: 'Sucesso',
          description: 'Meta adicionada com sucesso',
        });
      }
      
      // Limpar formulário
      setNovaMeta({
        descricao: '',
        valorNecessario: 0,
        valorArrecadado: 0,
        dataLimite: new Date().toISOString().split('T')[0]
      });
      setMostrarFormMeta(false);
      setEditandoMeta(null);
      
      // Recarregar metas
      carregarMetas();
    } catch (error) {
      console.error('Erro ao salvar meta:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível salvar a meta',
        variant: 'destructive',
      });
    }
  };
  
  const handleMetaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNovaMeta(prev => ({
      ...prev,
      [name]: name === 'valorNecessario' || name === 'valorArrecadado' 
        ? parseFloat(value) || 0 
        : value
    }));
  };
  
  const handleConcluirMeta = async (id: number) => {
    try {
      const token = localStorage.getItem('authToken');
      await axios.put(
        `${API_URL}/financeiro/metas/${id}/concluir`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Recarregar metas
      carregarMetas();
      
      toast({
        title: 'Sucesso',
        description: 'Meta marcada como concluída',
      });
    } catch (error) {
      console.error('Erro ao concluir meta:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível marcar a meta como concluída',
        variant: 'destructive',
      });
    }
  };

  const handleDesmarcarMeta = async (id: number, meta: Meta) => {
    try {
      const token = localStorage.getItem('authToken');
      // Como não temos um campo concluida, vamos atualizar o valorArrecadado para ser menor que valorNecessario
      await axios.put(
        `${API_URL}/financeiro/metas/${id}`,
        {
          ...meta,
          valorArrecadado: parseFloat(String(meta.valorNecessario)) * 0.9, // 90% do valor necessário
          tipo: 'descanso'
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Recarregar metas
      carregarMetas();
      
      toast({
        title: 'Sucesso',
        description: 'Meta desmarcada como concluída',
      });
    } catch (error) {
      console.error('Erro ao desmarcar meta:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível desmarcar a meta como concluída',
        variant: 'destructive',
      });
    }
  };

  // Adicionar a função auxiliar para verificar se a meta está concluída
  const isConcluida = (meta: Meta): boolean => {
    if (meta.concluida !== undefined) return meta.concluida;
    return parseFloat(String(meta.valorArrecadado)) >= parseFloat(String(meta.valorNecessario));
  };

  const handleEditarMeta = (meta: Meta) => {
    if (meta.id) {
      setEditandoMeta(meta.id);
      setNovaMeta({
        descricao: meta.descricao,
        valorNecessario: parseFloat(String(meta.valorNecessario)),
        valorArrecadado: parseFloat(String(meta.valorArrecadado)),
        dataLimite: meta.dataLimite.split('T')[0]
      });
      setMostrarFormMeta(true);
    }
  };
  
  const handleExcluirMeta = async (id: number) => {
    if (!confirm('Tem certeza que deseja excluir esta meta?')) {
      return;
    }

    try {
      const token = localStorage.getItem('authToken');
      await axios.delete(`${API_URL}/financeiro/metas/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Recarregar metas
      carregarMetas();
      
      toast({
        title: 'Sucesso',
        description: 'Meta excluída com sucesso',
      });
    } catch (error) {
      console.error('Erro ao excluir meta:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível excluir a meta',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="container mx-auto py-4 px-2 max-w-8xl">
      <h1 className="text-lg font-bold mb-3">Controle Financeiro da Sala de Descanso</h1>
      
      {/* Resumo financeiro */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-3">
        <div className="bg-white p-2 rounded-lg shadow">
          <h2 className="text-sm font-semibold mb-1">Saldo Total</h2>
          <p className={`text-base font-bold ${resumo.saldoTotal >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            R$ {resumo.saldoTotal.toFixed(2)}
          </p>
        </div>
        <div className="bg-white p-2 rounded-lg shadow">
          <h2 className="text-sm font-semibold mb-1">Total de Entradas</h2>
          <p className="text-base font-bold text-green-600">
            R$ {resumo.totalEntradas.toFixed(2)}
          </p>
        </div>
        <div className="bg-white p-2 rounded-lg shadow">
          <h2 className="text-sm font-semibold mb-1">Total de Saídas</h2>
          <p className="text-base font-bold text-red-600">
            R$ {resumo.totalSaidas.toFixed(2)}
          </p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        <div className="md:col-span-1">
          {/* Metas financeiras */}
          <div className="bg-white p-3 rounded-lg shadow mb-3">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-sm font-semibold">Metas Financeiras</h2>
              <div className="flex space-x-1">
                <button
                  onClick={atualizarProgressoMetas}
                  className="px-1.5 py-0.5 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
                >
                  Atualizar
                </button>
                <button
                  onClick={() => {
                    if (!mostrarFormMeta) {
                      setEditandoMeta(null);
                      setNovaMeta({
                        descricao: '',
                        valorNecessario: 0,
                        valorArrecadado: 0,
                        dataLimite: new Date().toISOString().split('T')[0]
                      });
                    }
                    setMostrarFormMeta(!mostrarFormMeta);
                  }}
                  className="px-1.5 py-0.5 bg-indigo-600 text-white text-xs rounded hover:bg-indigo-700"
                >
                  {mostrarFormMeta ? 'Cancelar' : 'Nova'}
                </button>
              </div>
            </div>
            
            {mostrarFormMeta && (
              <div className="mb-2 p-2 border rounded bg-gray-50 text-xs">
                <h3 className="text-xs font-medium mb-1">
                  {editandoMeta ? 'Editar Meta' : 'Adicionar Nova Meta'}
                </h3>
                <form onSubmit={handleSubmitMeta} className="space-y-1">
                  <div className="grid grid-cols-1 gap-1">
                    <div>
                      <input
                        type="text"
                        id="descricao"
                        name="descricao"
                        placeholder="Descrição da meta"
                        value={novaMeta.descricao}
                        onChange={handleMetaChange}
                        className="w-full rounded border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-xs py-1"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-1">
                      <input
                        type="number"
                        id="valorNecessario"
                        name="valorNecessario"
                        placeholder="Valor necessário (R$)"
                        value={novaMeta.valorNecessario || ''}
                        onChange={handleMetaChange}
                        className="w-full rounded border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-xs py-1"
                        min="0"
                        step="0.01"
                        required
                      />
                      <input
                        type="date"
                        id="dataLimite"
                        name="dataLimite"
                        value={novaMeta.dataLimite}
                        onChange={handleMetaChange}
                        className="w-full rounded border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-xs py-1"
                        required
                      />
                    </div>
                    <div className="flex justify-end space-x-1">
                      {editandoMeta && (
                        <button
                          type="button"
                          onClick={() => {
                            setEditandoMeta(null);
                            setNovaMeta({
                              descricao: '',
                              valorNecessario: 0,
                              valorArrecadado: 0,
                              dataLimite: new Date().toISOString().split('T')[0]
                            });
                          }}
                          className="px-1.5 py-0.5 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 text-xs"
                        >
                          Cancelar
                        </button>
                      )}
                      <button
                        type="submit"
                        className="px-1.5 py-0.5 bg-indigo-600 text-white rounded hover:bg-indigo-700 text-xs"
                      >
                        {editandoMeta ? 'Salvar' : 'Adicionar'}
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            )}
            
            {carregandoMetas ? (
              <div className="flex justify-center py-2">
                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-indigo-500"></div>
              </div>
            ) : metas.length === 0 ? (
              <div className="text-center py-2 text-gray-500 text-xs">
                Nenhuma meta financeira registrada.
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-1.5 max-h-[350px] overflow-y-auto pr-1">
                {metas
                  .sort((a, b) => {
                    // Primeiro, ordenar por status (não concluídas primeiro)
                    const aCompleted = isConcluida(a);
                    const bCompleted = isConcluida(b);
                    if (aCompleted !== bCompleted) {
                      return aCompleted ? 1 : -1;
                    }
                    // Depois, ordenar por data limite
                    return new Date(a.dataLimite).getTime() - new Date(b.dataLimite).getTime();
                  })
                  .map((meta) => (
                    <div 
                      key={meta.id} 
                      className={`border rounded p-1.5 ${isConcluida(meta) ? 'bg-green-50 border-green-200' : ''}`}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center">
                            <h3 className="font-medium text-xs">{meta.descricao}</h3>
                            {isConcluida(meta) && (
                              <span className="ml-1 px-1 py-0 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                                Concluída
                              </span>
                            )}
                          </div>
                          <div className="mt-0.5 flex flex-wrap text-xs text-gray-600 gap-1">
                            <span>Meta: R$ {parseFloat(String(meta.valorNecessario)).toFixed(2)}</span>
                            <span>•</span>
                            <span>Atual: R$ {parseFloat(String(meta.valorArrecadado)).toFixed(2)}</span>
                          </div>
                          <div className="mt-1">
                            <div className="w-full bg-gray-200 rounded-full h-1">
                              <div 
                                className={`h-1 rounded-full ${isConcluida(meta) ? 'bg-green-500' : 'bg-blue-600'}`} 
                                style={{ width: `${Math.min(100, (parseFloat(String(meta.valorArrecadado)) / parseFloat(String(meta.valorNecessario))) * 100)}%` }}
                              ></div>
                            </div>
                            <div className="flex justify-between mt-0.5 text-xs items-center">
                              <span className="text-[10px]">{Math.round((parseFloat(String(meta.valorArrecadado)) / parseFloat(String(meta.valorNecessario))) * 100)}%</span>
                              <div className="flex space-x-1">
                                {!isConcluida(meta) ? (
                                  <button
                                    onClick={() => handleConcluirMeta(meta.id)}
                                    className="text-indigo-600 hover:text-indigo-800 text-[10px]"
                                  >
                                    Concluir
                                  </button>
                                ) : (
                                  <button
                                    onClick={() => handleDesmarcarMeta(meta.id, meta)}
                                    className="text-amber-600 hover:text-amber-800 text-[10px]"
                                  >
                                    Desmarcar
                                  </button>
                                )}
                                <button
                                  onClick={() => handleEditarMeta(meta)}
                                  className="text-blue-600 hover:text-blue-800 text-[10px]"
                                >
                                  Editar
                                </button>
                                <button
                                  onClick={() => meta.id && handleExcluirMeta(meta.id)}
                                  className="text-red-600 hover:text-red-800 text-[10px]"
                                >
                                  Excluir
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
          
          {/* Geração de relatório */}
          <div className="bg-white p-3 rounded-lg shadow mb-3">
            <h2 className="text-sm font-semibold mb-2">Gerar Relatório Mensal</h2>
            <div className="flex flex-wrap items-end gap-2">
              <div>
                <label htmlFor="mes" className="block text-xs font-medium text-gray-700 mb-0.5">
                  Mês
                </label>
                <select
                  id="mes"
                  value={mes}
                  onChange={(e) => setMes(e.target.value)}
                  className="rounded border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-xs py-1"
                >
                  <option value="01">Janeiro</option>
                  <option value="02">Fevereiro</option>
                  <option value="03">Março</option>
                  <option value="04">Abril</option>
                  <option value="05">Maio</option>
                  <option value="06">Junho</option>
                  <option value="07">Julho</option>
                  <option value="08">Agosto</option>
                  <option value="09">Setembro</option>
                  <option value="10">Outubro</option>
                  <option value="11">Novembro</option>
                  <option value="12">Dezembro</option>
                </select>
              </div>
              <div>
                <label htmlFor="ano" className="block text-xs font-medium text-gray-700 mb-0.5">
                  Ano
                </label>
                <select
                  id="ano"
                  value={ano}
                  onChange={(e) => setAno(e.target.value)}
                  className="rounded border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-xs py-1"
                >
                  {Array.from({ length: 5 }, (_, i) => {
                    const year = new Date().getFullYear() - 2 + i;
                    return (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    );
                  })}
                </select>
              </div>
              <button
                onClick={gerarRelatorioMensal}
                className="px-2 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-xs"
              >
                Gerar PDF
              </button>
            </div>
          </div>
        </div>
        
        <div className="md:col-span-1">
          {/* Formulário */}
          <div className="bg-white p-3 rounded-lg shadow mb-3">
            <h2 className="text-sm font-semibold mb-2">
              {editando ? 'Editar Transação' : 'Adicionar Transação'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-2">
              <div>
                <label htmlFor="descricao" className="block text-xs font-medium text-gray-700 mb-0.5">
                  Descrição
                </label>
                <input
                  type="text"
                  id="descricao"
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                  className="w-full rounded border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-xs py-1"
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label htmlFor="valor" className="block text-xs font-medium text-gray-700 mb-0.5">
                    Valor (R$)
                  </label>
                  <input
                    type="text"
                    id="valor"
                    value={valor}
                    onChange={(e) => setValor(e.target.value)}
                    className="w-full rounded border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-xs py-1"
                    pattern="^\d*[0-9](|.\d*[0-9]|,\d*[0-9])?$"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="tipo" className="block text-xs font-medium text-gray-700 mb-0.5">
                    Tipo
                  </label>
                  <select
                    id="tipo"
                    value={tipo}
                    onChange={(e) => setTipo(e.target.value as 'entrada' | 'saida')}
                    className="w-full rounded border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-xs py-1"
                    required
                  >
                    <option value="entrada">Entrada</option>
                    <option value="saida">Saída</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label htmlFor="data" className="block text-xs font-medium text-gray-700 mb-0.5">
                  Data
                </label>
                <input
                  type="date"
                  id="data"
                  value={data}
                  onChange={(e) => setData(e.target.value)}
                  className="w-full rounded border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-xs py-1"
                  required
                />
              </div>
              
              <div className="flex justify-end space-x-2 pt-1">
                {editando && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditando(null);
                      setDescricao('');
                      setValor('');
                      setTipo('entrada');
                      setData('');
                    }}
                    className="px-2 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 text-xs"
                  >
                    Cancelar
                  </button>
                )}
                <button
                  type="submit"
                  className="px-2 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700 text-xs"
                >
                  {editando ? 'Atualizar' : 'Adicionar'}
                </button>
              </div>
            </form>
          </div>
          
          {/* Lista de transações */}
          <div className="bg-white p-3 rounded-lg shadow">
            <h2 className="text-sm font-semibold mb-2">Histórico de Transações</h2>
            
            {carregando ? (
              <div className="flex justify-center py-3">
                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-indigo-500"></div>
              </div>
            ) : transacoes.length === 0 ? (
              <p className="text-gray-500 text-center py-2 text-xs">Nenhuma transação registrada.</p>
            ) : (
              <div className="overflow-x-auto max-h-[350px] overflow-y-auto">
                <table className="min-w-full divide-y divide-gray-200 text-xs">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-2 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Data
                      </th>
                      <th className="px-2 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Descrição
                      </th>
                      <th className="px-2 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Valor
                      </th>
                      <th className="px-2 py-1 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Ações
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {transacoes.map((transacao) => (
                      <tr key={transacao.id}>
                        <td className="px-2 py-1 whitespace-nowrap text-xs text-gray-500">
                          {format(new Date(transacao.data), 'dd/MM/yyyy', { locale: ptBR })}
                        </td>
                        <td className="px-2 py-1 whitespace-nowrap text-xs text-gray-900">
                          {transacao.descricao}
                        </td>
                        <td className="px-2 py-1 whitespace-nowrap text-xs">
                          <span className={`${transacao.tipo === 'entrada' ? 'text-green-600' : 'text-red-600'} flex items-center`}>
                            <span className={`w-1.5 h-1.5 rounded-full mr-1 ${transacao.tipo === 'entrada' ? 'bg-green-500' : 'bg-red-500'}`}></span>
                            R$ {parseFloat(String(transacao.valor)).toFixed(2)}
                          </span>
                        </td>
                        <td className="px-2 py-1 whitespace-nowrap text-right text-xs font-medium">
                          <button
                            onClick={() => handleEditar(transacao)}
                            className="text-indigo-600 hover:text-indigo-900 mr-2"
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => handleExcluir(transacao.id)}
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
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 