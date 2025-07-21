'use client';

import React from 'react';
import { Printer, Users, Calendar, HelpCircle, Clock, Mail } from 'lucide-react';
import Link from 'next/link';

export default function ServicosPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      {/* Banner de serviços */}
      <section className="bg-blue-500 text-white py-16">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Serviços do Centro Acadêmico</h1>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              O Centro Acadêmico de Ciência da Computação oferece serviço de impressão
              para apoiar os estudantes durante a jornada acadêmica.
            </p>
          </div>
        </div>
      </section>

      {/* Serviço de Impressão */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="bg-blue-600 text-white px-6 py-4">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white bg-opacity-20 rounded-full">
                  <Printer className="h-8 w-8 text-black" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Serviço de Impressão</h2>
                  <p className="text-blue-100">Impressões a preços acessíveis para todos os estudantes</p>
                </div>
              </div>
            </div>
            
            <div className="p-6">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Tabela de Preços */}
                <div>
                  <h3 className="text-xl font-bold mb-4 text-gray-900">Tabela de Preços</h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center py-3 border-b border-gray-200">
                        <span className="text-gray-700 font-medium">Impressão Preta e Branca</span>
                        <span className="text-xl font-bold text-blue-600">R$ 0,50</span>
                      </div>
                      <div className="flex justify-between items-center py-3 border-b border-gray-200">
                        <span className="text-gray-700 font-medium">Impressão Colorida</span>
                        <span className="text-xl font-bold text-blue-600">R$ 1,00</span>
                      </div>
                      <div className="flex justify-between items-center py-3">
                        <span className="text-gray-700 font-medium">Papel Foto</span>
                        <span className="text-xl font-bold text-blue-600">R$ 2,00</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    * Preços por folha / página
                  </p>
                </div>

                {/* Informações de Funcionamento */}
                <div className="space-y-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-bold mb-2 flex items-center text-blue-900">
                      <Clock className="h-5 w-5 mr-2" />
                      Horário de Funcionamento
                    </h4>
                    <div className="space-y-1 text-gray-700">
                      <p><strong>Segunda a Sexta:</strong> 8h às 19h</p>
                      <p className="text-sm text-gray-600 mt-2">
                        * Sujeito a alterações durante períodos de prova
                      </p>
                    </div>
                  </div>

                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-bold mb-3 flex items-center text-green-900">
                      <Mail className="h-5 w-5 mr-2" />
                      Como Solicitar
                    </h4>
                    <ol className="list-decimal list-inside space-y-2 text-gray-700">
                      <li>Envie o arquivo por whatsapp para: <strong>(74) 988757145</strong></li>
                      <li>Aguarde a confirmação de recebimento</li>
                      <li>Dirija-se à sede do CA para efetuar o pagamento</li>
                      <li>Retire suas impressões na sede</li>
                    </ol>
                  </div>
                </div>
              </div>

              {/* Observações importantes */}
              <div className="mt-6 bg-yellow-50 border-l-4 border-yellow-400 p-4">
                <h4 className="font-bold text-yellow-900 mb-2">Observações Importantes:</h4>
                <ul className="list-disc list-inside space-y-1 text-yellow-800">
                  <li>O pagamento deve ser feito na sede do CA no momento da retirada</li>
                  <li>Aceitar formatos: PDF, DOC, DOCX, JPG, PNG</li>
                  <li>Arquivos muito grandes podem demorar mais para processar</li>
                  <li>O CA não se responsabiliza por problemas de formatação nos arquivos</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Outros Serviços e Atividades */}
      <section className="py-16 bg-gray-100">
        <div className="container mx-auto px-4 max-w-5xl">
          <h2 className="text-2xl font-bold mb-8 text-center">Outras Atividades do Centro Acadêmico</h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="mb-4 p-3 bg-blue-100 inline-block rounded-full">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-bold mb-2">Representação Estudantil</h3>
              <p className="text-gray-700">
                Representamos os interesses dos estudantes junto à coordenação do curso e à
                administração da universidade.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="mb-4 p-3 bg-blue-100 inline-block rounded-full">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-bold mb-2">Eventos Acadêmicos</h3>
              <p className="text-gray-700">
                Organizamos palestras, workshops e eventos relacionados à computação, 
                trazendo profissionais do mercado e da academia.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="mb-4 p-3 bg-blue-100 inline-block rounded-full">
                <HelpCircle className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-bold mb-2">Apoio ao Estudante</h3>
              <p className="text-gray-700">
                Oferecemos orientação sobre procedimentos acadêmicos e questões relacionadas
                ao curso de Ciência da Computação.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Call to Action */}
      <section className="py-12 bg-blue-600 text-white">
        <div className="container mx-auto px-4 max-w-5xl text-center">
          <h2 className="text-3xl font-bold mb-4">Precisa de ajuda?</h2>
          <p className="text-lg max-w-2xl mx-auto mb-8">
            Se você tiver alguma dúvida sobre o serviço de impressão ou precisar de assistência,
            entre em contato conosco ou visite a sede do Centro Acadêmico.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/contato"
              className="inline-block px-6 py-3 bg-white text-blue-600 font-bold rounded-lg hover:bg-blue-50 transition-colors"
            >
              Entre em contato
            </Link>
            <a
              href="https://wa.me/5574988757145?text=Olá! Gostaria de solicitar um serviço de impressão."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-6 py-3 bg-green-500 text-white font-bold rounded-lg hover:bg-green-400 transition-colors border-2 border-white"
            >
              Enviar arquivo para impressão
            </a>
          </div>
        </div>
      </section>
    </main>
  );
} 