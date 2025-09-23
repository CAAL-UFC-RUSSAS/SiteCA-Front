import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sobre o Centro Acadêmico',
  description: 'Conheça a história, missão e objetivos do Centro Acadêmico de Computação da UFC Campus Russas Ada Lovelace. Nossa representação estudantil e compromisso com a comunidade acadêmica.',
  keywords: [
    'sobre centro acadêmico',
    'história CAAL',
    'missão centro acadêmico',
    'representação estudantil UFC',
    'computação UFC Russas',
    'Ada Lovelace UFC',
    'Centro Acadêmico Ciência da Computação',
    'UFC Campus Russas',
    'estudantes computação'
  ],
  openGraph: {
    title: 'Sobre o Centro Acadêmico | CAAL UFC Russas',
    description: 'Conheça a história, missão e objetivos do Centro Acadêmico de Computação da UFC Campus Russas Ada Lovelace.',
    type: 'website',
    images: [
      {
        url: '/imgs/banner.jpg',
        width: 1200,
        height: 630,
        alt: 'Centro Acadêmico de Computação UFC Campus Russas',
      },
    ],
  },
  twitter: {
    title: 'Sobre o Centro Acadêmico | CAAL UFC Russas',
    description: 'Conheça a história, missão e objetivos do Centro Acadêmico de Computação da UFC Campus Russas Ada Lovelace.',
    images: ['/imgs/banner.jpg'],
  },
}

export default function SobreLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
