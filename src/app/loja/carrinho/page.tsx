'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import LojaNavbar from '@/components/LojaNavbar';

interface CartItem {
    id: string;
    nome: string;
    preco: string;
    imagem?: string;
    quantidade: number;
    selected?: boolean;
}

export default function CarrinhoPage() {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [allSelected, setAllSelected] = useState(false);

    useEffect(() => {
        // Carregar itens do carrinho do localStorage
        const loadCartItems = () => {
            try {
                const storedCart = localStorage.getItem('cart');
                if (storedCart) {
                    const items = JSON.parse(storedCart);
                    // Adicionar propriedade selected a cada item
                    setCartItems(items.map((item: CartItem) => ({ ...item, selected: false })));
                }
            } catch (error) {
                console.error('Erro ao carregar carrinho:', error);
            } finally {
                setLoading(false);
            }
        };

        loadCartItems();
    }, []);

    const formatarPreco = (preco: string) => {
        const precoNum = Number(preco);
        return (precoNum / 100).toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        });
    };

    const calcularTotal = () => {
        return cartItems.reduce((total, item) => {
            return total + (Number(item.preco) * item.quantidade);
        }, 0);
    };
    
    const calcularTotalSelecionados = () => {
        return cartItems.filter(item => item.selected).reduce((total, item) => {
            return total + (Number(item.preco) * item.quantidade);
        }, 0);
    };

    const getSelectedCount = () => {
        return cartItems.filter(item => item.selected).length;
    };

    const removeItem = (id: string) => {
        const updatedCart = cartItems.filter(item => item.id !== id);
        setCartItems(updatedCart);
        localStorage.setItem('cart', JSON.stringify(updatedCart.map(({ selected, ...item }) => item)));
        
        // Disparar evento para atualizar o contador na navbar
        window.dispatchEvent(new CustomEvent('cartUpdated'));
    };

    const removeSelectedItems = () => {
        const updatedCart = cartItems.filter(item => !item.selected);
        setCartItems(updatedCart);
        localStorage.setItem('cart', JSON.stringify(updatedCart.map(({ selected, ...item }) => item)));
        setAllSelected(false);
        
        // Disparar evento para atualizar o contador na navbar
        window.dispatchEvent(new CustomEvent('cartUpdated'));
    };
    
    const removeInactiveItems = () => {
        const updatedCart = cartItems.filter(item => item.quantidade > 0);
        setCartItems(updatedCart);
        localStorage.setItem('cart', JSON.stringify(updatedCart.map(({ selected, ...item }) => item)));
        
        // Disparar evento para atualizar o contador na navbar
        window.dispatchEvent(new CustomEvent('cartUpdated'));
    };

    const updateQuantity = (id: string, newQuantity: number) => {
        if (newQuantity < 0) newQuantity = 0;
        
        const updatedCart = cartItems.map(item => 
            item.id === id ? { ...item, quantidade: newQuantity } : item
        );
        
        setCartItems(updatedCart);
        localStorage.setItem('cart', JSON.stringify(updatedCart.map(({ selected, ...item }) => item)));
    };
    
    const toggleSelectItem = (id: string) => {
        const updatedCart = cartItems.map(item => 
            item.id === id ? { ...item, selected: !item.selected } : item
        );
        setCartItems(updatedCart);
        
        // Verificar se todos estão selecionados
        const allItemsSelected = updatedCart.every(item => item.selected);
        setAllSelected(allItemsSelected);
    };
    
    const toggleSelectAll = () => {
        const newSelectAllState = !allSelected;
        setAllSelected(newSelectAllState);
        
        const updatedCart = cartItems.map(item => ({
            ...item,
            selected: newSelectAllState
        }));
        setCartItems(updatedCart);
    };

    if (loading) {
        return (
            <>
                <LojaNavbar />
                <main className="container mx-auto px-4 py-8 max-w-7xl">
                    <div className="flex justify-center items-center min-h-[400px]">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                    </div>
                </main>
            </>
        );
    }

    return (
        <>
            <LojaNavbar />
            <main className="container mx-auto px-4 py-8 max-w-7xl">
                <h1 className="text-3xl font-bold text-indigo-900 mb-6">Seu Carrinho</h1>
                
                {cartItems.length === 0 ? (
                    <div className="bg-white shadow p-8 rounded-lg text-center">
                        <p className="text-lg text-gray-600 mb-6">Seu carrinho está vazio</p>
                        <Link href="/loja" className="px-6 py-3 bg-indigo-700 text-white rounded-lg hover:bg-indigo-800 transition-colors">
                            Continuar Comprando
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-6">
                        <div className="bg-white shadow rounded-lg overflow-hidden">
                            {/* Cabeçalho */}
                            <div className="grid grid-cols-14 gap-2 p-4 bg-gray-50 text-gray-600 font-semibold border-b">
                                <div className="col-span-1 flex items-center justify-center">
                                    <input 
                                        type="checkbox" 
                                        checked={allSelected}
                                        onChange={toggleSelectAll}
                                        className="w-4 h-4"
                                    />
                                </div>
                                <div className="col-span-5 md:col-span-5">Produtos</div>
                                <div className="col-span-2 text-center hidden md:block">Preço Unitário</div>
                                <div className="col-span-2 text-center">Quantidade</div>
                                <div className="col-span-2 text-center">Preço Total</div>
                                <div className="col-span-2 text-center">Ações</div>
                            </div>
                            
                            {/* Itens do carrinho */}
                            {cartItems.map(item => (
                                <div key={item.id} className={`grid grid-cols-14 gap-2 p-4 items-center border-b ${item.quantidade === 0 ? 'bg-gray-50 opacity-70' : ''}`}>
                                    <div className="col-span-1 flex items-center justify-center">
                                        <input 
                                            type="checkbox" 
                                            checked={item.selected}
                                            onChange={() => toggleSelectItem(item.id)}
                                            className="w-4 h-4"
                                        />
                                    </div>
                                    <div className="col-span-5 md:col-span-5 flex items-center gap-3">
                                        <div className="w-26 h-26 flex-shrink-0 bg-gray-100 rounded-md overflow-hidden">
                                            {item.imagem ? (
                                                <Image 
                                                    src={item.imagem} 
                                                    alt={item.nome} 
                                                    width={100} 
                                                    height={100}
                                                    className="object-cover w-full h-full" 
                                                />
                                            ) : (
                                                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                                    <span className="text-gray-400 text-xs">Sem imagem</span>
                                                </div>
                                            )}
                                        </div>
                                        <div>
                                            <Link href={`/loja/${item.id}`} className="text-indigo-700 hover:text-indigo-900 font-medium">
                                                {item.nome}
                                            </Link>
                                            <div className="md:hidden mt-2 text-sm text-gray-600">
                                                {formatarPreco(item.preco)}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-span-2 text-center hidden md:block font-medium">
                                        {formatarPreco(item.preco)}
                                    </div>
                                    <div className="col-span-2 flex justify-center items-center">
                                        <div className="flex items-center">
                                            <button 
                                                className="w-7 h-7 bg-gray-200 rounded-l-md flex items-center justify-center"
                                                onClick={() => updateQuantity(item.id, item.quantidade - 1)}
                                            >
                                                -
                                            </button>
                                            <div className="w-10 h-7 bg-gray-100 flex items-center justify-center">
                                                {item.quantidade}
                                            </div>
                                            <button 
                                                className="w-7 h-7 bg-gray-200 rounded-r-md flex items-center justify-center"
                                                onClick={() => updateQuantity(item.id, item.quantidade + 1)}
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>
                                    <div className="col-span-2 text-center font-semibold">
                                        {formatarPreco((Number(item.preco) * item.quantidade).toString())}
                                    </div>
                                    <div className="col-span-2 text-center">
                                        <button 
                                            onClick={() => removeItem(item.id)}
                                            className="text-red-500 hover:text-red-700"
                                            aria-label="Remover item"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        
                        {/* Resumo */}
                        <div className="bg-white shadow rounded-lg p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div className="text-gray-600 text-sm">
                                    <p className="mb-2">Após finalizar a compra, seu produto poderá ser retirado diretamente no CA ou enviado via Correios (a combinar via WhatsApp).</p>
                                </div>
                                <div className="text-gray-600 text-sm flex items-center justify-end">
                                    <p className="flex items-center">
                                        Você será redirecionado para finalizar via WhatsApp 
                                        <svg className="h-5 w-5 ml-2 text-green-500" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                        </svg>
                                    </p>
                                </div>
                            </div>
                            
                            <div className="flex flex-col md:flex-row justify-between items-center mt-4 gap-4">
                                <div className="flex flex-wrap items-center gap-4">
                                    <div className="flex items-center">
                                        <input 
                                            type="checkbox" 
                                            checked={allSelected}
                                            onChange={toggleSelectAll}
                                            className="w-4 h-4 mr-2"
                                            id="select-all-checkbox"
                                        />
                                        <label htmlFor="select-all-checkbox" className="text-sm cursor-pointer">
                                            Selecionar Todos
                                        </label>
                                    </div>
                                    
                                    <span 
                                        onClick={removeSelectedItems}
                                        className={`text-sm text-red-500 hover:text-red-700 cursor-pointer ${!getSelectedCount() ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    >
                                        Excluir Selecionados
                                    </span>
                                    
                                    <span 
                                        onClick={removeInactiveItems}
                                        className="text-sm text-gray-600 hover:text-gray-800 cursor-pointer"
                                    >
                                        Remover Inativos
                                    </span>
                                </div>
                                
                                <div className="flex items-center gap-3">
                                    <div className="text-right">
                                        <span className="text-gray-600 block text-sm">
                                            Total ({cartItems.length} {cartItems.length === 1 ? 'item' : 'itens'}):
                                        </span>
                                        <span className="text-xl font-bold text-indigo-900">
                                            {formatarPreco(calcularTotal().toString())}
                                        </span>
                                    </div>
                                    
                                    <button 
                                        className="px-6 py-3 bg-indigo-700 text-white rounded-lg hover:bg-indigo-800 transition-colors whitespace-nowrap"
                                        disabled={cartItems.length === 0}
                                    >
                                        Comprar
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </>
    );
} 