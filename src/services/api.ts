import { Produto } from '@/types/produto';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333';

// Função para verificar se o token está expirado
export function isTokenExpired(token: string): boolean {
  try {
    const payload = token.split('.')[1];
    const base64Url = payload;
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );

    const { exp } = JSON.parse(jsonPayload);
    const expired = Date.now() >= exp * 1000;
    return expired;
  } catch {
    // Se não conseguir decodificar, considera expirado por segurança
    return true;
  }
}

// Função para obter o token, verificando se está expirado
export function getAuthToken(): string | null {
  const token = localStorage.getItem('authToken');
  if (!token) return null;
  
  // Verifica se o token está expirado
  if (isTokenExpired(token)) {
    // Remove token expirado
    localStorage.removeItem('authToken');
    localStorage.removeItem('userEmail');
    return null;
  }
  
  return token;
}

// Função para criar cabeçalhos de autenticação
export function getAuthHeaders(): HeadersInit {
  const token = getAuthToken();
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
}

// Função para formatar um produto da API para o formato do frontend
export function formatProduto(produto: Record<string, unknown>): Produto {
  return {
    ...produto,
    imagem: produto.imagem_nome 
      ? `${API_URL}/uploads/${produto.imagem_nome}`
      : undefined,
    preco: String(produto.preco),
    tags: Array.isArray(produto.tags) ? produto.tags : [],
    disponivel: Boolean(produto.disponivel),
    quantidade: Number(produto.quantidade)
  } as Produto;
}

// Função para buscar todos os produtos
export async function getProdutos(): Promise<Produto[]> {
  const response = await fetch(`${API_URL}/produtos`, {
    headers: getAuthHeaders()
  });
  if (!response.ok) {
    throw new Error('Erro ao buscar produtos');
  }
  const data = await response.json();
  return data.map(formatProduto);
}

// Função para buscar um produto específico
export async function getProduto(id: string): Promise<Produto> {
  const response = await fetch(`${API_URL}/produtos/${id}`, {
    headers: getAuthHeaders()
  });
  if (!response.ok) {
    throw new Error('Erro ao buscar produto');
  }
  const data = await response.json();
  return formatProduto(data);
}

export async function register(email: string, password: string) {
  try {
    const response = await fetch(`${API_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Erro no registro.');
    }

    return data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(error.message || 'Erro de conexão.');
    } else {
      throw new Error('Erro desconhecido ao registrar.');
    }
  }
}

export async function login(email: string, password: string) {
  try {
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      // Tratamento específico para diferentes tipos de erro
      if (response.status === 401) {
        throw new Error('Email ou senha incorretos.');
      } else if (response.status === 403) {
        throw new Error('Conta bloqueada. Entre em contato com o suporte.');
      } else {
        throw new Error(data.message || 'Erro no login.');
      }
    }

    // Garante que temos o token e o usuário
    if (!data.token || !data.user) {
      throw new Error('Resposta inválida do servidor');
    }

    return {
      token: data.token,
      user: data.user
    };
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(error.message || 'Erro de conexão.');
    } else {
      throw new Error('Erro desconhecido ao fazer login.');
    }
  }
}

export async function createProduto(produto: Omit<Produto, 'id'>): Promise<Produto> {
  const response = await fetch(`${API_URL}/produtos`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(produto),
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || 'Erro ao criar produto');
  }
  const data = await response.json();
  return formatProduto(data);
}

export async function updateProduto(id: number, produto: Partial<Produto>): Promise<Produto> {
  try {
    console.log('Enviando dados para atualização:', {
      id,
      produto,
      headers: getAuthHeaders()
    });

    const response = await fetch(`${API_URL}/produtos/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(produto),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Erro na resposta:', {
        status: response.status,
        statusText: response.statusText,
        error: errorData
      });
      throw new Error(errorData.message || 'Erro ao atualizar produto');
    }

    const data = await response.json();
    return formatProduto(data);
  } catch (error) {
    console.error('Erro ao atualizar produto:', error);
    throw error;
  }
}

export async function deleteProduto(id: number): Promise<void> {
  const response = await fetch(`${API_URL}/produtos/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders()
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || 'Erro ao deletar produto');
  }
}
