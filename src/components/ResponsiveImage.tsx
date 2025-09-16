'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';

interface ResponsiveImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  priority?: boolean;
  sizes?: string;
}

export default function ResponsiveImage({ 
  src, 
  alt, 
  width, 
  height, 
  className = '', 
  priority = false,
  sizes = "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
}: ResponsiveImageProps) {
  const [quality, setQuality] = useState(85);
  const [screenSize, setScreenSize] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');

  useEffect(() => {
    const updateQuality = () => {
      const width = window.innerWidth;
      
      if (width < 768) {
        // Mobile: qualidade menor para economizar dados
        setQuality(75);
        setScreenSize('mobile');
      } else if (width < 1200) {
        // Tablet: qualidade média
        setQuality(85);
        setScreenSize('tablet');
      } else {
        // Desktop: qualidade alta
        setQuality(95);
        setScreenSize('desktop');
      }
    };

    // Definir qualidade inicial
    updateQuality();

    // Adicionar listener para mudanças de tamanho
    window.addEventListener('resize', updateQuality);

    // Cleanup
    return () => window.removeEventListener('resize', updateQuality);
  }, []);

  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      priority={priority}
      sizes={sizes}
      quality={quality}
      // Adicionar atributo data para debug (opcional)
      data-screen-size={screenSize}
      data-quality={quality}
    />
  );
}
