'use client';

import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import axios from 'axios';

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
};

type ItemCompra = {
  id: number;
  nome: string;
  descricao: string;
  prioridade: number;
  valorEstimado: number;
  tipo: 'ca' | 'descanso';
};

type DadosTransparencia = {
  ca: {
    transacoes: Transacao[];
    resumo: {
      saldoTotal: number;
      totalEntradas: number;
      totalSaidas: number;
    };
  };
  descanso: {
    transacoes: Transacao[];
    resumo: {
      saldoTotal: number;
      totalEntradas: number;
      totalSaidas: number;
    };
  };
  metas: Meta[];
  itensCompra: ItemCompra[];
};

export default function TransparenciaFinanceiraPage() {
  const [dados, setDados] = useState<DadosTransparencia | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [tipoSelecionado, setTipoSelecionado] = useState<'ca' | 'descanso'>('ca');
  const [ano, setAno] = useState(new Date().getFullYear().toString());
  const [mes, setMes] = useState((new Date().getMonth() + 1).toString().padStart(2, '0'));
  const [gerandoPDF, setGerandoPDF] = useState(false);
  
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

  const carregarDados = async () => {
    setCarregando(true);
    try {
      const response = await axios.get<DadosTransparencia>(
        `${API_URL}/financeiro/transparencia/completa`
      );
      setDados(response.data);
    } catch (error) {
      console.error('Erro ao carregar dados de transparência:', error);
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    carregarDados();
  }, []);

  const gerarRelatorioMensal = async () => {
    setGerandoPDF(true);
    try {
      const endpoint = tipoSelecionado === 'ca' 
        ? `${API_URL}/financeiro/ca/relatorio/${mes}/${ano}`
        : `${API_URL}/financeiro/descanso/relatorio/${mes}/${ano}`;
      
      const response = await axios.get(endpoint, {
        responseType: 'blob',
      });
      
      // Criar link para download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `relatorio_${tipoSelecionado}_${mes}_${ano}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      alert('Relatório gerado com sucesso!');
    } catch (error) {
      console.error('Erro ao gerar relatório:', error);
      alert('Não foi possível gerar o relatório');
    } finally {
      setGerandoPDF(false);
    }
  };

  // Função auxiliar para verificar se uma meta está concluída
  const isConcluida = (meta: Meta): boolean => {
    return parseFloat(String(meta.valorArrecadado)) >= parseFloat(String(meta.valorNecessario));
  };

  if (carregando) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (!dados) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-700">Dados não disponíveis</h2>
          <p className="text-gray-500 mt-2">
            Não foi possível carregar os dados de transparência financeira.
          </p>
        </div>
      </div>
    );
  }

  const dadosAtivos = tipoSelecionado === 'ca' ? dados.ca : dados.descanso;
  const metasAtivas = dados.metas.filter(meta => meta.tipo === tipoSelecionado);
  const metasAtivaNaoConcluidas = metasAtivas.filter(meta => !isConcluida(meta));
  const metasAtivaConcluidas = metasAtivas.filter(meta => isConcluida(meta));

  return (
    <div className="container mx-auto py-4 px-4 max-w-6xl">
      <h1 className="text-2xl font-bold mb-4 text-center">Transparência Financeira</h1>
      
      {/* Seletor de tipo */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <h2 className="text-lg font-semibold mb-3">Selecione o tipo de dados</h2>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setTipoSelecionado('ca')}
            className={`px-4 py-2 rounded-md ${
              tipoSelecionado === 'ca'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Centro Acadêmico
          </button>
          <button
            onClick={() => setTipoSelecionado('descanso')}
            className={`px-4 py-2 rounded-md ${
              tipoSelecionado === 'descanso'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Sala de Descanso
          </button>
        </div>
      </div>
      
      {/* Resumo financeiro */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <h2 className="text-lg font-semibold mb-3">
          Resumo Financeiro - {tipoSelecionado === 'ca' ? 'Centro Acadêmico' : 'Sala de Descanso'}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-50 p-3 rounded-lg">
            <h3 className="text-sm font-semibold mb-1">Saldo Total</h3>
            <p className={`text-xl font-bold ${dadosAtivos.resumo.saldoTotal >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              R$ {dadosAtivos.resumo.saldoTotal.toFixed(2)}
            </p>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg">
            <h3 className="text-sm font-semibold mb-1">Total de Entradas</h3>
            <p className="text-xl font-bold text-green-600">
              R$ {dadosAtivos.resumo.totalEntradas.toFixed(2)}
            </p>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg">
            <h3 className="text-sm font-semibold mb-1">Total de Saídas</h3>
            <p className="text-xl font-bold text-red-600">
              R$ {dadosAtivos.resumo.totalSaidas.toFixed(2)}
            </p>
          </div>
        </div>
      </div>
      
      {/* Metas financeiras */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-md p-4">
          <h2 className="text-lg font-semibold mb-3">Metas em Andamento</h2>
          {metasAtivaNaoConcluidas.length === 0 ? (
            <p className="text-gray-500 text-center py-3">Nenhuma meta em andamento.</p>
          ) : (
            <div className="space-y-3">
              {metasAtivaNaoConcluidas.map((meta) => (
                <div key={meta.id} className="border rounded-lg p-3">
                  <h3 className="font-semibold">{meta.descricao}</h3>
                  <div className="mt-1 flex flex-wrap text-sm text-gray-600 gap-2">
                    <span>Meta: R$ {parseFloat(String(meta.valorNecessario)).toFixed(2)}</span>
                    <span>•</span>
                    <span>Arrecadado: R$ {parseFloat(String(meta.valorArrecadado)).toFixed(2)}</span>
                    <span>•</span>
                    <span>Prazo: {format(new Date(meta.dataLimite), 'dd/MM/yyyy', { locale: ptBR })}</span>
                  </div>
                  <div className="mt-2">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="h-2 rounded-full bg-blue-600"
                        style={{ width: `${Math.min(100, (parseFloat(String(meta.valorArrecadado)) / parseFloat(String(meta.valorNecessario))) * 100)}%` }}
                      ></div>
                    </div>
                    <div className="text-right mt-1 text-sm">
                      {Math.round((parseFloat(String(meta.valorArrecadado)) / parseFloat(String(meta.valorNecessario))) * 100)}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-4">
          <h2 className="text-lg font-semibold mb-3">Metas Concluídas</h2>
          {metasAtivaConcluidas.length === 0 ? (
            <p className="text-gray-500 text-center py-3">Nenhuma meta concluída.</p>
          ) : (
            <div className="space-y-3">
              {metasAtivaConcluidas.map((meta) => (
                <div key={meta.id} className="border rounded-lg p-3 bg-green-50 border-green-200">
                  <div className="flex items-center">
                    <h3 className="font-semibold">{meta.descricao}</h3>
                    <span className="ml-2 px-2 py-0.5 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                      Concluída
                    </span>
                  </div>
                  <div className="mt-1 flex flex-wrap text-sm text-gray-600 gap-2">
                    <span>Meta: R$ {parseFloat(String(meta.valorNecessario)).toFixed(2)}</span>
                    <span>•</span>
                    <span>Arrecadado: R$ {parseFloat(String(meta.valorArrecadado)).toFixed(2)}</span>
                  </div>
                  <div className="mt-2">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="h-2 rounded-full bg-green-500 w-full"></div>
                    </div>
                    <div className="text-right mt-1 text-sm">100%</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      {/* Gerar relatório mensal */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <h2 className="text-lg font-semibold mb-3">Gerar Relatório Mensal</h2>
        <div className="flex flex-wrap items-end gap-3">
          <div>
            <label htmlFor="mes" className="block text-sm font-medium text-gray-700 mb-1">
              Mês
            </label>
            <select
              id="mes"
              value={mes}
              onChange={(e) => setMes(e.target.value)}
              className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
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
            <label htmlFor="ano" className="block text-sm font-medium text-gray-700 mb-1">
              Ano
            </label>
            <select
              id="ano"
              value={ano}
              onChange={(e) => setAno(e.target.value)}
              className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
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
            disabled={gerandoPDF}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400"
          >
            {gerandoPDF ? 'Gerando...' : 'Gerar PDF'}
          </button>
        </div>
      </div>
      
      {/* Histórico de Transações */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <h2 className="text-lg font-semibold mb-3">Histórico de Transações</h2>
        {dadosAtivos.transacoes.length === 0 ? (
          <p className="text-gray-500 text-center py-3">Nenhuma transação registrada.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Data
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Descrição
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Valor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tipo
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {dadosAtivos.transacoes.map((transacao) => (
                  <tr key={transacao.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {format(new Date(transacao.data), 'dd/MM/yyyy', { locale: ptBR })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {transacao.descricao}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={transacao.tipo === 'entrada' ? 'text-green-600' : 'text-red-600'}>
                        R$ {parseFloat(String(transacao.valor)).toFixed(2)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          transacao.tipo === 'entrada'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {transacao.tipo === 'entrada' ? 'Entrada' : 'Saída'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      
      <div className="text-center text-gray-500 text-sm mb-4">
        Esta página é atualizada regularmente para garantir a transparência na gestão financeira.
      </div>
    </div>
  );
} 