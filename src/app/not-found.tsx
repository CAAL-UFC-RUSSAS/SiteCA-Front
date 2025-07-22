'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function NotFound() {
  const router = useRouter();

  // Redirecionar para a página inicial após 5 segundos
  useEffect(() => {
    const redirectTimeout = setTimeout(() => {
      router.push('/');
    }, 5000);

    // Limpar o timeout se o componente for desmontado
    return () => clearTimeout(redirectTimeout);
  }, [router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <div className="text-center max-w-md">
        <h1 className="text-6xl font-bold text-indigo-600 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">Página não encontrada</h2>
        <p className="text-gray-600 mb-8">
          A página que você está procurando não existe ou está em desenvolvimento.
          Você será redirecionado para a página inicial em 5 segundos.
        </p>
        <div className="w-full bg-gray-200 h-1 mb-6 rounded-full overflow-hidden">
          <div 
            className="bg-indigo-600 h-full rounded-full transition-all duration-5000 ease-linear"
            style={{ 
              width: '100%', 
              animation: 'countdown 5s linear forwards' 
            }}
          />
        </div>
        <Link 
          href="/"
          className="inline-block bg-indigo-600 text-white font-medium px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Voltar para a página inicial
        </Link>
      </div>

      <style jsx>{`
        @keyframes countdown {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>
    </div>
  );
} 