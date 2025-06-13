'use client';

import { useState, useEffect } from 'react';
import { Aviso, getAvisos, deleteAviso } from '@/services/api';
import Link from 'next/link';

export default function AvisoTable() {
  const [avisos, setAvisos] = useState<Aviso[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAvisos = async () => {
    setLoading(true);
    try {
      const data = await getAvisos();
      setAvisos(data);
      setError(null);
    } catch (err) {
      setError('Erro ao carregar avisos');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAvisos();
  }, []);

  const handleDelete = async (id: number) => {
    if (!window.confirm('Tem certeza que deseja excluir este aviso?')) {
      return;
    }
    
    try {
      await deleteAviso(id);
      setAvisos(avisos.filter(aviso => aviso.id !== id));
    } catch (err) {
      console.error('Erro ao excluir aviso:', err);
      alert('Erro ao excluir aviso');
    }
  };

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
      return dateString.split('T')[0]; // Fallback para formato YYYY-MM-DD
    }
  };

  const isAvisoAtivo = (aviso: Aviso) => {
    const hoje = new Date();
    const dataInicio = new Date(aviso.data_inicio);
    
    if (dataInicio > hoje) return false;
    
    if (aviso.data_fim) {
      const dataFim = new Date(aviso.data_fim);
      return dataFim >= hoje;
    }
    
    return true;
  };

  if (loading) {
    return (
      <div className="p-4 flex justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-red-600">
        <p>{error}</p>
        <button 
          onClick={fetchAvisos}
          className="mt-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded"
        >
          Tentar novamente
        </button>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium">Avisos</h2>
        <Link href="/dashboard/avisos/novo"
          className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded transition-colors"
        >
          Novo Aviso
        </Link>
      </div>
      
      {avisos.length === 0 ? (
        <div className="p-4 text-center text-gray-500">
          Nenhum aviso cadastrado.
        </div>
      ) : (
        <>
          {/* Versão Desktop */}
          <div className="hidden md:block overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-2 px-4 border-b text-left">Título</th>
                  <th className="py-2 px-4 border-b text-left">Data Início</th>
                  <th className="py-2 px-4 border-b text-left">Data Fim</th>
                  <th className="py-2 px-4 border-b text-left">Status</th>
                  <th className="py-2 px-4 border-b text-center">Ações</th>
                </tr>
              </thead>
              <tbody>
                {avisos.map(aviso => (
                  <tr key={aviso.id} className="hover:bg-gray-50">
                    <td className="py-2 px-4 border-b">{aviso.titulo}</td>
                    <td className="py-2 px-4 border-b">{formatDate(aviso.data_inicio)}</td>
                    <td className="py-2 px-4 border-b">{formatDate(aviso.data_fim)}</td>
                    <td className="py-2 px-4 border-b">
                      <span className={`px-2 py-1 rounded text-xs ${
                        isAvisoAtivo(aviso) 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {isAvisoAtivo(aviso) ? 'Ativo' : 'Inativo'}
                      </span>
                    </td>
                    <td className="py-2 px-4 border-b text-center">
                      <div className="flex justify-center space-x-2">
                        <Link href={`/dashboard/avisos/editar/${aviso.id}`}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          Editar
                        </Link>
                        <button 
                          onClick={() => handleDelete(aviso.id)}
                          className="text-red-600 hover:text-red-800"
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

          {/* Versão Mobile */}
          <div className="md:hidden space-y-4">
            {avisos.map(aviso => (
              <div key={aviso.id} className="bg-white rounded-lg shadow p-4 space-y-3">
                <div className="flex justify-between items-start">
                  <h3 className="font-medium text-gray-900">{aviso.titulo}</h3>
                  <span className={`px-2 py-1 rounded text-xs ${
                    isAvisoAtivo(aviso) 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {isAvisoAtivo(aviso) ? 'Ativo' : 'Inativo'}
                  </span>
                </div>
                
                <div className="space-y-1 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>Data Início:</span>
                    <span>{formatDate(aviso.data_inicio)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Data Fim:</span>
                    <span>{formatDate(aviso.data_fim)}</span>
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-2">
                  <Link href={`/dashboard/avisos/editar/${aviso.id}`}
                    className="bg-blue-50 text-blue-600 px-3 py-1.5 rounded-md text-sm font-medium hover:bg-blue-100"
                  >
                    Editar
                  </Link>
                  <button 
                    onClick={() => handleDelete(aviso.id)}
                    className="bg-red-50 text-red-600 px-3 py-1.5 rounded-md text-sm font-medium hover:bg-red-100"
                  >
                    Excluir
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
} 