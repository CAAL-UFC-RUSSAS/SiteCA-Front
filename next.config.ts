/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [],
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
  nextConfig.images.remotePatterns = [
    {
      protocol: apiUrl.protocol.slice(0, -1) as 'http' | 'https',
      hostname: apiUrl.hostname,
      port: apiUrl.port || undefined,
      pathname: '/uploads/**',
    },
  ] as any;
}

module.exports = nextConfig;
