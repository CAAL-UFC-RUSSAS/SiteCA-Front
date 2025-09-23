import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Loja do Centro Acadêmico',
  description: 'Loja oficial do Centro Acadêmico de Computação UFC Campus Russas. Camisetas, materiais didáticos, produtos personalizados e itens exclusivos do curso de Ciência da Computação.',
  keywords: [
    'loja centro acadêmico',
    'produtos UFC',
    'camisetas computação',
    'materiais didáticos',
    'produtos personalizados',
    'loja CAAL UFC Russas',
    'merchandising UFC',
    'produtos estudantis'
  ],
  openGraph: {
    title: 'Loja do Centro Acadêmico | CAAL UFC Russas',
    description: 'Loja oficial do Centro Acadêmico de Computação UFC Campus Russas. Produtos exclusivos e personalizados.',
    type: 'website',
    images: [
      {
        url: '/imgs/banner.jpg',
        width: 1200,
        height: 630,
        alt: 'Loja do Centro Acadêmico UFC Campus Russas',
      },
    ],
  },
  twitter: {
    title: 'Loja do Centro Acadêmico | CAAL UFC Russas',
    description: 'Loja oficial do Centro Acadêmico de Computação UFC Campus Russas. Produtos exclusivos e personalizados.',
    images: ['/imgs/banner.jpg'],
  },
}

export default function LojaLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
