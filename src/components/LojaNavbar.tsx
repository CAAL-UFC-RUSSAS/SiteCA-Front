'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export default function LojaNavbar() {
    const [searchTerm, setSearchTerm] = useState('');
    const [isSearchExpanded, setIsSearchExpanded] = useState(false);
    const [cartCount, setCartCount] = useState(0);
    const router = useRouter();
    const pathname = usePathname();
    
    const isCartPage = pathname === '/loja/carrinho';

    useEffect(() => {
        // Carregar contagem do carrinho do localStorage
        const updateCartCount = () => {
            const cart = JSON.parse(localStorage.getItem('cart') || '[]');
            setCartCount(cart.length);
        };
        
        // Atualizar contador ao montar o componente
        updateCartCount();
        
        // Adicionar listener para atualizar o contador quando o localStorage mudar
        window.addEventListener('storage', updateCartCount);
        
        // Evento personalizado para atualizações do carrinho
        window.addEventListener('cartUpdated', updateCartCount);
        
        return () => {
            window.removeEventListener('storage', updateCartCount);
            window.removeEventListener('cartUpdated', updateCartCount);
        };
    }, []);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            router.push(`/loja/busca?q=${encodeURIComponent(searchTerm.trim())}`);
            setIsSearchExpanded(false);
        }
    };

    const toggleSearch = () => {
        setIsSearchExpanded(!isSearchExpanded);
    };

    const handleCartClick = () => {
        router.push('/loja/carrinho');
    };

    return (
        <nav className="navbar bg-gradient-to-t from-[#f35b5a] via-[#de4a4a] to-[#b43838] shadow-md px-4 lg:px-6 py-2 lg:py-8 relative z-50">
            <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
                {/* Logo */}
                <div className="flex items-center">
                    <Link href="/" className="text-2xl font-bold text-black flex items-center">
                        <Image
                            src="/logoCAAL.svg"
                            alt="Logo"
                            width={40}      
                            height={50}
                            className="lg:hidden"
                        />
                    </Link>
                    
                    <Link href="/" className="text-2xl font-bold text-black flex items-center">
                        <Image
                            src="/logoCAAL.svg"
                            alt="Logo"
                            width={60}      
                            height={70}
                            className="hidden lg:block"
                        />
                        {isCartPage && (
                        <span className="ml-2 text-xl font-semibold">| Carrinho de compras</span>
                    )}
                                        {!isCartPage && (
                        <span className="ml-2 text2xl font-bold lg:hidden text-white">Lojinha do CA</span>
                    )}
                    </Link>

                </div>

                {/* Título e Buscador Desktop */}
                {!isCartPage && (
                    <Link href="/loja" className="hidden lg:block m-[-60px] mt-[-40px] ml-[-150px] mr-0">
                        <Image
                            src="/lojinhadoCA.svg"
                            alt="Logo"
                            width={350} 
                            height={40}
                            priority 
                        />
                    </Link>
                )}
                
                {/* Buscador Desktop */}
                <div className="hidden lg:flex flex-col items-center mr-[-240px]">
                    <form onSubmit={handleSearch} className="flex items-center gap-2 mt-2 text-white">
                        <input
                            type="text"
                            placeholder="Buscar produtos..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="px-4 py-2 border border-gray-300  rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent w-96 text-xl text-white"
                        />
                        <button
                            type="submit"
                            className="p-2 bg-white text-black rounded-lg hover:bg-white/90 transition-colors"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                />
                            </svg>
                        </button>
                    </form>
                </div>

                {/* Botões Mobile */}
                <div className="flex items-center lg:hidden">
                    {/* Botão de Busca Mobile */}
                    <button
                        className="p-2 mr-2 text-white"
                        onClick={toggleSearch}
                        aria-label="Buscar"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                            />
                        </svg>
                    </button>

                    {/* Carrinho - Não mostrar na página do carrinho */}
                    {!isCartPage && (
                        <button 
                            onClick={handleCartClick} 
                            className="flex items-center relative cursor-pointer text-white"
                            aria-label="Carrinho"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                                />
                            </svg>
                            {cartCount > 0 && (
                                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                                    {cartCount}
                                </span>
                            )}
                        </button>
                    )}

                </div>

                {/* Carrinho na versão desktop */}
                {!isCartPage && (
                    <button 
                        onClick={handleCartClick} 
                        className="hidden lg:flex items-center relative cursor-pointer text-white"
                        aria-label="Carrinho"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-8 w-8"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                            />
                        </svg>
                        {cartCount > 0 && (
                            <span className="absolute -top-4 -right-4 bg-white text-black text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                                {cartCount}
                            </span>
                        )}
                    </button>
                )}
            </div>

            {/* Campo de busca expandido (Mobile) */}
            {isSearchExpanded && (
                <div className="lg:hidden absolute top-0 left-0 h-full w-full  bg-white shadow-md py-2 px-4 z-50 flex items-center">
                    <button
                        onClick={toggleSearch}
                        className="mr-2"
                        aria-label="Fechar"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                    <form onSubmit={handleSearch} className="flex-1 flex items-center gap-2">
                        <input
                            type="text"
                            placeholder="Buscar produtos..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                            autoFocus
                        />
                        <button
                            type="submit"
                            className="p-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                />
                            </svg>
                        </button>
                    </form>
                </div>
            )}

        
        </nav>
    );
} 