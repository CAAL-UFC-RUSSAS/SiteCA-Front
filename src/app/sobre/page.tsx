'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { BookOpen,  Users, Calendar,  Phone, Mail, MapPin, Heart, ChevronRight } from 'lucide-react';

export default function SobrePage() {
  return (
    <main className="min-h-screen">
      {/* Banner principal */}
      <section className="bg-blue-600 text-white py-20">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-8 md:mb-0 md:pr-8">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Centro Acadêmico de Ciência da Computação
              </h1>
              <p className="text-lg opacity-90">
                Somos a voz dos estudantes de Computação da UFC Russas, trabalhando para representar, integrar e melhorar a experiência acadêmica.
              </p>
            </div>
            <div className="md:w-1/2 bg-white rounded-lg p-6 shadow-md">
              <div className="aspect-video relative bg-gray-200 rounded-md overflow-hidden">
                {/* Usando imagem de evento como fallback caso a imagem de placeholder não exista */}
                <Image
                  src="/imgs/banner.jpg"
                  alt="Centro Acadêmico de Ciência da Computação"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* O que é o CA */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 max-w-5xl">
          <h2 className="text-3xl font-bold mb-10 text-center">O que é o Centro Acadêmico?</h2>
          
          <div className="bg-blue-50 p-8 rounded-xl mb-12">
            <p className="text-lg mb-6">
              O <strong>Centro Acadêmico Ada Lovelace (CAAL)</strong> é a entidade representativa dos estudantes 
              do curso de Ciência da Computação da Universidade Federal do Ceará Campus Russas. Somos uma organização sem fins 
              lucrativos, gerida por estudantes e para estudantes.
            </p>
            <p className="text-lg mb-6">
              Nossa missão é representar os interesses dos alunos perante a coordenação do curso, departamentos e instâncias 
              superiores da universidade, além de promover a integração acadêmica, cultural e social entre os estudantes.
            </p>
            <p className="text-lg">
              Trabalhamos para fortalecer a comunidade estudantil, melhorar as condições de ensino, 
              defender os direitos dos alunos e proporcionar experiências enriquecedoras que complementam a formação acadêmica.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
              <div className="bg-blue-100 w-14 h-14 rounded-full flex items-center justify-center mb-4">
                <BookOpen className="h-7 w-7 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">Formação Complementar</h3>
              <p className="text-gray-700">
                Organizamos cursos, oficinas, palestras e eventos que complementam o currículo formal e desenvolvem habilidades técnicas e sociais.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
              <div className="bg-blue-100 w-14 h-14 rounded-full flex items-center justify-center mb-4">
                <Users className="h-7 w-7 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">Representação Estudantil</h3>
              <p className="text-gray-700">
                Atuamos como ponte entre os estudantes e a instituição, levando demandas, sugestões e participando ativamente dos órgãos colegiados.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
              <div className="bg-blue-100 w-14 h-14 rounded-full flex items-center justify-center mb-4">
                <Heart className="h-7 w-7 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">Integração e Bem-estar</h3>
              <p className="text-gray-700">
                Promovemos eventos sociais, esportivos e culturais que fortalecem os laços entre os estudantes e contribuem para um ambiente acadêmico saudável.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Como podemos ajudar */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 max-w-5xl">
          <h2 className="text-3xl font-bold mb-10 text-center">Como Podemos Ajudar Você?</h2>
          
          <div className="grid md:grid-cols-2 gap-8 mb-12">

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <div className="flex items-start gap-4">
                <div className="bg-green-100 p-3 rounded-lg">
                  <Calendar className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Eventos e Calendário</h3>
                  <p className="text-gray-700 mb-4">
                    Organizamos e divulgamos eventos acadêmicos, workshops e integramos o calendário da UFC Russas com eventos do Centro Acadêmico.
                  </p>
                  <Link href="/eventos" className="text-blue-600 hover:text-blue-800 inline-flex items-center">
                    Ver calendário <ChevronRight className="h-4 w-4 ml-1" />
                  </Link>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <div className="flex items-start gap-4">
                <div className="bg-red-100 p-3 rounded-lg">
                  <Users className="h-6 w-6 text-red-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Suporte ao Estudante</h3>
                  <p className="text-gray-700 mb-4">
                    Orientamos sobre processos acadêmicos, auxiliamos em questões burocráticas e atuamos como mediadores em situações que afetem os direitos estudantis.
                  </p>
                  <Link href="/servicos" className="text-blue-600 hover:text-blue-800 inline-flex items-center">
                    Ver serviços <ChevronRight className="h-4 w-4 ml-1" />
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-blue-600 rounded-xl p-8 text-white text-center">
            <h3 className="text-2xl font-bold mb-4">Participe do Centro Acadêmico!</h3>
            <p className="text-lg mb-6 max-w-2xl mx-auto">
              O CA é aberto a todos os estudantes do curso. Você pode contribuir com ideias, participar de projetos ou 
              até mesmo candidatar-se para a gestão. Sua participação é fundamental para fortalecer nossa representação!
            </p>
            <Link 
              href="/sobre/gestao" 
              className="inline-block bg-white text-blue-600 px-6 py-3 rounded-lg font-bold hover:bg-blue-50 transition-colors"
            >
              Conheça a gestão atual
            </Link>
          </div>
        </div>
      </section>

      {/* Contato e Localização */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 max-w-5xl">
          <h2 className="text-3xl font-bold mb-10 text-center">Onde Encontrar o CA</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <div className="bg-gray-200 rounded-lg aspect-square relative overflow-hidden">
                {/* Usando logo da UFC como fallback para o mapa */}
                <Image
                  src="/imgs/ufclogo.png"
                  alt="Localização do Centro Acadêmico"
                  fill
                  className="object-contain p-8"
                />
              </div>
            </div>
            
            <div className="flex flex-col justify-center">
              <h3 className="text-2xl font-bold mb-6">Entre em Contato</h3>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="bg-gray-100 p-2 rounded-full">
                    <MapPin className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium">Localização</p>
                    <p className="text-gray-600">R. Felipe Santiago, 411 - Cidade Universitária, Russas - CE</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="bg-gray-100 p-2 rounded-full">
                    <Clock className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium">Horário de Funcionamento</p>
                    <p className="text-gray-600">Segunda a Sexta, das 8h às 19h</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="bg-gray-100 p-2 rounded-full">
                    <Mail className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium">E-mail</p>
                    <p className="text-gray-600">um.caal2.0@gmail.com</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="bg-gray-100 p-2 rounded-full">
                    <Phone className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium">Telefone</p>
                    <p className="text-gray-600">(74) 8875-7145 / (11) 4516-5101</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-8">
                <Link 
                  href="/contato" 
                  className="inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  Formulário de Contato
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

const Clock = ({ className }: { className?: string }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="12" cy="12" r="10"></circle>
      <polyline points="12 6 12 12 16 14"></polyline>
    </svg>
  );
}; 