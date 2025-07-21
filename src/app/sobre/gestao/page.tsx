'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Users, CalendarCheck, Trophy, FileText, ChevronLeft, Filter } from 'lucide-react';
import { getMembros, getGestoes, MembroGestao, getProjetos, ProjetoCampanha } from '@/services/api';



export default function GestaoPage() {
  // Estado para membros e filtros
  const [membrosEquipe, setMembrosEquipe] = useState<MembroGestao[]>([]);
  const [gestoes, setGestoes] = useState<string[]>([]);
  const [filtroGestao, setFiltroGestao] = useState('');
  const [filtroStatus, setFiltroStatus] = useState('atual');
  const [loading, setLoading] = useState(true);
  const [showFiltros, setShowFiltros] = useState(false);

  // Estado para projetos de campanha
  const [projetosCampanha, setProjetosCampanha] = useState<ProjetoCampanha[]>([]);
  const [loadingProjetos, setLoadingProjetos] = useState(true);

  const loadGestoes = useCallback(async () => {
    try {
      const data = await getGestoes();
      setGestoes(data);
      // Definir a gestão mais recente como padrão se não houver filtro
      if (data.length > 0 && !filtroGestao) {
        setFiltroGestao(data[0]);
      }
    } catch (error) {
      console.error('Erro ao carregar gestões:', error);
    }
  }, [filtroGestao]);

  const loadMembros = useCallback(async () => {
    try {
      setLoading(true);
      const params: { gestao?: string; status?: string } = {};
      if (filtroGestao) params.gestao = filtroGestao;
      if (filtroStatus) params.status = filtroStatus;
      
      const data = await getMembros(params);
      setMembrosEquipe(data);
    } catch (error) {
      console.error('Erro ao carregar membros:', error);
      setMembrosEquipe([]);
    } finally {
      setLoading(false);
    }
  }, [filtroGestao, filtroStatus]);

  const loadProjetos = useCallback(async () => {
    try {
      setLoadingProjetos(true);
      const params: { gestao?: string } = {};
      if (filtroGestao) params.gestao = filtroGestao;
      
      const data = await getProjetos(params);
      setProjetosCampanha(data);
    } catch (error) {
      console.error('Erro ao carregar projetos:', error);
      setProjetosCampanha([]);
    } finally {
      setLoadingProjetos(false);
    }
  }, [filtroGestao]);

  // Carregar dados ao montar o componente
  useEffect(() => {
    loadGestoes();
    loadProjetos();
  }, [loadGestoes, loadProjetos]);

  useEffect(() => {
    loadMembros();
  }, [loadMembros]);

  // Dados da gestão atual (dinâmico baseado no filtro)
  const gestaoAtual = {
    nome: filtroGestao || "Centro Acadêmico",
    periodo: filtroGestao,
    descricao: "O Centro Acadêmico trabalha para aproximar-se dos estudantes, promover eventos técnicos e culturais, e melhorar a comunicação entre os alunos e a coordenação do curso."
  };

  
  // Funções para renderizar elementos de UI
  
  // Função para renderizar a barra de progresso com cor apropriada
  const renderBarraProgresso = (status: string, progresso?: number) => {
    if (progresso === undefined) return null;
    
    let corBarra = "bg-blue-600";
    if (status === "concluído") corBarra = "bg-green-500";
    else if (status === "planejado") corBarra = "bg-yellow-500";
    
    return (
      <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
        <div 
          className={`${corBarra} h-2.5 rounded-full`} 
          style={{ width: `${progresso}%` }}
        ></div>
      </div>
    );
  };
  
  // Função para renderizar o status com cor apropriada
  const renderStatus = (status: string) => {
    let bgColor = "bg-blue-100 text-blue-800";
    if (status === "concluído") bgColor = "bg-green-100 text-green-800";
    else if (status === "planejado") bgColor = "bg-yellow-100 text-yellow-800";
    
    return (
      <span className={`${bgColor} text-xs font-medium px-2.5 py-0.5 rounded-full`}>
        {status}
      </span>
    );
  };

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Banner da gestão */}
      <section className="bg-blue-700 text-white py-16">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="flex flex-col items-center text-center">
            <Link href="/sobre" className="inline-flex items-center text-blue-100 hover:text-white mb-6">
              <ChevronLeft className="h-4 w-4 mr-1" />
              Voltar para Sobre o CA
            </Link>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Gestão {gestaoAtual.nome}
            </h1>
            <p className="text-xl font-light mb-2">
              Período {gestaoAtual.periodo}
            </p>
            <p className="max-w-2xl text-blue-100 mt-4">
              {gestaoAtual.descricao}
            </p>
          </div>
        </div>
      </section>

      {/* Equipe da gestão */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Users className="h-8 w-8 text-blue-600" />
              <h2 className="text-3xl font-bold">Nossa Equipe</h2>
            </div>
            <button
              onClick={() => setShowFiltros(!showFiltros)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
            >
              <Filter className="h-4 w-4" />
              Filtros
            </button>
          </div>

          {/* Filtros */}
          {showFiltros && (
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              </div>
            </div>
          )}
          
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : membrosEquipe.length === 0 ? (
            <div className="text-center py-12">
              <Users className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhum membro encontrado</h3>
              <p className="mt-1 text-sm text-gray-500">
                {filtroGestao || filtroStatus 
                  ? 'Tente ajustar os filtros para encontrar membros.' 
                  : 'Não há membros cadastrados no momento.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {membrosEquipe.map(membro => (
              <div key={membro.id} className="bg-white rounded-lg overflow-hidden shadow-md border border-gray-100 transition-transform hover:scale-105">
                <div className="h-48 relative">
                  <Image
                    src={membro.foto_url || "/imgs/evento-default.jpg"}
                    alt={`Foto de ${membro.nome}`}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-lg">{membro.nome}</h3>
                  <p className="text-blue-600 font-medium">{membro.cargo}</p>
                  <p className="text-gray-500 text-sm mb-3">{membro.area}</p>
                  <p className="text-gray-700 text-sm mb-3">{membro.descricao}</p>
                  {membro.contato && (
                    <a 
                      href={`mailto:${membro.contato}`} 
                      className="text-blue-600 text-sm hover:underline"
                    >
                      {membro.contato}
                    </a>
                  )}
                </div>
              </div>
            ))}
            </div>
          )}
        </div>
      </section>
      
      {/* Projetos e promessas */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="flex items-center gap-3 mb-10">
            <Trophy className="h-8 w-8 text-blue-600" />
            <h2 className="text-3xl font-bold">Projetos e Promessas de Campanha</h2>
          </div>
          
          {loadingProjetos ? (
            <div className="flex justify-center py-12 mb-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : projetosCampanha.length === 0 ? (
            <div className="text-center py-12 mb-12">
              <Trophy className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhum projeto encontrado</h3>
              <p className="mt-1 text-sm text-gray-500">
                {filtroGestao 
                  ? `Não há projetos cadastrados para a gestão ${filtroGestao}.` 
                  : 'Não há projetos de campanha cadastrados no momento.'}
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6 mb-12">
              {projetosCampanha.map(projeto => (
                <div key={projeto.id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold">{projeto.titulo}</h3>
                    {renderStatus(projeto.status)}
                  </div>
                  <p className="text-gray-700 mb-4">{projeto.descricao}</p>
                  {renderBarraProgresso(projeto.status, projeto.progresso)}
                </div>
              ))}
            </div>
          )}
          
          <div className="bg-blue-50 border border-blue-100 rounded-lg p-6">
            <div className="flex items-start gap-4">
              <CalendarCheck className="h-10 w-10 text-blue-600 flex-shrink-0" />
              <div>
                <h3 className="text-xl font-bold mb-2">Nosso Compromisso</h3>
                <p className="text-gray-700 mb-4">
                  Estamos trabalhando diariamente para cumprir todas as nossas promessas de campanha e tornar a experiência 
                  acadêmica de todos os estudantes de Ciência da Computação mais enriquecedora. Acreditamos na transparência 
                  e prestação de contas, por isso mantemos esta página atualizada regularmente.
                </p>
                <Link 
                  href="/financeiro/transparencia" 
                  className="text-blue-600 hover:text-blue-800 font-medium inline-flex items-center"
                >
                  Veja nossa prestação de contas
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-4 w-4 ml-1" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M9 5l7 7-7 7" 
                    />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Documentos e Estatuto */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="flex items-center gap-3 mb-10">
            <FileText className="h-8 w-8 text-blue-600" />
            <h2 className="text-3xl font-bold">Documentos Oficiais</h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
              <h3 className="text-xl font-bold mb-3">Estatuto do CA</h3>
              <p className="text-gray-700 mb-4">
                O documento que estabelece as regras de funcionamento, objetivos e estrutura organizacional do Centro Acadêmico.
              </p>
              <Link 
                href="/pdf/EstatutoCA.pdf" 
                target="_blank"
                className="inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Download do Estatuto
              </Link>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
              <h3 className="text-xl font-bold mb-3">Ata de Posse</h3>
              <p className="text-gray-700 mb-4">
                Documento oficial que registra a posse da atual gestão, com detalhes sobre a cerimônia e os compromissos assumidos.
              </p>
              <Link 
                href="/pdf/ata-posse.pdf" 
                target="_blank"
                className="inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Download da Ata
              </Link>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
              <h3 className="text-xl font-bold mb-3">Plano de Gestão</h3>
              <p className="text-gray-700 mb-4">
                Documento detalhado com as propostas, metas e cronograma de atividades planejadas para o mandato atual.
              </p>
              <Link 
                href="/pdf/plano-gestao.pdf" 
                target="_blank"
                className="inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Download do Plano
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* Call to Action */}
      <section className="py-12 bg-blue-600 text-white">
        <div className="container mx-auto px-4 max-w-5xl text-center">
          <h2 className="text-3xl font-bold mb-6">Quer participar do Centro Acadêmico?</h2>
          <p className="text-lg max-w-2xl mx-auto mb-8">
            O Centro Acadêmico é aberto a todos os estudantes de Ciência da Computação. 
            Venha contribuir com suas ideias e ajudar a construir um curso ainda melhor!
          </p>
          <Link 
            href="/contato" 
            className="inline-block px-6 py-3 bg-white text-blue-600 font-bold rounded-lg hover:bg-blue-50 transition-colors"
          >
            Entre em contato
          </Link>
        </div>
      </section>
    </main>
  );
} 