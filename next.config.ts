/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3333',
        pathname: '/uploads/**',
      }
    ],
  },
  async rewrites() {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    return [
      {
        source: '/register',
        destination: `${apiUrl}/register`,
      },
      {
        source: '/login',
        destination: `${apiUrl}/login`,
      },
    ];
  },
};

// Configuração dinâmica para imagens baseada na variável de ambiente
if (process.env.NEXT_PUBLIC_API_URL) {
  const apiUrl = new URL(process.env.NEXT_PUBLIC_API_URL);
  // Adicionar a configuração da URL da API, se diferente de localhost
  if (apiUrl.hostname !== 'localhost') {
    nextConfig.images.remotePatterns.push({
      protocol: apiUrl.protocol.slice(0, -1) as 'http' | 'https',
      hostname: apiUrl.hostname,
      port: apiUrl.port || '',
      pathname: '/uploads/**',
    });
  }
}

module.exports = nextConfig;
