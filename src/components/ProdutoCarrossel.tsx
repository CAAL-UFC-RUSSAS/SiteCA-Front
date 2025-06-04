import { useState, useEffect, useRef, TouchEvent } from 'react';
import ProdutoCardSobreposto from './ProdutoCardSobreposto';
import { Produto } from '@/types/produto';

interface ProdutoCarrosselProps {
    produtos: Produto[];
    titulo?: string;
}

export default function ProdutoCarrossel({ produtos, titulo }: ProdutoCarrosselProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isMobile, setIsMobile] = useState(false);
    const [touchStart, setTouchStart] = useState<number | null>(null);
    const [touchEnd, setTouchEnd] = useState<number | null>(null);
    const carrosselRef = useRef<HTMLDivElement>(null);

    // Determina a quantidade de itens visíveis com base no tamanho da tela
    const getVisibleItems = () => {
        if (isMobile) return 1;
        if (window.innerWidth < 768) return 2; // sm
        if (window.innerWidth < 1024) return 3; // md
        return 4; // lg e maiores
    };

    const visibleItems = isMobile ? 1 : 4;
    const maxIndex = Math.max(0, produtos.length - visibleItems);

    // Detecta se o dispositivo é mobile
    useEffect(() => {
        const checkIsMobile = () => {
            setIsMobile(window.innerWidth < 640);
        };
        
        // Verificar inicialmente
        checkIsMobile();
        
        // Adicionar listener para quando a janela for redimensionada
        window.addEventListener('resize', checkIsMobile);
        
        // Cleanup
        return () => {
            window.removeEventListener('resize', checkIsMobile);
        };
    }, []);

    const scrollToIndex = (index: number) => {
        if (carrosselRef.current) {
            const newIndex = Math.max(0, Math.min(index, maxIndex));
            setCurrentIndex(newIndex);
            
            // Calcula o scroll baseado no índice e número de itens visíveis
            const visibleCount = getVisibleItems();
            const containerWidth = carrosselRef.current.offsetWidth;
            const itemWidth = containerWidth / visibleCount;
            
            carrosselRef.current.scrollTo({
                left: newIndex * itemWidth,
                behavior: 'smooth'
            });
        }
    };

    const handlePrev = () => {
        scrollToIndex(currentIndex - 1);
    };

    const handleNext = () => {
        scrollToIndex(currentIndex + 1);
    };

    // Handlers para gestos de toque em dispositivos móveis
    const handleTouchStart = (e: TouchEvent) => {
        setTouchStart(e.targetTouches[0].clientX);
    };
    
    const handleTouchMove = (e: TouchEvent) => {
        setTouchEnd(e.targetTouches[0].clientX);
    };
    
    const handleTouchEnd = () => {
        if (!touchStart || !touchEnd) return;
        
        const distance = touchStart - touchEnd;
        const isSwipeLeft = distance > 50; // swipe esquerda (próximo)
        const isSwipeRight = distance < -50; // swipe direita (anterior)
        
        if (isSwipeLeft && currentIndex < maxIndex) {
            handleNext();
        }
        
        if (isSwipeRight && currentIndex > 0) {
            handlePrev();
        }
        
        // Reset
        setTouchStart(null);
        setTouchEnd(null);
    };

    // Verifica se os produtos estão disponíveis
    const produtosDisponiveis = produtos.filter(produto => 
        produto && typeof produto === 'object'
    );

    if (produtosDisponiveis.length === 0) {
        return null;
    }

    return (
        <div className="w-full my-6">
            {titulo && (
                <h2 className="font-bold text-xl mb-4 text-gray-800">{titulo}</h2>
            )}
            
            <div className="relative">
                {/* Botão Anterior */}
                <button 
                    onClick={handlePrev}
                    disabled={currentIndex === 0}
                    className={`absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 rounded-full p-2 shadow-md ${
                        currentIndex === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-white'
                    }`}
                    aria-label="Anterior"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
                
                {/* Carrossel */}
                <div 
                    ref={carrosselRef}
                    className="flex overflow-x-hidden scroll-smooth"
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                >
                    {produtosDisponiveis.map((produto) => (
                        <div 
                            key={produto.id} 
                            className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 flex-shrink-0 px-2"
                        >
                            <ProdutoCardSobreposto produto={produto} />
                        </div>
                    ))}
                </div>
                
                {/* Botão Próximo */}
                <button 
                    onClick={handleNext}
                    disabled={currentIndex >= maxIndex}
                    className={`absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 rounded-full p-2 shadow-md ${
                        currentIndex >= maxIndex ? 'opacity-50 cursor-not-allowed' : 'hover:bg-white'
                    }`}
                    aria-label="Próximo"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </button>
                
                {/* Indicadores (opcional) */}
                {produtos.length > getVisibleItems() && (
                    <div className="flex justify-center mt-4">
                        {Array.from({ length: Math.ceil(produtos.length / getVisibleItems()) }).map((_, index) => (
                            <button
                                key={index}
                                onClick={() => scrollToIndex(index * getVisibleItems())}
                                className={`mx-1 h-2 w-2 rounded-full ${
                                    index === Math.floor(currentIndex / getVisibleItems()) ? 'bg-orange-500' : 'bg-gray-300'
                                }`}
                                aria-label={`Ir para página ${index + 1}`}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
} 