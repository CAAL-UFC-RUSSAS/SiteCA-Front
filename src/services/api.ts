import { Produto } from '@/types/produto';

// Forçar o uso da API local para desenvolvimento
const API_URL = process.env.NEXT_PUBLIC_API_URL;

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
    id: Number(produto.id),
    nome: String(produto.nome),
    descricao: String(produto.descricao || ''),
    ...produto,
    imagem: produto.imagem_nome 
      ? `${API_URL}/uploads/${produto.imagem_nome}`
      : undefined,
    preco: String(produto.preco),
    tags: Array.isArray(produto.tags) ? produto.tags : [],
    disponivel: Boolean(produto.disponivel),
    quantidade: Number(produto.quantidade),
    imagens: Array.isArray(produto.imagens) ? produto.imagens : []
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
  console.log('Enviando requisição para criar produto:', produto);
  const response = await fetch(`${API_URL}/produtos`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(produto),
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    console.error('Erro na resposta da API:', error);
    throw new Error(error.message || 'Erro ao criar produto');
  }
  const data = await response.json();
  console.log('Resposta da API:', data);
  return formatProduto(data);
}

export async function updateProduto(id: number, produto: Partial<Produto>): Promise<Produto> {
  console.log('Enviando requisição para atualizar produto:', { id, produto });
  const response = await fetch(`${API_URL}/produtos/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(produto),
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    console.error('Erro na resposta da API:', error);
    throw new Error(error.message || 'Erro ao atualizar produto');
  }
  const data = await response.json();
  console.log('Resposta da API:', data);
  return formatProduto(data);
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

// Banner types
export interface Banner {
  id: number;
  titulo: string;
  descricao?: string;
  link?: string;
  tipo: string;
  imagem?: string;
  imagem_nome?: string;
  imagem_mime?: string;
  imagem_url?: string;
  posicao: number;
  ativo: boolean;
  created_at?: string;
  updated_at?: string;
}

// Banner services
export const getBanners = async (): Promise<Banner[]> => {
  try {
    console.log('Enviando requisição para buscar banners:', `${API_URL}/banners`);
    console.log('Headers:', getAuthHeaders());
    
    const response = await fetch(`${API_URL}/banners`, {
      headers: getAuthHeaders()
    });
    
    console.log('Resposta recebida:', {
      status: response.status,
      statusText: response.statusText,
      ok: response.ok
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Erro desconhecido' }));
      console.error('Erro detalhado:', errorData);
      throw new Error(errorData.message || `Erro ao buscar banners: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('Dados recebidos:', data);
    
    // Garantir que retornamos um array
    if (!Array.isArray(data)) {
      console.warn('Resposta não é um array:', data);
      return [];
    }
    
    return data;
  } catch (error) {
    console.error('Erro ao buscar banners:', error);
    throw error;
  }
};

export const getBannersAtivos = async (): Promise<Banner[]> => {
  try {
    const response = await fetch(`${API_URL}/banners/ativos`, {
      headers: getAuthHeaders()
    });
    if (!response.ok) {
      throw new Error('Erro ao buscar banners ativos');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erro ao buscar banners ativos:', error);
    throw error;
  }
};

export const getBanner = async (id: number): Promise<Banner> => {
  try {
    const response = await fetch(`${API_URL}/banners/${id}`, {
      headers: getAuthHeaders()
    });
    if (!response.ok) {
      throw new Error('Erro ao buscar banner');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Erro ao buscar banner ${id}:`, error);
    throw error;
  }
};

export const createBanner = async (banner: Omit<Banner, 'id'>): Promise<Banner> => {
  try {
    const response = await fetch(`${API_URL}/banners`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(banner),
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || 'Erro ao criar banner');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erro ao criar banner:', error);
    throw error;
  }
};

export const updateBanner = async (id: number, banner: Partial<Banner>): Promise<Banner> => {
  try {
    const response = await fetch(`${API_URL}/banners/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(banner),
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || 'Erro ao atualizar banner');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Erro ao atualizar banner ${id}:`, error);
    throw error;
  }
};

export const deleteBanner = async (id: number): Promise<void> => {
  try {
    const response = await fetch(`${API_URL}/banners/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || 'Erro ao excluir banner');
    }
  } catch (error) {
    console.error(`Erro ao excluir banner ${id}:`, error);
    throw error;
  }
};

