'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Calendar, ChevronRight, ExternalLink, Info } from 'lucide-react';
import { Aviso, getAvisos, getCalendarioUFC, EventoCalendario } from '@/services/api';
import { Badge } from '@/components/ui/badge';
import EventosSidebar from '@/components/EventosSidebar';

interface EventoFormatado {
  id: number;
  titulo: string;
  descricao?: string;
  data: string;
  dataObj: Date;
  status: 'passado' | 'ativo' | 'futuro';
  link?: string;
  passado?: boolean;
}

export default function EventosPage() {
  const [eventos, setEventos] = useState<EventoFormatado[]>([]);
  const [eventosCombinados, setEventosCombinados] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [filtroTipo, setFiltroTipo] = useState<'todos' | 'ca' | 'ufc'>('todos');
  const [filtroTempo, setFiltroTempo] = useState<'todos' | 'atual'>('atual');

  useEffect(() => {
    const fetchEventos = async () => {
      try {
        setLoading(true);
        
        // Buscar dados em paralelo para melhor performance
        const [avisosData, calendarioUFC] = await Promise.all([
          getAvisos(),
          getCalendarioUFC()
        ]);
        
        // Converter avisos para eventos
        const hoje = new Date();
        hoje.setHours(0, 0, 0, 0); // Normaliza para o início do dia
        
        const eventosFormatados = avisosData
          .filter(aviso => aviso.titulo && aviso.data_inicio)
          .map(aviso => {
            // Formatar a data para exibição
            const dataInicio = new Date(aviso.data_inicio);
            const dataFormatada = dataInicio.toLocaleDateString('pt-BR', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric'
            });
            
            // Determinar o status do evento
            let status: 'passado' | 'ativo' | 'futuro';
            const passado = dataInicio < hoje;
            
            if (dataInicio > hoje) {
              status = 'futuro';
            } else if (aviso.data_fim) {
              const dataFim = new Date(aviso.data_fim);
              status = dataFim >= hoje ? 'ativo' : 'passado';
            } else {
              status = 'ativo';
            }
            
            return {
              id: aviso.id,
              titulo: aviso.titulo,
              descricao: aviso.descricao,
              data: dataFormatada,
              dataObj: dataInicio,
              status,
              passado,
              link: aviso.link,
              tipo: 'ca'
            };
          });
        
        setEventos(eventosFormatados);
        
        // Combinar eventos do CA com o calendário da UFC
        const todosCombinados = [
          ...eventosFormatados, 
          ...calendarioUFC.map(evento => ({
            ...evento,
            passado: evento.dataObj < hoje
          }))
        ].sort((a, b) => a.dataObj.getTime() - b.dataObj.getTime());
          
        setEventosCombinados(todosCombinados);
      } catch (err) {
        console.error('Erro ao buscar eventos:', err);
        setError(true);
        // Tenta ainda buscar só o calendário da UFC em caso de erro
        try {
          const hoje = new Date();
          hoje.setHours(0, 0, 0, 0);
          const calendarioUFC = await getCalendarioUFC();
          setEventosCombinados(
            calendarioUFC
              .map(evento => ({
                ...evento,
                passado: evento.dataObj < hoje
              }))
              .sort((a, b) => a.dataObj.getTime() - b.dataObj.getTime())
          );
        } catch (ufcError) {
          console.error('Erro ao buscar calendário da UFC:', ufcError);
          setEventosCombinados([]);
        }
      } finally {
        setLoading(false);
      }
    };
    
    fetchEventos();
  }, []);

  // Filtrar por tipo de evento (CA, UFC ou todos)
  // E filtrar por tempo (todos ou apenas a partir de hoje)
  const eventosFiltrados = eventosCombinados.filter(evento => {
    // Primeiro aplica filtro de tipo
    const passaFiltroTipo = filtroTipo === 'todos' || evento.tipo === filtroTipo;
    
    // Depois aplica filtro de tempo
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0); // Normaliza para o início do dia
    const passaFiltroTempo = filtroTempo === 'todos' || new Date(evento.dataObj) >= hoje;
    
    return passaFiltroTipo && passaFiltroTempo;
  });

  // Agrupar eventos por mês
  const eventosAgrupados = eventosFiltrados.reduce((grupos, evento) => {
    const mes = evento.dataObj.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
    if (!grupos[mes]) {
      grupos[mes] = [];
    }
    grupos[mes].push(evento);
    return grupos;
  }, {} as Record<string, any[]>);

  // Define a interface para os eventos agrupados
  interface EventoAgrupado {
    id: number | string;
    titulo: string;
    descricao?: string;
    data: string;
    dataObj: Date;
    status: 'passado' | 'ativo' | 'futuro';
    passado?: boolean;
    link?: string;
    tipo: 'ca' | 'ufc';
  }

  return (
    <>
      <EventosSidebar />
      <main className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold mb-2">Calendário de Eventos</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Confira os eventos e datas importantes do Centro Acadêmico e da UFC.
          </p>
        </div>

        <div className="flex flex-col md:flex-row justify-center items-center gap-4 mb-8">
          {/* Filtro por tipo (CA, UFC, Todos) */}
          <div className="inline-flex rounded-md shadow-sm" role="group">
            <button
              type="button"
              onClick={() => setFiltroTipo('todos')}
              className={`px-4 py-2 text-sm font-medium rounded-l-lg ${
                filtroTipo === 'todos'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              } border border-gray-200`}
            >
              Todos
            </button>
            <button
              type="button"
              onClick={() => setFiltroTipo('ca')}
              className={`px-4 py-2 text-sm font-medium ${
                filtroTipo === 'ca'
                  ? 'bg-orange-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              } border-t border-b border-gray-200`}
            >
              Eventos do CA
            </button>
            <button
              type="button"
              onClick={() => setFiltroTipo('ufc')}
              className={`px-4 py-2 text-sm font-medium rounded-r-lg ${
                filtroTipo === 'ufc'
                  ? 'bg-green-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              } border border-gray-200`}
            >
              Calendário UFC
            </button>
          </div>

          {/* Filtro por tempo (Atual, Todos) */}
          <div className="inline-flex rounded-md shadow-sm" role="group">
            <button
              type="button"
              onClick={() => setFiltroTempo('atual')}
              className={`px-4 py-2 text-sm font-medium rounded-l-lg ${
                filtroTempo === 'atual'
                  ? 'bg-purple-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              } border border-gray-200`}
            >
              A partir de hoje
            </button>
            <button
              type="button"
              onClick={() => setFiltroTempo('todos')}
              className={`px-4 py-2 text-sm font-medium rounded-r-lg ${
                filtroTempo === 'todos'
                  ? 'bg-purple-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              } border border-gray-200`}
            >
              Todos os eventos
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-10">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : eventosFiltrados.length === 0 ? (
          <div className="text-center py-10 bg-gray-50 rounded-lg">
            <p className="text-gray-500">Nenhum evento encontrado para o filtro selecionado.</p>
          </div>
        ) : (
          <div className="space-y-10">
            {Object.keys(eventosAgrupados).map(mes => (
              <div key={mes} className="bg-white rounded-lg shadow overflow-hidden">
                <div className="bg-gray-100 p-4 font-bold text-lg capitalize">
                  {mes}
                </div>
                <ul className="divide-y divide-gray-200">
                  {eventosAgrupados[mes].map((evento: EventoAgrupado) => (
                    <li 
                      key={`${evento.tipo}-${evento.id}`} 
                      className={`p-4 hover:bg-gray-50 ${evento.passado ? 'opacity-70' : ''}`}
                    >
                      <div className="flex items-start gap-4">
                        <div className="min-w-20 text-center">
                          <div className={`font-bold ${evento.passado ? 'text-gray-500' : ''}`}>
                            {evento.dataObj.getDate().toString().padStart(2, '0')}
                          </div>
                          <div className="text-xs text-gray-500">
                            {evento.dataObj.toLocaleDateString('pt-BR', { weekday: 'short' })}
                          </div>
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className={`font-medium text-lg ${evento.passado ? 'text-gray-500' : ''}`}>
                                {evento.titulo}
                              </h3>
                              <div className="text-sm text-gray-600">{evento.data}</div>
                              
                              {evento.descricao && (
                                <p className="mt-1 text-sm text-gray-600 line-clamp-2">
                                  {evento.descricao}
                                </p>
                              )}
                            </div>
                            
                            <Badge className={`
                              ${evento.passado 
                                ? 'bg-gray-100 text-gray-600 border-gray-200'
                                : evento.tipo === 'ca' 
                                  ? 'bg-orange-100 text-orange-800 border-orange-200' 
                                  : 'bg-green-100 text-green-800 border-green-200'
                              } border`}
                            >
                              {evento.tipo === 'ca' ? 'Evento CA' : 'UFC'}
                            </Badge>
                          </div>
                          
                          {evento.tipo === 'ca' && (
                            <div className="mt-2">
                              <Link 
                                href={evento.link || `/eventos/${evento.id}`}
                                className={`text-sm inline-flex items-center ${
                                  evento.passado 
                                    ? 'text-gray-500 hover:text-gray-700' 
                                    : 'text-blue-600 hover:text-blue-800'
                                }`}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                Detalhes <ChevronRight className="h-4 w-4" />
                              </Link>
                            </div>
                          )}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
        
        <div className="mt-10 bg-blue-50 p-6 rounded-lg">
          <div className="flex items-start gap-3">
            <Info className="h-6 w-6 text-blue-500 flex-shrink-0 mt-1" />
            <div>
              <h2 className="text-xl font-bold mb-1">Calendário UFC</h2>
              <p className="mb-4 text-sm">
                O calendário acadêmico oficial da UFC está disponível no site da universidade. 
                Para informações mais detalhadas e atualizações, consulte o calendário oficial.
              </p>
              <a 
                href="https://www.ufc.br/calendario-universitario"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 font-medium"
              >
                Calendário Universitário Oficial
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </main>
    </>
  );
} 