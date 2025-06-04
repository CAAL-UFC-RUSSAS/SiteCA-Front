'use client';

import React from 'react';
import { Printer, Book, Coffee, Box, Users, Calendar, HelpCircle, ChevronDown, Clock } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function ServicosPage() {
  const [servicoAberto, setServicoAberto] = React.useState<string | null>('impressao');

  const toggleServico = (id: string) => {
    if (servicoAberto === id) {
      setServicoAberto(null);
    } else {
      setServicoAberto(id);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Banner de serviços */}
      <section className="bg-blue-600 text-white py-16">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Serviços do Centro Acadêmico</h1>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Conheça os serviços oferecidos pelo Centro Acadêmico de Ciência da Computação
              para apoiar os estudantes durante a jornada acadêmica.
            </p>
          </div>
        </div>
      </section>

      {/* Serviços principais */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-5xl">
          <h2 className="text-2xl font-bold mb-8 text-center">Nossos Serviços</h2>

          <div className="space-y-6">
            {/* Serviço de Impressão */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <button 
                onClick={() => toggleServico('impressao')}
                className="w-full px-6 py-4 flex items-center justify-between bg-white hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-100 rounded-full">
                    <Printer className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold">Serviço de Impressão</h3>
                </div>
                <ChevronDown className={`h-5 w-5 text-gray-500 transition-transform ${servicoAberto === 'impressao' ? 'transform rotate-180' : ''}`} />
              </button>
              
              {servicoAberto === 'impressao' && (
                <div className="px-6 py-4 bg-gray-50 border-t">
                  <div className="space-y-4">
                    <p className="text-gray-700">
                      O Centro Acadêmico oferece serviço de impressão a preços acessíveis para todos os estudantes do curso.
                    </p>
                    
                    <div className="bg-white p-4 rounded-lg border">
                      <h4 className="font-semibold text-lg mb-2">Tabela de Preços</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between pb-2 border-b">
                          <span>Impressão P&B (por folha)</span>
                          <span className="font-semibold">R$ 0,50</span>
                        </div>
                        <div className="flex justify-between pb-2 border-b">
                          <span>Impressão Colorida (por folha)</span>
                          <span className="font-semibold">R$ 1,00</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h4 className="font-semibold mb-2 flex items-center">
                        <Clock className="h-4 w-4 mr-2" />
                        Horário de Funcionamento
                      </h4>
                      <p className="text-gray-700">
                        Segunda a Sexta: 8h às 21h<br />
                        Sábado: 8h às 12h
                      </p>
                    </div>
                    
                    <div className="bg-yellow-50 p-4 rounded-lg">
                      <h4 className="font-semibold mb-2">Como utilizar o serviço:</h4>
                      <ol className="list-decimal list-inside space-y-1 text-gray-700">
                        <li>Envie o arquivo por e-mail para cacc.impressao@gmail.com</li>
                        <li>Aguarde a confirmação de recebimento</li>
                        <li>Dirija-se à sede do CA para realizar o pagamento e retirar suas impressões</li>
                      </ol>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {/* Empréstimo de Livros */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <button 
                onClick={() => toggleServico('livros')}
                className="w-full px-6 py-4 flex items-center justify-between bg-white hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-100 rounded-full">
                    <Book className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold">Empréstimo de Livros</h3>
                </div>
                <ChevronDown className={`h-5 w-5 text-gray-500 transition-transform ${servicoAberto === 'livros' ? 'transform rotate-180' : ''}`} />
              </button>
              
              {servicoAberto === 'livros' && (
                <div className="px-6 py-4 bg-gray-50 border-t">
                  <div className="space-y-4">
                    <p className="text-gray-700">
                      O CA dispõe de uma pequena biblioteca com livros técnicos, literatura e materiais de estudo que podem ser emprestados aos estudantes.
                    </p>
                    
                    <div className="bg-white p-4 rounded-lg border">
                      <h4 className="font-semibold text-lg mb-2">Regras para Empréstimo</h4>
                      <ul className="list-disc list-inside space-y-1 text-gray-700">
                        <li>Prazo de empréstimo: 15 dias, renovável por mais 7 dias</li>
                        <li>Limite de 2 livros por estudante</li>
                        <li>É necessário apresentar carteira de estudante para o empréstimo</li>
                        <li>Multa de R$ 1,00 por dia de atraso na devolução</li>
                      </ul>
                    </div>
                    
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h4 className="font-semibold mb-2">Categorias de Livros Disponíveis:</h4>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="bg-white p-2 rounded border">Programação</div>
                        <div className="bg-white p-2 rounded border">Algoritmos</div>
                        <div className="bg-white p-2 rounded border">Redes</div>
                        <div className="bg-white p-2 rounded border">Banco de Dados</div>
                        <div className="bg-white p-2 rounded border">Eng. de Software</div>
                        <div className="bg-white p-2 rounded border">Literatura Geral</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {/* Espaço de Estudos */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <button 
                onClick={() => toggleServico('estudos')}
                className="w-full px-6 py-4 flex items-center justify-between bg-white hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-100 rounded-full">
                    <Coffee className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold">Espaço de Estudos</h3>
                </div>
                <ChevronDown className={`h-5 w-5 text-gray-500 transition-transform ${servicoAberto === 'estudos' ? 'transform rotate-180' : ''}`} />
              </button>
              
              {servicoAberto === 'estudos' && (
                <div className="px-6 py-4 bg-gray-50 border-t">
                  <div className="space-y-4">
                    <p className="text-gray-700">
                      O Centro Acadêmico disponibiliza um espaço confortável e silencioso para estudos individuais ou em grupo.
                    </p>
                    
                    <div className="bg-white p-4 rounded-lg border">
                      <h4 className="font-semibold text-lg mb-2">Recursos Disponíveis</h4>
                      <ul className="list-disc list-inside space-y-1 text-gray-700">
                        <li>Mesas de estudo individuais e em grupo</li>
                        <li>Acesso à internet Wi-Fi</li>
                        <li>Pontos de energia para notebooks</li>
                        <li>Bebedouro e máquina de café</li>
                        <li>Ar-condicionado</li>
                      </ul>
                    </div>
                    
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h4 className="font-semibold mb-2 flex items-center">
                        <Clock className="h-4 w-4 mr-2" />
                        Horário de Funcionamento
                      </h4>
                      <p className="text-gray-700">
                        Segunda a Sexta: 7h às 22h<br />
                        Sábado: 8h às 14h
                      </p>
                    </div>
                    
                    <p className="text-sm text-gray-600 italic">
                      * Durante o período de provas, o espaço pode ficar aberto por mais tempo.
                    </p>
                  </div>
                </div>
              )}
            </div>
            
            {/* Armários */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <button 
                onClick={() => toggleServico('armarios')}
                className="w-full px-6 py-4 flex items-center justify-between bg-white hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-100 rounded-full">
                    <Box className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold">Aluguel de Armários</h3>
                </div>
                <ChevronDown className={`h-5 w-5 text-gray-500 transition-transform ${servicoAberto === 'armarios' ? 'transform rotate-180' : ''}`} />
              </button>
              
              {servicoAberto === 'armarios' && (
                <div className="px-6 py-4 bg-gray-50 border-t">
                  <div className="space-y-4">
                    <p className="text-gray-700">
                      O CA disponibiliza armários para que os estudantes possam guardar seus materiais com segurança durante o semestre.
                    </p>
                    
                    <div className="bg-white p-4 rounded-lg border">
                      <h4 className="font-semibold text-lg mb-2">Informações sobre Armários</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between pb-2 border-b">
                          <span>Aluguel Semestral</span>
                          <span className="font-semibold">R$ 25,00</span>
                        </div>
                        <div className="flex justify-between pb-2 border-b">
                          <span>Aluguel Anual</span>
                          <span className="font-semibold">R$ 40,00</span>
                        </div>
                        <div className="flex justify-between pb-2 border-b">
                          <span>Caução (reembolsável)</span>
                          <span className="font-semibold">R$ 10,00</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-yellow-50 p-4 rounded-lg">
                      <h4 className="font-semibold mb-2">Como alugar um armário:</h4>
                      <ol className="list-decimal list-inside space-y-1 text-gray-700">
                        <li>Verifique a disponibilidade na sede do CA</li>
                        <li>Preencha o formulário de solicitação</li>
                        <li>Efetue o pagamento</li>
                        <li>Receba a chave e o termo de responsabilidade</li>
                      </ol>
                    </div>
                    
                    <p className="text-sm text-gray-600">
                      Obs: Os armários são limitados e distribuídos por ordem de solicitação.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
      
      {/* Outros Serviços */}
      <section className="py-16 bg-gray-100">
        <div className="container mx-auto px-4 max-w-5xl">
          <h2 className="text-2xl font-bold mb-8 text-center">Outros Serviços e Atividades</h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="mb-4 p-3 bg-blue-100 inline-block rounded-full">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-bold mb-2">Grupos de Estudos</h3>
              <p className="text-gray-700">
                Organizamos grupos de estudos para diversas disciplinas, facilitando a 
                colaboração entre estudantes e o compartilhamento de conhecimento.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="mb-4 p-3 bg-blue-100 inline-block rounded-full">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-bold mb-2">Eventos Acadêmicos</h3>
              <p className="text-gray-700">
                Promovemos palestras, workshops e eventos relacionados à computação, 
                trazendo profissionais do mercado e da academia.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="mb-4 p-3 bg-blue-100 inline-block rounded-full">
                <HelpCircle className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-bold mb-2">Apoio ao Estudante</h3>
              <p className="text-gray-700">
                Oferecemos orientação sobre procedimentos acadêmicos, programas de 
                intercâmbio e oportunidades de estágio.
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
            Se você tiver alguma dúvida sobre os serviços oferecidos ou precisar de assistência,
            entre em contato conosco ou visite a sede do Centro Acadêmico.
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