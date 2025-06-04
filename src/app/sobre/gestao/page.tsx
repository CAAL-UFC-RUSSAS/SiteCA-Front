'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Users, CalendarCheck, Trophy, FileText, ChevronLeft } from 'lucide-react';

interface MembroEquipe {
  id: number;
  nome: string;
  cargo: string;
  area: string;
  descricao: string;
  foto: string;
  contato?: string;
}

interface ProjetoCampanha {
  id: number;
  titulo: string;
  descricao: string;
  status: 'concluído' | 'em andamento' | 'planejado';
  progresso?: number;
}

export default function GestaoPage() {
  // Dados da gestão atual
  const gestaoAtual = {
    nome: "Computação em Ação",
    periodo: "2023-2024",
    descricao: "A chapa Computação em Ação foi eleita com o compromisso de aproximar o Centro Acadêmico dos estudantes, promover mais eventos técnicos e culturais, e melhorar a comunicação entre os alunos e a coordenação do curso."
  };
  
  // Membros da equipe de gestão
  const membrosEquipe: MembroEquipe[] = [
    {
      id: 1,
      nome: "Ana Silva",
      cargo: "Presidente",
      area: "Coordenação Geral",
      descricao: "Estudante de Ciência da Computação, 7º semestre. Responsável pela coordenação geral do CA e representação estudantil junto à UFC.",
      foto: "/imgs/evento-default.jpg",
      contato: "ana.silva@email.com"
    },
    {
      id: 2,
      nome: "Pedro Santos",
      cargo: "Vice-Presidente",
      area: "Coordenação Geral",
      descricao: "Estudante de Ciência da Computação, 6º semestre. Apoia a presidência e coordena projetos específicos de extensão.",
      foto: "/imgs/evento-default.jpg",
      contato: "pedro.santos@email.com"
    },
    {
      id: 3,
      nome: "Mariana Costa",
      cargo: "Secretária Geral",
      area: "Administração",
      descricao: "Estudante de Ciência da Computação, 5º semestre. Responsável pela organização de documentos, atas e comunicações oficiais.",
      foto: "/imgs/evento-default.jpg"
    },
    {
      id: 4,
      nome: "Lucas Oliveira",
      cargo: "Tesoureiro",
      area: "Finanças",
      descricao: "Estudante de Ciência da Computação, 8º semestre. Gerencia o orçamento, prestação de contas e planejamento financeiro.",
      foto: "/imgs/evento-default.jpg"
    },
    {
      id: 5,
      nome: "Juliana Mendes",
      cargo: "Diretora de Eventos",
      area: "Eventos e Cultura",
      descricao: "Estudante de Ciência da Computação, 6º semestre. Organiza eventos acadêmicos, culturais e de integração.",
      foto: "/imgs/evento-default.jpg"
    },
    {
      id: 6,
      nome: "Rafael Almeida",
      cargo: "Diretor de Comunicação",
      area: "Comunicação e Marketing",
      descricao: "Estudante de Ciência da Computação, 4º semestre. Responsável pelas redes sociais, site e divulgação.",
      foto: "/imgs/evento-default.jpg"
    },
    {
      id: 7,
      nome: "Camila Rodrigues",
      cargo: "Diretora de Ensino",
      area: "Assuntos Acadêmicos",
      descricao: "Estudante de Ciência da Computação, 7º semestre. Coordena monitorias, grupos de estudo e questões acadêmicas.",
      foto: "/imgs/evento-default.jpg"
    },
    {
      id: 8,
      nome: "Bruno Ferreira",
      cargo: "Diretor de Esportes",
      area: "Esportes e Bem-estar",
      descricao: "Estudante de Ciência da Computação, 5º semestre. Organiza atividades esportivas e promove o bem-estar estudantil.",
      foto: "/imgs/evento-default.jpg"
    }
  ];
  
  // Projetos e promessas da campanha
  const projetosCampanha: ProjetoCampanha[] = [
    {
      id: 1,
      titulo: "Semana da Computação",
      descricao: "Organizar uma semana acadêmica com palestras, workshops e hackathon, trazendo profissionais do mercado e da academia.",
      status: "concluído",
      progresso: 100
    },
    {
      id: 2,
      titulo: "Reforma da Sede do CA",
      descricao: "Melhorar a infraestrutura da sede do Centro Acadêmico, com novos móveis, equipamentos e espaço de convivência.",
      status: "em andamento",
      progresso: 60
    },
    {
      id: 3,
      titulo: "Banco de Questões e Materiais",
      descricao: "Criar um repositório digital com materiais de estudo, provas antigas e resumos para todas as disciplinas do curso.",
      status: "em andamento",
      progresso: 75
    },
    {
      id: 4,
      titulo: "Parcerias com Empresas",
      descricao: "Estabelecer convênios com empresas de tecnologia para estágios, visitas técnicas e patrocínios para eventos.",
      status: "em andamento",
      progresso: 40
    },
    {
      id: 5,
      titulo: "Programa de Mentorias",
      descricao: "Conectar calouros com veteranos para orientação acadêmica e profissional ao longo do curso.",
      status: "planejado",
      progresso: 15
    },
    {
      id: 6,
      titulo: "Jornal da Computação",
      descricao: "Criar um informativo mensal com notícias do curso, entrevistas, oportunidades e artigos técnicos.",
      status: "planejado",
      progresso: 0
    }
  ];
  
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
          <div className="flex items-center gap-3 mb-10">
            <Users className="h-8 w-8 text-blue-600" />
            <h2 className="text-3xl font-bold">Nossa Equipe</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {membrosEquipe.map(membro => (
              <div key={membro.id} className="bg-white rounded-lg overflow-hidden shadow-md border border-gray-100 transition-transform hover:scale-105">
                <div className="h-48 relative">
                  <Image
                    src={membro.foto}
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
        </div>
      </section>
      
      {/* Projetos e promessas */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="flex items-center gap-3 mb-10">
            <Trophy className="h-8 w-8 text-blue-600" />
            <h2 className="text-3xl font-bold">Projetos e Promessas de Campanha</h2>
          </div>
          
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