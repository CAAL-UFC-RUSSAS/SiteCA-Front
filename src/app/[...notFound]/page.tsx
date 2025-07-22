'use client';

import { notFound } from 'next/navigation';

export default function CatchAllRoute() {
  // Redirecionar para a página 404
  notFound();
  
  // Este código nunca será executado devido ao notFound() acima,
  // mas é necessário para satisfazer o TypeScript
  return null;
} 