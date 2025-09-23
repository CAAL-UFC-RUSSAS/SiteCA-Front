import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Serviços do Centro Acadêmico',
  description: 'Serviços oferecidos pelo Centro Acadêmico de Computação UFC Campus Russas. Impressão, suporte estudantil, orientações acadêmicas e outros serviços para estudantes.',
  keywords: [
    'serviços centro acadêmico',
    'impressão UFC',
    'suporte estudantil',
    'orientações acadêmicas',
    'serviços CAAL',
    'auxílio estudante UFC'
  ],
  openGraph: {
    title: 'Serviços | CAAL UFC Russas',
    description: 'Serviços oferecidos pelo Centro Acadêmico de Computação UFC Campus Russas. Impressão, suporte e orientações.',
    type: 'website',
    images: [
      {
        url: '/imgs/banner.jpg',
        width: 1200,
        height: 630,
        alt: 'Serviços do Centro Acadêmico UFC Campus Russas',
      },
    ],
  },
  twitter: {
    title: 'Serviços | CAAL UFC Russas',
    description: 'Serviços oferecidos pelo Centro Acadêmico de Computação UFC Campus Russas. Impressão, suporte e orientações.',
    images: ['/imgs/banner.jpg'],
  },
}

export default function ServicosLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
