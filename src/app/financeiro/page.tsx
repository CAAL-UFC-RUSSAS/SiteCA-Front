'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function FinanceiroPage() {
  const [activeTab, setActiveTab] = useState<'ca' | 'descanso'>('ca');
  
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-center text-indigo-800 mb-6">
          Finanças
        </h1>
        
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md overflow-hidden mb-10">
          <div className="flex">
            <button
              onClick={() => setActiveTab('ca')}
              className={`flex-1 py-4 px-6 text-center font-medium ${
                activeTab === 'ca'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Centro Acadêmico
            </button>
            <button
              onClick={() => setActiveTab('descanso')}
              className={`flex-1 py-4 px-6 text-center font-medium ${
                activeTab === 'descanso'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Sala de Descanso
            </button>
          </div>
          
          <div className="p-6">
            {activeTab === 'ca' ? (
              <div>
                <h2 className="text-xl font-semibold mb-4">Centro Acadêmico</h2>
                <p className="text-gray-600 mb-4">
                  O Centro Acadêmico gerencia recursos financeiros provenientes de várias fontes, incluindo eventos, 
                  doações e parcerias. Todos os recursos são utilizados em benefício dos estudantes, seja para a realização 
                  de eventos acadêmicos, aquisição de materiais ou melhoria das instalações.
                </p>
                <p className="text-gray-600 mb-4">
                  Nossa gestão é completamente transparente, com todas as transações registradas e disponíveis para 
                  consulta na página de transparência. Periodicamente, também são gerados relatórios detalhados sobre 
                  as movimentações financeiras.
                </p>
                <div className="mt-6">
                  <h3 className="text-lg font-medium mb-2">Fontes de recursos:</h3>
                  <ul className="list-disc pl-5 text-gray-600 space-y-1">
                    <li>Eventos acadêmicos e festas</li>
                    <li>Venda de produtos personalizados</li>
                    <li>Doações de empresas parceiras</li>
                    <li>Projetos e iniciativas estudantis</li>
                  </ul>
                </div>
                <div className="mt-6">
                  <h3 className="text-lg font-medium mb-2">Destino dos recursos:</h3>
                  <ul className="list-disc pl-5 text-gray-600 space-y-1">
                    <li>Eventos acadêmicos (palestras, workshops, semanas temáticas)</li>
                    <li>Materiais e equipamentos para o CA</li>
                    <li>Melhorias na infraestrutura</li>
                    <li>Apoio a projetos estudantis</li>
                  </ul>
                </div>
              </div>
            ) : (
              <div>
                <h2 className="text-xl font-semibold mb-4">Sala de Descanso</h2>
                <p className="text-gray-600 mb-4">
                  A Sala de Descanso é um espaço administrado pelos estudantes, com finanças gerenciadas 
                  separadamente do Centro Acadêmico. Os recursos são provenientes principalmente da venda de produtos 
                  como café, lanches e outros itens disponíveis no local.
                </p>
                <p className="text-gray-600 mb-4">
                  Todo o valor arrecadado é reinvestido na própria sala, seja para reposição de estoque, 
                  aquisição de novos equipamentos ou melhorias no ambiente. Assim como o CA, a gestão financeira 
                  da Sala de Descanso é totalmente transparente.
                </p>
                <div className="mt-6">
                  <h3 className="text-lg font-medium mb-2">Fontes de recursos:</h3>
                  <ul className="list-disc pl-5 text-gray-600 space-y-1">
                    <li>Venda de café e bebidas</li>
                    <li>Venda de lanches e snacks</li>
                    <li>Cobrança simbólica por uso de equipamentos</li>
                    <li>Doações específicas para a sala</li>
                  </ul>
                </div>
                <div className="mt-6">
                  <h3 className="text-lg font-medium mb-2">Destino dos recursos:</h3>
                  <ul className="list-disc pl-5 text-gray-600 space-y-1">
                    <li>Reposição de estoque de alimentos e bebidas</li>
                    <li>Compra e manutenção de equipamentos (microondas, cafeteira, etc.)</li>
                    <li>Mobiliário e decoração</li>
                    <li>Materiais de limpeza e organização</li>
                  </ul>
                </div>
              </div>
            )}
            
            <div className="mt-8 flex justify-center">
              <Link 
                href="/financeiro/transparencia" 
                className="px-6 py-3 bg-green-600 text-white font-medium rounded-md hover:bg-green-700 transition-colors"
              >
                Ver Transparência Financeira
              </Link>
            </div>
          </div>
        </div>
        
        <div className="max-w-4xl mx-auto text-center text-gray-600">
          <p>
            Para mais informações sobre as finanças do Centro Acadêmico ou da Sala de Descanso, 
            entre em contato com a diretoria ou visite a sede do CA.
          </p>
        </div>
      </div>
    </div>
  );
} 