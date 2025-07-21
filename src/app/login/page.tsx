'use client';
import { login } from '../../services/api';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function LoginPage() {
  const router = useRouter();
  const { login: authLogin, isAuthenticated } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // Efeito para verificar se já está autenticado
  useEffect(() => {
    if (isAuthenticated) {
      console.log('Login - Usuário já autenticado, redirecionando...');
      router.replace('/dashboard');
    }
  }, [isAuthenticated, router]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      // Chama a função de login da API
      const data = await login(email, password);
      
      console.log('Dados recebidos do login:', data);
      
      // Usa o contexto de autenticação para fazer login
      authLogin(data.token, data.user.email);
      
      console.log('Login - Estado após autenticação:', {
        token: data.token,
        email: data.user.email,
        localStorage: {
          token: localStorage.getItem('authToken'),
          email: localStorage.getItem('userEmail')
        }
      });
      
      setMessage('Login bem-sucedido! Redirecionando...');
      
      // Redirecionamento direto
      window.location.href = '/dashboard';
    } catch (error: unknown) {
      if (error instanceof Error) {
        setMessage(`Erro: ${error.message}`);
      } else {
        setMessage('Erro desconhecido.');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-center pt-40 min-h-screen p-4 bg-gray-50">
      <main className="flex flex-col items-center bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-bold mb-6 text-black">Login</h1>

        <form onSubmit={handleLogin} className="flex flex-col gap-4 w-full">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              id="email"
              type="email"
              placeholder="Seu email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border border-gray-300 p-3 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Senha</label>
            <input
              id="password"
              type="password"
              placeholder="Sua senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full border border-gray-300 p-3 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className={`bg-indigo-600 text-white p-3 rounded-md hover:bg-indigo-700 transition-colors mt-2 font-medium ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        {message && (
          <div className={`mt-4 p-3 rounded-md w-full text-center ${message.includes('Erro') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
            {message}
          </div>
        )}
      </main>
    </div>
  );
}
