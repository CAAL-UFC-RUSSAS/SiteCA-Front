'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Calendar, Clock, ArrowLeft, Share2, FileText, ExternalLink } from 'lucide-react';
import { getAviso } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import EventosSidebar from '@/components/EventosSidebar';

interface EventoDetalhesProps {
  params: {
    id: string;
  };
}

export default function EventoDetalhesPage({ params }: EventoDetalhesProps) {
  const router = useRouter();
  const [evento, setEvento] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvento = async () => {
      try {
        setLoading(true);
        const id = parseInt(params.id);
        if (isNaN(id)) {
          throw new Error('ID inválido');
        }
        
        const avisoData = await getAviso(id);
        
        // Formatar a data para exibição
        const dataInicio = new Date(avisoData.data_inicio);
        const dataFormatada = dataInicio.toLocaleDateString('pt-BR', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        });
        
        // Determinar o status do evento
        const hoje = new Date();
        let status: 'passado' | 'ativo' | 'futuro';
        
        if (dataInicio > hoje) {
          status = 'futuro';
        } else if (avisoData.data_fim) {
          const dataFim = new Date(avisoData.data_fim);
          status = dataFim >= hoje ? 'ativo' : 'passado';
        } else {
          status = 'ativo';
        }
        
        setEvento({
          ...avisoData,
          dataFormatada,
          status,
          dataFimFormatada: avisoData.data_fim 
            ? new Date(avisoData.data_fim).toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
              })
            : null
        });
        
        setError(null);
      } catch (err) {
        console.error('Erro ao buscar detalhes do evento:', err);
        setError('Não foi possível carregar os detalhes do evento.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchEvento();
  }, [params.id]);

  const compartilharEvento = () => {
    if (navigator.share) {
      navigator.share({
        title: evento?.titulo || 'Evento do Centro Acadêmico',
        text: evento?.descricao || 'Confira este evento do Centro Acadêmico!',
        url: window.location.href,
      })
      .catch((error) => console.log('Erro ao compartilhar', error));
    } else {
      // Fallback para navegadores que não suportam a API Web Share
      navigator.clipboard.writeText(window.location.href)
        .then(() => alert('Link copiado para a área de transferência!'))
        .catch(() => alert('Não foi possível copiar o link.'));
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-20 flex justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !evento) {
    return (
      <div className="container mx-auto px-4 py-10 text-center">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Evento não encontrado</h1>
        <p className="mb-6">{error || 'Não foi possível encontrar o evento solicitado.'}</p>
        <Button 
          onClick={() => router.push('/eventos')}
          variant="outline"
        >
          Voltar para lista de eventos
        </Button>
      </div>
    );
  }

  const getBadgeColor = () => {
    switch(evento.status) {
      case 'ativo': return 'bg-green-100 text-green-800 border-green-300';
      case 'futuro': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'passado': return 'bg-gray-100 text-gray-800 border-gray-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getStatusText = () => {
    switch(evento.status) {
      case 'ativo': return 'Em andamento';
      case 'futuro': return 'Evento futuro';
      case 'passado': return 'Evento encerrado';
      default: return 'Status desconhecido';
    }
  };

  return (
    <>
      <EventosSidebar />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-6">
          <Link 
            href="/eventos"
            className="inline-flex items-center text-blue-600 hover:text-blue-800"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Voltar para eventos
          </Link>
        </div>
        
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="border-b border-gray-200 p-6">
            <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold">{evento.titulo}</h1>
                
                <div className="flex flex-wrap gap-3 mt-3">
                  <div className="flex items-center gap-1.5 text-gray-700">
                    <Calendar className="h-5 w-5 text-gray-500" />
                    <span>
                      {evento.dataFormatada}
                      {evento.dataFimFormatada && ` até ${evento.dataFimFormatada}`}
                    </span>
                  </div>
                  
                  <Badge className={`${getBadgeColor()} border px-2.5 py-0.5`}>
                    {getStatusText()}
                  </Badge>
                </div>
              </div>
              
              <Button 
                onClick={compartilharEvento}
                variant="outline"
                size="sm"
                className="flex items-center gap-2 self-start"
              >
                <Share2 className="h-4 w-4" />
                Compartilhar
              </Button>
            </div>
          </div>
          
          <div className="p-6">
            <div className="prose max-w-none">
              <h2 className="text-xl font-semibold mb-4">Detalhes do Evento</h2>
              
              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <div className="flex items-start gap-3">
                  <FileText className="h-5 w-5 text-gray-500 mt-0.5" />
                  <div className="flex-1">
                    <p className="whitespace-pre-line">
                      {evento.descricao || "Não há descrição detalhada disponível para este evento."}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            {evento.link && (
              <div className="mt-8 p-4 border rounded-lg">
                <h3 className="font-bold mb-3">Links Relacionados</h3>
                <a 
                  href={evento.link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 flex items-center gap-1.5"
                >
                  <ExternalLink className="h-4 w-4" />
                  {evento.link}
                </a>
              </div>
            )}
            
            <div className="mt-8 pt-6 border-t">
              <h3 className="font-bold mb-3">Organização</h3>
              <p>Este evento é organizado pelo Centro Acadêmico de Ciência da Computação.</p>
              
              <div className="mt-4">
                <Link 
                  href="/contato" 
                  className="text-blue-600 hover:text-blue-800"
                >
                  Precisa de mais informações? Entre em contato
                </Link>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-10">
          <Button 
            onClick={() => router.push('/eventos')}
            variant="default"
            className="bg-blue-600 hover:bg-blue-700"
          >
            Ver todos os eventos
          </Button>
        </div>
      </main>
    </>
  );
} 