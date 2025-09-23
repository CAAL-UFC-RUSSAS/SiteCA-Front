import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Login - Centro Acadêmico',
  description: 'Acesso ao portal do Centro Acadêmico de Computação UFC Campus Russas. Faça login para acessar serviços exclusivos para membros.',
  keywords: [
    'login centro acadêmico',
    'acesso CAAL',
    'portal estudantil',
    'autenticação UFC',
    'área do membro'
  ],
  openGraph: {
    title: 'Login | CAAL UFC Russas',
    description: 'Acesso ao portal do Centro Acadêmico de Computação UFC Campus Russas.',
    type: 'website',
  },
  twitter: {
    title: 'Login | CAAL UFC Russas',
    description: 'Acesso ao portal do Centro Acadêmico de Computação UFC Campus Russas.',
  },
  robots: {
    index: false,
    follow: false,
  },
}

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
