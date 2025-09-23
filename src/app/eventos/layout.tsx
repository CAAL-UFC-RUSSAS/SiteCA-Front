import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Eventos do Centro Acadêmico',
  description: 'Calendário de eventos, workshops, palestras e atividades do Centro Acadêmico de Computação UFC Campus Russas. Fique por dentro de tudo que acontece no curso.',
  keywords: [
    'eventos UFC',
    'calendário acadêmico',
    'workshops computação',
    'palestras UFC Russas',
    'eventos CAAL',
    'atividades estudantis',
    'programação UFC'
  ],
  openGraph: {
    title: 'Eventos | CAAL UFC Russas',
    description: 'Calendário de eventos, workshops, palestras e atividades do Centro Acadêmico de Computação UFC Campus Russas.',
    type: 'website',
    images: [
      {
        url: '/imgs/banner.jpg',
        width: 1200,
        height: 630,
        alt: 'Eventos do Centro Acadêmico UFC Campus Russas',
      },
    ],
  },
  twitter: {
    title: 'Eventos | CAAL UFC Russas',
    description: 'Calendário de eventos, workshops, palestras e atividades do Centro Acadêmico de Computação UFC Campus Russas.',
    images: ['/imgs/banner.jpg'],
  },
}

export default function EventosLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
