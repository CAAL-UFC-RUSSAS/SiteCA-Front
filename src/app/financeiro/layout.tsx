import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Financeiro - Centro Acadêmico',
  description: 'Prestação de contas e transparência financeira do Centro Acadêmico de Computação UFC Campus Russas. Relatórios financeiros e gestão transparente dos recursos.',
  keywords: [
    'prestação de contas',
    'transparência financeira',
    'relatórios CAAL',
    'gestão financeira UFC',
    'recursos centro acadêmico',
    'transparência estudantil'
  ],
  openGraph: {
    title: 'Financeiro | CAAL UFC Russas',
    description: 'Prestação de contas e transparência financeira do Centro Acadêmico de Computação UFC Campus Russas.',
    type: 'website',
    images: [
      {
        url: '/imgs/banner.jpg',
        width: 1200,
        height: 630,
        alt: 'Financeiro Centro Acadêmico UFC Campus Russas',
      },
    ],
  },
  twitter: {
    title: 'Financeiro | CAAL UFC Russas',
    description: 'Prestação de contas e transparência financeira do Centro Acadêmico de Computação UFC Campus Russas.',
    images: ['/imgs/banner.jpg'],
  },
}

export default function FinanceiroLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
