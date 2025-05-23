'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

type User = {
  email: string;
  nome?: string;
};

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string, email: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Verifica se o usuário está autenticado ao carregar a página
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('authToken');
      const email = localStorage.getItem('userEmail');
      
      if (token && email) {
        // Em produção, você faria uma chamada à API para validar o token e obter dados do usuário
        setUser({ email, nome: 'Usuário CACC' });
      }
      
      setIsLoading(false);
    };
    
    checkAuth();
  }, []);

  // Função para realizar login
  const login = (token: string, email: string) => {
    console.log('AuthContext - Login iniciado:', { token, email });
    
    localStorage.setItem('authToken', token);
    localStorage.setItem('userEmail', email);
    
    // Em produção, você definiria o usuário com base nos dados retornados pela API
    setUser({ email, nome: 'Usuário CACC' });
    setIsLoading(false);
    
    console.log('AuthContext - Estado após login:', {
      user: { email, nome: 'Usuário CACC' },
      isLoading: false,
      isAuthenticated: true
    });
  };

  // Função para realizar logout
  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userEmail');
    setUser(null);
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook personalizado para facilitar o uso do contexto
export function useAuth() {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  
  return context;
} 