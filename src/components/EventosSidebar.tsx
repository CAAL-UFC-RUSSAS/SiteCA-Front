'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { CalendarDays, ExternalLink } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { getAvisosAtivos, getCalendarioUFC } from '@/services/api';

interface EventoFormatado {
  id: number | string;
  titulo: string;
  data: string;
  dataObj: Date;
  link?: string;
  tipo: 'ca' | 'ufc';
  passado: boolean;
}

export default function EventosSidebar() {
  const [minimizado, setMinimizado] = useState(false);
  const [eventos, setEventos] = useState<EventoFormatado[]>([]);
  const [loading, setLoading] = useState(true);
  const [mostrarUFC, setMostrarUFC] = useState(true);

  useEffect(() => {
    const fetchEventos = async () => {
      try {
        setLoading(true);
        
        const hoje = new Date();
        hoje.setHours(0, 0, 0, 0);
        
        // Buscar dados em paralelo para melhor performance
        const [avisosAtivos, calendarioUFC] = await Promise.all([
          getAvisosAtivos(),
          getCalendarioUFC()
        ]);
        
        // Transformar avisos em eventos formatados
        const eventosFormatados = avisosAtivos
          .filter(aviso => aviso.titulo && aviso.data_inicio) // Filtrar avisos válidos
          .map(aviso => {
            // Formatar a data para exibição
            const dataObj = new Date(aviso.data_inicio);
            const dataFormatada = dataObj.toLocaleDateString('pt-BR', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric'
            });
            
            return {
              id: aviso.id,
              titulo: aviso.titulo,
              data: dataFormatada,
              dataObj,
              link: aviso.link,
              tipo: 'ca' as const,
              passado: dataObj < hoje
            };
          });
        
        // Combinar com eventos do calendário UFC
        const todosCombinados = [...eventosFormatados, ...calendarioUFC.map(evento => ({
          ...evento,
          passado: evento.dataObj < hoje
        }))]
          // Filtra eventos: futuros e até 7 dias atrás
          .filter(evento => {
            const seteDiasAtras = new Date();
            seteDiasAtras.setDate(hoje.getDate() - 3);
            return evento.dataObj >= seteDiasAtras;
          })
          // Ordenar por data (mais próximos primeiro)
          .sort((a, b) => a.dataObj.getTime() - b.dataObj.getTime())
          // Limitar a 5 eventos para não sobrecarregar a sidebar
          .slice(0, 5);
        
        setEventos(todosCombinados);
      } catch (err) {
        console.error('Erro ao buscar eventos:', err);
        // Usar dados de fallback em caso de erro
        const hoje = new Date();
        try {
          // Mesmo em caso de erro, tenta buscar o calendário UFC
          const calendarioUFC = await getCalendarioUFC();
          setEventos([
            {
              id: 1,
              titulo: 'Semana Acadêmica',
              data: '15/05/2024',
              dataObj: new Date('2024-05-15'),
              link: '/eventos/1',
              tipo: 'ca',
              passado: new Date('2024-05-15') < hoje
            },
            ...calendarioUFC.slice(0, 3).map(evento => ({
              ...evento,
              passado: evento.dataObj < hoje
            }))
          ]);
        } catch {
          // Se mesmo o fallback falhar, usa dados mínimos
          setEventos([
            {
              id: 1,
              titulo: 'Semana Acadêmica',
              data: '15/05/2024',
              dataObj: new Date('2024-05-15'),
              link: '/eventos/1',
              tipo: 'ca',
              passado: new Date('2024-05-15') < hoje
            }
          ]);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchEventos();
  }, []);

  const toggleMinimizado = () => {
    setMinimizado(!minimizado);
  };

  const eventosFiltrados = mostrarUFC 
    ? eventos 
    : eventos.filter(evento => evento.tipo === 'ca');

  return (
    <div 
      className={`fixed lg:top-1/4 lg:right-0 z-40 transition-all duration-300 ease-in-out ${
        minimizado 
          ? 'transform translate-x-[calc(100%-40px)] right-[-40] top-1/6' 
          : 'transform translate-x-0 right-[0] top-1/6'
      }`}
    >
      {/* Botão para minimizar/expandir */}
      <button
        onClick={toggleMinimizado}
        className="absolute top-0 lg:left-10 left-2 z-50 p-2 -translate-x-full bg-blue-600 text-white rounded-l-md"
        aria-label={minimizado ? 'Expandir eventos' : 'Minimizar eventos'}
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="24" 
          height="24" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
          className={`transition-transform ${minimizado ? 'rotate-180' : ''}`}
        >
          <polyline points="15 18 9 12 15 6"></polyline>
        </svg>
      </button>
      
      {/* Conteúdo do sidebar */}
      <div className="bg-white shadow-lg rounded-l-lg overflow-hidden w-72">
        <div className="p-4 bg-blue-600 text-white">
          <div className="flex items-center gap-2">
            <CalendarDays className="h-5 w-5" />
            <h3 className="font-bold">Calendário de Eventos</h3>
          </div>
        </div>
        
        <div className="border-b border-gray-200">
          <div className="flex text-sm">
            <button
              onClick={() => setMostrarUFC(true)}
              className={`flex-1 py-2 px-3 font-medium ${
                mostrarUFC ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'
              }`}
            >
              Todos
            </button>
            <button
              onClick={() => setMostrarUFC(false)}
              className={`flex-1 py-2 px-3 font-medium ${
                !mostrarUFC ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'
              }`}
            >
              Eventos CA
            </button>
          </div>
        </div>
        
        <div className="p-4">
          {loading ? (
            <div className="py-4 flex justify-center">
              <div className="animate-spin h-5 w-5 border-2 border-blue-600 rounded-full border-t-transparent"></div>
            </div>
          ) : eventosFiltrados.length === 0 ? (
            <p className="text-gray-500 text-sm">Nenhum evento encontrado.</p>
          ) : (
            <ul className="divide-y divide-gray-200">
              {eventosFiltrados.map(evento => (
                <li key={`${evento.tipo}-${evento.id}`} className="py-3 first:pt-0 last:pb-0">
                  <Link 
                    href={evento.tipo === 'ca' ? (evento.link || `/eventos/${evento.id}`) : '/eventos'}
                    className={`flex items-start gap-3 hover:bg-gray-50 rounded p-1 -mx-1 ${
                      evento.passado ? 'opacity-60' : ''
                    }`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <div className="min-w-10 text-center">
                      <div className={`font-bold text-lg ${evento.passado ? 'text-gray-500' : ''}`}>
                        {evento.dataObj.getDate().toString().padStart(2, '0')}
                      </div>
                      <div className="text-xs text-gray-500">
                        {evento.dataObj.toLocaleDateString('pt-BR', { month: 'short' })}
                      </div>
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <span className={`text-sm font-medium line-clamp-2 ${
                          evento.passado ? 'text-gray-500' : ''
                        }`}>
                          {evento.titulo}
                        </span>
                        <Badge className={`ml-1 ${
                          evento.passado 
                            ? 'bg-gray-100 text-gray-600 border-gray-200'
                            : evento.tipo === 'ca' 
                              ? 'bg-orange-100 text-orange-800 border-orange-200' 
                              : 'bg-green-100 text-green-800 border-green-200'
                          } border text-xs`}
                        >
                          {evento.tipo === 'ca' ? 'CA' : 'UFC'}
                        </Badge>
                      </div>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
          
          <div className="mt-4 flex justify-between items-center">
            <Link 
              href="/eventos" 
              className="text-xs text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
              target="_blank"
              rel="noopener noreferrer"
            >
              Ver calendário completo →
            </Link>
            
            <a 
              href="https://www.ufc.br/calendario-universitario"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-gray-500 hover:text-gray-700 flex items-center gap-1"
            >
              Calendário UFC <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
} 