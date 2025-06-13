'use client';

import { usePathname } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { useEffect, useState } from 'react';

export default function ClientNavbar() {
    const pathname = usePathname();
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768); // 768px é o breakpoint md do Tailwind
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);

        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Oculta a navbar para rotas admin, loja e dashboard em mobile
    const showNavbar = !pathname.startsWith('/admin') && 
                      !pathname.startsWith('/loja') && 
                      !(isMobile && pathname.startsWith('/dashboard'));

    return showNavbar ? <Navbar /> : null;
}
