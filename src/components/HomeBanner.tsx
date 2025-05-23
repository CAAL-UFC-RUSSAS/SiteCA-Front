'use client';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Image from "next/image";
import Link from "next/link";
import Autoplay from "embla-carousel-autoplay";
import { useRef } from "react";

const bannerImages = [
  {
    src: "/imgs/banner.png",
    href: "/",
    alt: "Banner Principal 1"
  },
  {
    src: "/imgs/banner.png",
    href: "/",
    alt: "Banner Principal 2"
  },
  {
    src: "/imgs/banner.png",
    href: "/",
    alt: "Banner Principal 3"
  },
  {
    src: "/imgs/banner.png",
    href: "/",
    alt: "Banner Principal 4"
  }
];

const sideBanners = [
  {
    src: "/imgs/banner.png",
    href: "/",
    alt: "Banner Lateral 1"
  },
  {
    src: "/imgs/banner.png",
    href: "/",
    alt: "Banner Lateral 2"
  }
];

export function HomeBanner() {
  const plugin = useRef(
    Autoplay({ delay: 5000, stopOnInteraction: false })
  );

  return (
    <div className="flex flex-col lg:flex-row gap-5 h-[200px] lg:h-[300px]">
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
            {bannerImages.map((banner, index) => (
              <CarouselItem key={index}>
                <Link href={banner.href} className="block relative w-full h-[200px] lg:h-[300px]">
                  <Image
                    src={banner.src}
                    alt={banner.alt}
                    fill
                    className="object-cover rounded-lg"
                    priority={index === 0}
                  />
                </Link>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>

      {/* Painel Lateral (30% em desktop, 100% em mobile) */}
      <div className="w-full lg:w-[30%] flex flex-row lg:flex-col gap-5 h-[150px] lg:h-full">
        {sideBanners.map((banner, index) => (
          <Link key={index} href={banner.href} className="relative flex-1">
            <Image
              src={banner.src}
              alt={banner.alt}
              fill
              className="object-cover rounded-lg"
            />
          </Link>
        ))}
      </div>
    </div>
  );
} 