export const reordenarBanners = async (bannerIds: number[]): Promise<void> => {
  try {
    const response = await fetch(`${API_URL}/banners/reordenar`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ bannerIds }),
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || 'Erro ao reordenar banners');
    }
  } catch (error) {
    console.error('Erro ao reordenar banners:', error);
    throw error;
  }
};

// Aviso types
export interface Aviso {
  id: number;
  titulo: string;
  descricao?: string;
  link?: string;
  data_inicio: string;
  data_fim?: string;
  created_at?: string;
  updated_at?: string;
}

// Calendário acadêmico da UFC
export interface EventoCalendario {
  id: string;
  titulo: string;
  data: string;
  dataObj: Date;
  tipo: 'ufc';
}

// Aviso services
export const getAvisos = async (): Promise<Aviso[]> => {
  try {
    const response = await fetch(`${API_URL}/avisos`, {
      headers: getAuthHeaders()
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Erro desconhecido' }));
      throw new Error(errorData.message || `Erro ao buscar avisos: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erro ao buscar avisos:', error);
    throw error;
  }
};

export const getAvisosAtivos = async (): Promise<Aviso[]> => {
  try {
    const response = await fetch(`${API_URL}/avisos/ativos`, {
      headers: getAuthHeaders()
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Erro desconhecido' }));
      throw new Error(errorData.message || `Erro ao buscar avisos ativos: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erro ao buscar avisos ativos:', error);
    throw error;
  }
};

export const getAviso = async (id: number): Promise<Aviso> => {
  try {
    const response = await fetch(`${API_URL}/avisos/${id}`, {
      headers: getAuthHeaders()
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Erro desconhecido' }));
      throw new Error(errorData.message || `Erro ao buscar aviso: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erro ao buscar aviso:', error);
    throw error;
  }
};

export const createAviso = async (aviso: Omit<Aviso, 'id'>): Promise<Aviso> => {
  try {
    const response = await fetch(`${API_URL}/avisos`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(aviso)
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Erro desconhecido' }));
      throw new Error(errorData.message || `Erro ao criar aviso: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erro ao criar aviso:', error);
    throw error;
  }
};

export const updateAviso = async (id: number, aviso: Partial<Aviso>): Promise<Aviso> => {
  try {
    const response = await fetch(`${API_URL}/avisos/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(aviso)
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Erro desconhecido' }));
      throw new Error(errorData.message || `Erro ao atualizar aviso: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erro ao atualizar aviso:', error);
    throw error;
  }
};

export const deleteAviso = async (id: number): Promise<void> => {
  try {
    const response = await fetch(`${API_URL}/avisos/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Erro desconhecido' }));
      throw new Error(errorData.message || `Erro ao deletar aviso: ${response.status} ${response.statusText}`);
    }
  } catch (error) {
    console.error('Erro ao deletar aviso:', error);
    throw error;
  }
};

// Função para buscar o calendário acadêmico da UFC
export const getCalendarioUFC = async (): Promise<EventoCalendario[]> => {
  try {
    // Agora vamos usar a rota do backend que implementa o scraping
    const response = await fetch(`${API_URL}/calendario/ufc`, {
      headers: getAuthHeaders()
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Erro desconhecido' }));
      throw new Error(errorData.message || `Erro ao buscar calendário da UFC: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    
    // Converte objetos de data de string para Date
    return data.map((evento: EventoCalendario) => ({
      ...evento,
      dataObj: new Date(evento.dataObj)
    }));
  } catch (error) {
    console.error('Erro ao buscar calendário da UFC:', error);
    return getCalendarioUFCFallback();
  }
};

// Dados de fallback para o calendário da UFC caso o scraping falhe
function getCalendarioUFCFallback(): EventoCalendario[] {
  return [
    { 
      id: 'cal-1', 
      titulo: 'ERRO', 
      data: '12/02/2024', 
      dataObj: new Date('2024-02-12'),
      tipo: 'ufc'
    }
  ];
}
