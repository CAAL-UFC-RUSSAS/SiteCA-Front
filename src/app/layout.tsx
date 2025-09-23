import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ClientLayout from '@/components/ClientLayout';
import { AuthProvider } from '@/contexts/AuthContext';
import { ToastContainer } from '@/components/ui/toast';
import { Analytics } from "@vercel/analytics/next";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Centro Acadêmico de Computação UFC Campus Russas - Ada Lovelace",
    template: "%s | CAAL UFC Russas"
  },
  description: "Portal oficial do Centro Acadêmico de Computação da UFC Campus Russas Ada Lovelace. Representação estudantil, eventos, serviços e comunidade acadêmica do curso de Ciência da Computação.",
  keywords: [
    "Centro Acadêmico",
    "Computação",
    "UFC",
    "Campus Russas",
    "Ada Lovelace",
    "Ciência da Computação",
    "Estudantes",
    "Representação estudantil",
    "Eventos acadêmicos",
    "Ceará",
    "Universidade Federal do Ceará"
  ],
  authors: [{ name: "Centro Acadêmico de Computação UFC Russas" }],
  creator: "CAAL UFC Russas",
  publisher: "Centro Acadêmico de Computação UFC Campus Russas",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://caal-ufc-russas.vercel.app'),
  alternates: {
    canonical: '/',
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/apple-icon.png',
  },
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: 'https://caal-ufc-russas.vercel.app',
    title: 'Centro Acadêmico de Computação UFC Campus Russas - Ada Lovelace',
    description: 'Portal oficial do Centro Acadêmico de Computação da UFC Campus Russas Ada Lovelace. Representação estudantil, eventos, serviços e comunidade acadêmica.',
    siteName: 'CAAL UFC Russas',
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
    card: 'summary_large_image',
    title: 'Centro Acadêmico de Computação UFC Campus Russas - Ada Lovelace',
    description: 'Portal oficial do Centro Acadêmico de Computação da UFC Campus Russas Ada Lovelace.',
    images: ['/imgs/banner.jpg'],
    creator: '@caal_ufc_russas',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'seu-codigo-google-search-console',
    yandex: 'seu-codigo-yandex',
    yahoo: 'seu-codigo-yahoo',
  },
  category: 'education',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <AuthProvider>
          <ClientLayout>
            {children}
            <ToastContainer />
          </ClientLayout>
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  );
}
