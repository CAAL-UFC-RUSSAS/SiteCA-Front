'use client';

import React, { useState } from 'react';
import { Phone, Mail, MapPin, Clock, Send, Check, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function ContatoPage() {
  // Estados para gerenciar o formulário
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    assunto: '',
    mensagem: ''
  });
  const [enviando, setEnviando] = useState(false);
  const [statusEnvio, setStatusEnvio] = useState<'idle' | 'success' | 'error'>('idle');
  const [mensagemStatus, setMensagemStatus] = useState('');

  // Função para atualizar o estado do formulário
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Função para enviar o formulário
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validação básica
    if (!formData.nome || !formData.email || !formData.mensagem) {
      setStatusEnvio('error');
      setMensagemStatus('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    try {
      setEnviando(true);
      setStatusEnvio('idle');
      
      // URL do backend - tentar rota direta /contato em vez de /email/contato
      const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333';
      const apiUrl = `${backendUrl}/contato`;
      
      console.log('Enviando formulário para:', apiUrl);
      console.log('Dados:', formData);
      
      // Chamada para a API
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });
      
      let data;
      const contentType = response.headers.get('content-type');
      
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
        console.log('Resposta da API:', data);
      } else {
        const text = await response.text();
        console.error('Resposta não-JSON:', text);
        data = { message: 'Erro no formato da resposta' };
      }
      
      if (!response.ok) {
        throw new Error(data.message || 'Erro ao enviar mensagem');
      }
      
      setStatusEnvio('success');
      setMensagemStatus('Mensagem enviada com sucesso! Entraremos em contato em breve.');
      
      // Limpa o formulário após o envio bem-sucedido
      setFormData({
        nome: '',
        email: '',
        assunto: '',
        mensagem: ''
      });
    } catch (error) {
      // Tratamento de erro
      console.error('Erro ao enviar formulário:', error);
      setStatusEnvio('error');
      setMensagemStatus('Erro ao enviar mensagem. Por favor, tente novamente mais tarde ou envie um e-mail diretamente para um.caal2.0@gmail.com');
    } finally {
      setEnviando(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Banner de contato */}
      <section className="bg-blue-600 text-white py-16">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Entre em Contato</h1>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Estamos aqui para ouvir suas dúvidas, sugestões e ideias. O Centro Acadêmico 
              é o seu canal de comunicação com a universidade.
            </p>
          </div>
        </div>
      </section>

      {/* Conteúdo principal */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="grid md:grid-cols-2 gap-10">
            {/* Formulário de contato */}
            <div>
              <h2 className="text-2xl font-bold mb-6">Envie sua mensagem</h2>
              
              {/* Exibe mensagem de sucesso */}
              {statusEnvio === 'success' && (
                <div className="mb-6 p-4 bg-green-100 text-green-800 rounded-lg flex items-start">
                  <Check className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                  <p>{mensagemStatus}</p>
                </div>
              )}
              
              {/* Exibe mensagem de erro */}
              {statusEnvio === 'error' && (
                <div className="mb-6 p-4 bg-red-100 text-red-800 rounded-lg flex items-start">
                  <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                  <p>{mensagemStatus}</p>
                </div>
              )}
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="nome" className="block text-sm font-medium text-gray-700 mb-1">
                    Nome *
                  </label>
                  <input
                    type="text"
                    id="nome"
                    name="nome"
                    value={formData.nome}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    E-mail *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="assunto" className="block text-sm font-medium text-gray-700 mb-1">
                    Assunto
                  </label>
                  <select
                    id="assunto"
                    name="assunto"
                    value={formData.assunto}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Selecione um assunto</option>
                    <option value="Dúvidas">Dúvidas gerais</option>
                    <option value="Sugestões">Sugestões</option>
                    <option value="Reclamações">Reclamações</option>
                    <option value="Parcerias">Parcerias</option>
                    <option value="Eventos">Eventos</option>
                    <option value="Outros">Outros</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="mensagem" className="block text-sm font-medium text-gray-700 mb-1">
                    Mensagem *
                  </label>
                  <textarea
                    id="mensagem"
                    name="mensagem"
                    value={formData.mensagem}
                    onChange={handleChange}
                    rows={5}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  ></textarea>
                </div>
                
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={enviando}
                    className={`px-6 py-3 rounded-md text-white font-medium flex items-center justify-center ${
                      enviando ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
                    } transition-colors w-full`}
                  >
                    {enviando ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Enviando...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Enviar mensagem
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
            
            {/* Informações de contato */}
            <div>
              <h2 className="text-2xl font-bold mb-6">Informações de contato</h2>
              
              <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-blue-100 p-3 rounded-full">
                      <MapPin className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">Localização</h3>
                      <p className="text-gray-600">Bloco 910, Campus do Pici - UFC</p>
                      <p className="text-gray-600">Fortaleza, CE - CEP 60455-900</p>
                      <a 
                        href="https://goo.gl/maps/RvNzxHYU9jkTHhSC9" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-block mt-2 text-blue-600 hover:text-blue-800"
                      >
                        Ver no Google Maps
                      </a>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="bg-blue-100 p-3 rounded-full">
                      <Clock className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">Horário de funcionamento</h3>
                      <p className="text-gray-600">Segunda a Sexta: 8h às 22h</p>
                      <p className="text-gray-600">Sábado: 8h às 12h (apenas em eventos)</p>
                      <p className="text-gray-600">Domingo: Fechado</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="bg-blue-100 p-3 rounded-full">
                      <Mail className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">E-mail</h3>
                      <a 
                        href="mailto:cacc@ufc.br" 
                        className="text-gray-600 hover:text-blue-600"
                      >
                        cacc@ufc.br
                      </a>
                      <p className="text-gray-500 text-sm mt-1">
                        Respondemos em até 48 horas úteis
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="bg-blue-100 p-3 rounded-full">
                      <Phone className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">Telefone</h3>
                      <p className="text-gray-600">(85) 3366-9999</p>
                      <p className="text-gray-500 text-sm mt-1">
                        Horário de atendimento telefônico: 8h às 17h
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Redes sociais */}
              <div className="mt-8">
                <h3 className="text-lg font-semibold mb-4">Siga-nos nas redes sociais</h3>
                <div className="flex space-x-4">
                  <a 
                    href="https://instagram.com/caccomputacao" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="bg-blue-100 p-3 rounded-full hover:bg-blue-200 transition-colors"
                    aria-label="Instagram"
                  >
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      className="h-6 w-6 text-blue-600"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                    </svg>
                  </a>
                  
                  <a 
                    href="https://github.com/caccomputacao" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="bg-blue-100 p-3 rounded-full hover:bg-blue-200 transition-colors"
                    aria-label="GitHub"
                  >
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      className="h-6 w-6 text-blue-600"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                    </svg>
                  </a>
                  
                  <a 
                    href="https://twitter.com/caccomputacao" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="bg-blue-100 p-3 rounded-full hover:bg-blue-200 transition-colors"
                    aria-label="Twitter"
                  >
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      className="h-6 w-6 text-blue-600"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                    </svg>
                  </a>
                  
                  <a 
                    href="https://facebook.com/caccomputacao" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="bg-blue-100 p-3 rounded-full hover:bg-blue-200 transition-colors"
                    aria-label="Facebook"
                  >
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      className="h-6 w-6 text-blue-600"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mapa e localização */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 max-w-5xl">
          <h2 className="text-2xl font-bold mb-8 text-center">Como chegar ao Centro Acadêmico</h2>
          
          <div className="bg-gray-100 rounded-lg overflow-hidden h-96 relative">
            {/* Substitua pelo mapa real quando possível */}
            <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
              <div className="text-center p-6">
                <Image 
                  src="/imgs/ufclogo.png" 
                  alt="Mapa do Campus" 
                  width={200} 
                  height={200}
                  className="mx-auto mb-4"
                />
                <p className="text-gray-600 mb-2">Mapa do Campus do Pici - UFC</p>
                <p className="text-sm text-gray-500">
                  O Centro Acadêmico está localizado no Bloco 910, próximo ao Restaurante Universitário.
                </p>
              </div>
            </div>
          </div>
          
          <div className="mt-8 bg-blue-50 p-6 rounded-lg">
            <h3 className="text-xl font-bold mb-4">Como chegar</h3>
            
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold">De ônibus:</h4>
                <p className="text-gray-700">
                  Linhas que passam pelo Campus do Pici: 044 - Parangaba/Papicu/Praia de Iracema, 
                  078 - Antônio Bezerra/Unifor, 099 - Conjunto Ceará/Pici/Unifor.
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold">De carro:</h4>
                <p className="text-gray-700">
                  Estacionamento disponível em frente ao Bloco 910. Acesso principal pela Av. Humberto Monte.
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold">Pontos de referência:</h4>
                <p className="text-gray-700">
                  Próximo ao Restaurante Universitário e à Biblioteca do Centro de Ciências.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* FAQ - Perguntas frequentes */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 max-w-5xl">
          <h2 className="text-2xl font-bold mb-8 text-center">Perguntas Frequentes</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-bold mb-2">Quem pode procurar o Centro Acadêmico?</h3>
              <p className="text-gray-700">
                Qualquer estudante do curso de Ciência da Computação pode procurar o CA para obter auxílio, 
                fazer sugestões ou participar das atividades. Também atendemos professores e funcionários 
                da universidade.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-bold mb-2">Como posso participar da gestão do CA?</h3>
              <p className="text-gray-700">
                As eleições para a gestão do CA ocorrem anualmente. Para participar, você deve formar uma 
                chapa e se inscrever durante o período eleitoral. Fique atento aos comunicados!
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-bold mb-2">O CA oferece algum serviço aos estudantes?</h3>
              <p className="text-gray-700">
                Sim! Oferecemos empréstimo de livros, monitorias, armários para guardar material, 
                divulgação de oportunidades de estágio e muito mais. Consulte nossa página de serviços.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-bold mb-2">Como posso propor um evento ou projeto?</h3>
              <p className="text-gray-700">
                Envie sua proposta através do formulário de contato ou venha conversar pessoalmente 
                conosco na sede do CA. Estamos sempre abertos a novas ideias e iniciativas dos estudantes.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Call to Action */}
      <section className="py-12 bg-blue-600 text-white">
        <div className="container mx-auto px-4 max-w-5xl text-center">
          <h2 className="text-3xl font-bold mb-4">Venha nos visitar!</h2>
          <p className="text-lg max-w-2xl mx-auto mb-8">
            A sede do Centro Acadêmico está sempre de portas abertas para receber os estudantes.
            Venha conhecer nosso espaço e conversar pessoalmente com a nossa equipe.
          </p>
          <Link 
            href="/sobre"
            className="inline-block px-6 py-3 bg-white text-blue-600 font-bold rounded-lg hover:bg-blue-50 transition-colors"
          >
            Saiba mais sobre o CA
          </Link>
        </div>
      </section>
    </main>
  );
} 