'use client';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Image from "next/image";
import Link from "next/link";
import Autoplay from "embla-carousel-autoplay";
import { useEffect, useRef, useState } from "react";
import { Banner, getBannersAtivos } from "@/services/api";

// Banner estático para usar como fallback/primeiro item
const defaultBanner = {
  id: 0,
  src: "/imgs/BannerAda.png",
  href: "/",
  alt: "Banner Principal"
};

// Banners laterais padrão
const defaultSideBanners = [
  {
    id: 1,
    src: "/imgs/Lojinha.png",
    href: "/loja",
    alt: "Banner Lateral 1"
  },
  {
    id: 2,
    src: "/imgs/impressao5.png",
    href: "/servicos",
    alt: "Banner Lateral 2"
  }
];

// Tipo para unificar banners da API e banners padrão
type BannerDisplay = {
  id?: number;
  imagem_url?: string;
  src?: string;
  link?: string;
  href?: string;
  titulo?: string;
  alt?: string;
  tipo?: string;
  mobileId?: string;
};

// Componente de carrossel com autoplay forçado
function AutoplayCarousel({ 
  children, 
  className = "",
  delay = 3000
}: { 
  children: React.ReactNode, 
  className?: string,
  delay?: number
}) {
  const autoplayRef = useRef(
    Autoplay({ 
      delay, 
      stopOnInteraction: false,
      stopOnMouseEnter: false,
      playOnInit: true
    })
  );

  return (
    <Carousel
      className={className}
      plugins={[autoplayRef.current]}
      opts={{
        align: "start",
        loop: true,
      }}
    >
      {children}
    </Carousel>
  );
}

export function HomeBanner() {
  const [mainBanners, setMainBanners] = useState<Banner[]>([]);
  const [sideBanners, setSideBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        setLoading(true);
        const banners = await getBannersAtivos();
        
        // Separar banners por tipo
        const principalBanners = banners.filter(banner => banner.tipo === 'principal');
        const lateralBanners = banners.filter(banner => banner.tipo === 'lateral');
        
        setMainBanners(principalBanners);
        setSideBanners(lateralBanners);
      } catch (err) {
        console.error("Erro ao carregar banners:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchBanners();
  }, []);

  // Preparar banners laterais
  const sideBannersToShow: BannerDisplay[] = !loading && !error && sideBanners.length > 0
    ? sideBanners
    : defaultSideBanners.map((banner) => ({
        ...banner,
        tipo: 'lateral'
      }));

  // Preparar todos os banners para o carrossel principal
  const allMainBanners: BannerDisplay[] = [
    { ...defaultBanner, tipo: 'principal' }, 
    ...(!loading && !error ? mainBanners.map(banner => ({
      id: banner.id,
      src: banner.imagem_url,
      href: banner.link || '/',
      alt: banner.titulo,
      tipo: 'principal'
    })) : [])
  ];

  // Adicionar os banners laterais para dispositivos móveis
  const allMobileBanners: BannerDisplay[] = [
    ...allMainBanners,
    ...sideBannersToShow.map((banner, index) => ({
      ...banner,
      mobileId: `mobile-side-${index}`
    }))
  ];

  return (
    <div className="bg-white flex flex-col lg:flex-row gap-5 h-auto">
      {/* Carrossel para telas grandes */}
      <div className="hidden lg:block w-[70%] h-[300px]">
        <AutoplayCarousel className="w-full h-full" delay={4000}>
          <CarouselContent>
            {allMainBanners.map((banner, index) => (
              <CarouselItem key={`desktop-${banner.id || index}-${banner.tipo}`}>
                <Link 
                  href={banner.href || banner.link || '/'} 
                  className="block relative w-full h-[300px]"
                >
                  <Image
                    src={banner.src || banner.imagem_url || defaultBanner.src}
                    alt={banner.alt || banner.titulo || 'Banner'}
                    fill
                    className="object-cover"
                    priority={index === 0}
                  />
                </Link>
              </CarouselItem>
            ))}
          </CarouselContent>
        </AutoplayCarousel>
      </div>

      {/* Carrossel para dispositivos móveis */}
      <div className="lg:hidden w-full h-[200px]">
        <AutoplayCarousel className="w-full h-full" delay={3000}>
          <CarouselContent>
            {allMobileBanners.map((banner, index) => (
              <CarouselItem key={`mobile-${banner.mobileId || banner.id || `unique-${index}`}-${banner.tipo}`}>
                <Link 
                  href={banner.href || banner.link || '/'} 
                  className="block relative w-full h-[200px]"
                >
                  <Image
                    src={banner.src || banner.imagem_url || defaultBanner.src}
                    alt={banner.alt || banner.titulo || 'Banner'}
                    fill
                    className="object-cover"
                  />
                </Link>
              </CarouselItem>
            ))}
          </CarouselContent>
        </AutoplayCarousel>
      </div>

      {/* Painel Lateral (30% em desktop, oculto em mobile pois já está no carrossel) */}
      <div className="hidden lg:flex lg:w-[30%] flex-col gap-5 h-[300px]">
        {sideBannersToShow.slice(0, 2).map((banner, index) => (
          <Link 
            key={`side-${banner.id || index}-${banner.tipo}`} 
            href={banner.link || banner.href || '/'} 
            className="relative flex-1 h-[145px]"
          >
            <Image
              src={banner.imagem_url || banner.src || defaultBanner.src}
              alt={banner.titulo || banner.alt || `Banner lateral ${index + 1}`}
              fill
              className="object-cover"
            />
          </Link>
        ))}
      </div>
    </div>
  );
} 