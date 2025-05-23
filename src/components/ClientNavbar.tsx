'use client';

import { usePathname } from 'next/navigation';
import Navbar from '@/components/Navbar';

export default function ClientNavbar() {
    const pathname = usePathname();

    // Caso queira ocultar a navbar para todas as rotas que iniciam com '/admin'
    const showNavbar = !pathname.startsWith('/admin') && !pathname.startsWith('/loja');

    return showNavbar ? <Navbar /> : null;
}
