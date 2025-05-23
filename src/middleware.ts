import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const protectedRoutes = ['/dashboard'];
const publicRoutes = ['/login', '/'];

// Função para verificar se o token JWT está expirado
function isTokenExpired(token: string): boolean {
  try {
    const payload = token.split('.')[1];
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
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

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  
  // Buscar token do cookie ou header Authorization
  const authCookie = request.cookies.get('authToken');
  const authHeader = request.headers.get('authorization');
  
  let token = authCookie?.value;
  if (!token && authHeader?.startsWith('Bearer ')) {
    token = authHeader.slice(7);
  }
  
  // Verificar se está autenticado e se o token não está expirado
  const isAuthenticated = token && !isTokenExpired(token);

  const isProtected = protectedRoutes.some(route => path.startsWith(route));
  const isPublic = publicRoutes.some(route => path === route);

  if (isProtected && !isAuthenticated) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (isPublic && isAuthenticated) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/:path*', // Aplica o middleware a todas as rotas
};
