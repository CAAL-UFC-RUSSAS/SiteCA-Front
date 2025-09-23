import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contato - Centro Acadêmico',
  description: 'Entre em contato com o Centro Acadêmico de Computação UFC Campus Russas. Formulário de contato, localização, horários de funcionamento e informações de contato.',
  keywords: [
    'contato centro acadêmico',
    'fale conosco UFC',
    'localização UFC Russas',
    'horário funcionamento CAAL',
    'telefone centro acadêmico',
    'email CAAL UFC'
  ],
  openGraph: {
    title: 'Contato | CAAL UFC Russas',
    description: 'Entre em contato com o Centro Acadêmico de Computação UFC Campus Russas. Formulário de contato e informações.',
    type: 'website',
    images: [
      {
        url: '/imgs/banner.jpg',
        width: 1200,
        height: 630,
        alt: 'Contato Centro Acadêmico UFC Campus Russas',
      },
    ],
  },
  twitter: {
    title: 'Contato | CAAL UFC Russas',
    description: 'Entre em contato com o Centro Acadêmico de Computação UFC Campus Russas. Formulário de contato e informações.',
    images: ['/imgs/banner.jpg'],
  },
}

export default function ContatoLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
