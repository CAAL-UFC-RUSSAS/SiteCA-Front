/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['siteca-back.onrender.com', 'localhost'],
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'siteca-back.onrender.com',
        port: '',
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'siteca-back.onrender.com',
        port: '',
        pathname: '/uploads/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3001',
        pathname: '/uploads/**',
      }
    ],
  },
  reactStrictMode: true,
};

module.exports = nextConfig; 