'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

/**
 * Hook para proteger rotas que requerem autenticação
 * @param redirectTo Rota para redirecionamento se não estiver autenticado (padrão: /login)
 * @returns Um objeto com o estado de carregamento e se o usuário está autenticado
 */
export function useRequireAuth(redirectTo = '/login') {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    // Se ainda estiver carregando, aguarda
    if (isLoading) return;

    // Se terminou de carregar e não está autenticado, redireciona
    if (!isAuthenticated) {
      router.push(redirectTo);
    } else {
      // Terminou todas as verificações
      setChecking(false);
    }
  }, [isLoading, isAuthenticated, router, redirectTo]);

  return {
    user,
    isLoading: isLoading || checking, // Ainda está carregando se estiver verificando
    isAuthenticated
  };
} 