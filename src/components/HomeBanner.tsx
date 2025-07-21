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
  src: "/imgs/BannerAda.png",
  href: "/",
  alt: "Banner Principal"
};

// Banners laterais padrão
const defaultSideBanners = [
  {
    src: "/imgs/Lojinha.png",
    href: "/loja",
    alt: "Banner Lateral 1"
  },
  {
    src: "/imgs/banner.png",
    href: "/",
    alt: "Banner Lateral 2"
  }
];

export function HomeBanner() {
  const [mainBanners, setMainBanners] = useState<Banner[]>([]);
  const [sideBanners, setSideBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  
  const plugin = useRef(
    Autoplay({ delay: 5000, stopOnInteraction: false })
  );

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

  return (
    <div className="bg-white flex flex-col lg:flex-row gap-5 h-[200px] lg:h-[300px]">
      {/* Painel Principal (70% em desktop, 100% em mobile) */}
      <div className="w-full lg:w-[70%]">
        <Carousel
          className="w-full h-full"
          plugins={[plugin.current]}
          opts={{
            align: "start",
            loop: true,
          }}
        >
          <CarouselContent>
            {/* Sempre inclui o banner padrão como primeiro item */}
            <CarouselItem>
              <Link href={defaultBanner.href} className="block relative w-full h-[200px] lg:h-[300px]">
                <Image
                  src={defaultBanner.src}
                  alt={defaultBanner.alt}
                  fill
                  className="object-cover "
                  priority={true}
                />
              </Link>
            </CarouselItem>
            
            {/* Banners dinâmicos da API */}
            {!loading && !error && mainBanners.map((banner) => (
              <CarouselItem key={banner.id}>
                <Link 
                  href={banner.link || '/'} 
                  className="block relative w-full h-[200px] lg:h-[300px]"
                >
                  <Image
                    src={banner.imagem_url || defaultBanner.src}
                    alt={banner.titulo}
                    fill
                    className="object-cover"
                  />
                </Link>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>

      {/* Painel Lateral (30% em desktop, 100% em mobile) */}
      <div className="w-full lg:w-[30%] flex flex-row lg:flex-col gap-5 h-[150px] lg:h-full">
        {!loading && !error && sideBanners.length > 0 ? 
          // Banners laterais da API se disponíveis
          sideBanners.slice(0, 2).map((banner) => (
            <Link 
              key={banner.id} 
              href={banner.link || '/'} 
              className="relative flex-1"
            >
              <Image
                src={banner.imagem_url || defaultBanner.src}
                alt={banner.titulo}
                fill
                className="object-cover"
              />
            </Link>
          ))
          : 
          // Banners laterais padrão como fallback
          defaultSideBanners.map((banner, index) => (
            <Link key={index} href={banner.href} className="relative flex-1">
              <Image
                src={banner.src}
                alt={banner.alt}
                fill
                className="object-cover "
              />
            </Link>
          ))
        }
      </div>
    </div>
  );
} 