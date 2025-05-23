import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Rotas que exigem autenticação
const protectedRoutes = ['/dashboard'];

// Rotas públicas que não devem redirecionar para o dashboard se já estiver autenticado
const publicRoutes = ['/login', '/register'];

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  
  // Se estiver acessando uma rota protegida, permite o acesso
  // A verificação de autenticação será feita no lado do cliente
  if (protectedRoutes.some(route => path.startsWith(route))) {
    return NextResponse.next();
  }
  
  return NextResponse.next();
}

// Configurar os caminhos onde o middleware será executado
export const config = {
  matcher: [...protectedRoutes, ...publicRoutes],
}; 