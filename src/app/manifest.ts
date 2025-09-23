import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Centro Acadêmico de Computação UFC Campus Russas - Ada Lovelace',
    short_name: 'CAAL UFC Russas',
    description: 'Portal oficial do Centro Acadêmico de Computação da UFC Campus Russas Ada Lovelace',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#4f46e5',
    orientation: 'portrait',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
    categories: ['education', 'academic', 'university'],
    lang: 'pt-BR',
    scope: '/',
  }
}
