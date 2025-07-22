'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Github, Instagram, Code, Server, Database, Globe, Cpu, Rocket } from 'lucide-react';

export default function DevPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-100">
      {/* Hero Section */}
      <section className="pt-20 pb-16 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="relative w-32 h-32 mx-auto mb-6 rounded-full overflow-hidden border-4 border-indigo-500 shadow-lg">
            <Image
              src="/imgs/dev.png"
              alt="Antônio Lisboa"
              fill
              className="object-cover"
              priority
            />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">Antônio Lisboa</h1>
          <p className="text-xl text-gray-600 mb-8">Desenvolvedor Full Stack</p>
          
          <div className="flex justify-center space-x-4 mb-8">
            <Link 
              href="https://github.com/LisboaAnt" 
              target="_blank"
              className="bg-gray-800 text-white p-3 rounded-full hover:bg-gray-700 transition-colors"
              aria-label="GitHub"
            >
              <Github size={24} />
            </Link>
            <Link 
              href="https://www.instagram.com/antoniolis_boa/" 
              target="_blank"
              className="bg-gradient-to-br from-purple-500 to-pink-500 text-white p-3 rounded-full hover:opacity-90 transition-opacity"
              aria-label="Instagram"
            >
              <Instagram size={24} />
            </Link>
          </div>
        </div>
      </section>

      {/* Sobre o Projeto */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">Sobre o Projeto</h2>
          
          <div className="grid md:grid-cols-2 gap-10">
            <div className="bg-blue-50 p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <Code className="text-blue-600 mr-3" size={28} />
                <h3 className="text-xl font-semibold text-gray-800">Frontend</h3>
              </div>
              <p className="text-gray-700 mb-4">
                Desenvolvido com Next.js 14, utilizando React com TypeScript para uma experiência de usuário moderna e responsiva. 
                O site conta com componentes reutilizáveis e estilização com Tailwind CSS.
              </p>
              <Link 
                href="https://github.com/CAAL-UFC-RUSSAS/SiteCA-Front" 
                target="_blank"
                className="text-blue-600 hover:text-blue-800 font-medium flex items-center"
              >
                <span>Ver repositório</span>
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            </div>
            
            <div className="bg-indigo-50 p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <Server className="text-indigo-600 mr-3" size={28} />
                <h3 className="text-xl font-semibold text-gray-800">Backend</h3>
              </div>
              <p className="text-gray-700 mb-4">
                API RESTful construída com Node.js e Express, utilizando Knex.js como query builder para interação com o banco de dados. 
                Implementação de autenticação JWT para segurança das rotas administrativas.
              </p>
              <Link 
                href="https://github.com/CAAL-UFC-RUSSAS/SiteCA-Back" 
                target="_blank"
                className="text-indigo-600 hover:text-indigo-800 font-medium flex items-center"
              >
                <span>Ver repositório</span>
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stack Tecnológica */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">Stack Tecnológica</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md text-center hover:shadow-lg transition-shadow">
              <div className="flex justify-center mb-4">
                <Cpu className="text-blue-500" size={36} />
              </div>
              <h3 className="text-lg font-semibold mb-2">Next.js & React</h3>
              <p className="text-gray-600 text-sm">Framework React para renderização híbrida e melhor SEO</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md text-center hover:shadow-lg transition-shadow">
              <div className="flex justify-center mb-4">
                <Server className="text-green-500" size={36} />
              </div>
              <h3 className="text-lg font-semibold mb-2">Node.js & Express</h3>
              <p className="text-gray-600 text-sm">Backend JavaScript com API RESTful</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md text-center hover:shadow-lg transition-shadow">
              <div className="flex justify-center mb-4">
                <Database className="text-purple-500" size={36} />
              </div>
              <h3 className="text-lg font-semibold mb-2">PostgreSQL (Neon)</h3>
              <p className="text-gray-600 text-sm">Banco de dados relacional serverless</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md text-center hover:shadow-lg transition-shadow">
              <div className="flex justify-center mb-4">
                <Globe className="text-indigo-500" size={36} />
              </div>
              <h3 className="text-lg font-semibold mb-2">Vercel & Render</h3>
              <p className="text-gray-600 text-sm">Hospedagem e deploy contínuo</p>
            </div>
          </div>
        </div>
      </section>

      {/* Processo de Desenvolvimento */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">Processo de Desenvolvimento</h2>
          
          <div className="space-y-12">
            <div className="flex flex-col md:flex-row items-start gap-6">
              <div className="bg-blue-100 p-4 rounded-full">
                <Rocket className="text-blue-600" size={32} />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-3 text-gray-800">Desenvolvimento Solo</h3>
                <p className="text-gray-700">
                  Todo o projeto foi desenvolvido por uma única pessoa, desde o design da interface até a implementação do backend e 
                  integração com o banco de dados. Isso permitiu uma visão holística do sistema e decisões de arquitetura consistentes.
                </p>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row items-start gap-6">
              <div className="bg-green-100 p-4 rounded-full">
                <Database className="text-green-600" size={32} />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-3 text-gray-800">Infraestrutura Cloud</h3>
                <p className="text-gray-700">
                  O frontend está hospedado na Vercel, aproveitando sua CDN global e integração nativa com Next.js.
                  O backend está na plataforma Render, com CI/CD automático a partir do GitHub.
                  O banco de dados PostgreSQL é gerenciado pela Neon, uma solução serverless escalável.
                </p>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row items-start gap-6">
              <div className="bg-purple-100 p-4 rounded-full">
                <Code className="text-purple-600" size={32} />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-3 text-gray-800">Arquitetura Moderna</h3>
                <p className="text-gray-700">
                  Arquitetura de microsserviços com frontend e backend separados, comunicando-se via API REST.
                  Autenticação JWT para proteção de rotas administrativas e sistema de upload de imagens com
                  armazenamento otimizado em base64 para maior portabilidade.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-6">Antônio Lisboa</h2>
          <p className="mb-8">Desenvolvedor Full Stack</p>
          
          <div className="flex justify-center space-x-6 mb-8">
            <Link 
              href="https://github.com/LisboaAnt" 
              target="_blank"
              className="hover:text-blue-400 transition-colors"
              aria-label="GitHub"
            >
              <Github size={24} />
            </Link>
            <Link 
              href="https://www.instagram.com/antoniolis_boa/" 
              target="_blank"
              className="hover:text-pink-400 transition-colors"
              aria-label="Instagram"
            >
              <Instagram size={24} />
            </Link>
          </div>
          
          <div className="text-gray-400 text-sm">
            <p>© {2025} - Site desenvolvido para o Centro Acadêmico de Ciência da Computação</p>
            <p>Universidade Federal do Ceará - Campus Russas</p>
          </div>
        </div>
      </footer>
    </div>
  );
} 