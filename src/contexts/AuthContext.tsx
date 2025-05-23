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

// Função para definir cookies
function setCookie(name: string, value: string, days: number = 7) {
  const expires = new Date();
  expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;secure;samesite=strict`;
}

// Função para obter cookies
function getCookie(name: string): string | null {
  const nameEQ = name + "=";
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}

// Função para deletar cookies
function deleteCookie(name: string) {
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Verifica se o usuário está autenticado ao carregar a página
  useEffect(() => {
    const checkAuth = async () => {
      // Primeiro verifica localStorage, depois cookies
      let token = localStorage.getItem('authToken');
      let email = localStorage.getItem('userEmail');
      
      if (!token) {
        token = getCookie('authToken');
        email = getCookie('userEmail');
      }
      
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
    
    // Salvar no localStorage
    localStorage.setItem('authToken', token);
    localStorage.setItem('userEmail', email);
    
    // Salvar nos cookies para o middleware
    setCookie('authToken', token, 7); // 7 dias
    setCookie('userEmail', email, 7);
    
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
    // Remover do localStorage
    localStorage.removeItem('authToken');
    localStorage.removeItem('userEmail');
    
    // Remover dos cookies
    deleteCookie('authToken');
    deleteCookie('userEmail');
    
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