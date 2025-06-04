'use client';

import { useEffect, useState, use } from 'react';
import Image from 'next/image';
import { Produto } from '@/types/produto';
import { getProduto } from '@/services/api';
import LojaNavbar from '@/components/LojaNavbar';
import { useRouter } from 'next/navigation';
import ProdutoCarrossel from '@/components/ProdutoCarrossel';

export default function ProdutoPage({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter();
    const resolvedParams = use(params);
    const [produto, setProduto] = useState<Produto | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [addedToCart, setAddedToCart] = useState(false);
    const [selectedSize, setSelectedSize] = useState<string | null>(null);
    const [availableSizes, setAvailableSizes] = useState<string[]>([]);
    const [selectedType, setSelectedType] = useState<string | null>(null);
    const [availableTypes, setAvailableTypes] = useState<string[]>([]);
    const [productInCartWithDifferentOptions, setProductInCartWithDifferentOptions] = useState(false);
    const [quantidade, setQuantidade] = useState(1);
    const [produtosRelacionados, setProdutosRelacionados] = useState<Produto[]>([]);

    const formatarPreco = (preco: string) => {
        const precoNum = Number(preco);
        return (precoNum / 100).toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        });
    };

    // Detecta tags de tamanho
    const detectSizeTags = (tags: string[]) => {
        const sizeRegex = /^(PP|P|M|G|GG|XG|XGG|XL|XXL)$/i;
        return tags.filter(tag => sizeRegex.test(tag));
    };

    // Detecta tags de tipo de vestimenta
    const detectTypeTags = (tags: string[]) => {
        const typeRegex = /^(masculino|feminino|unissex|baby[\s-]?look)$/i;
        return tags.filter(tag => typeRegex.test(tag));
    };

    // Busca produtos relacionados com base nas tags do produto atual
    const encontrarProdutosRelacionados = (produtoAtual: Produto, todosProdutos: Produto[]) => {
        if (!produtoAtual || !Array.isArray(produtoAtual.tags) || !Array.isArray(todosProdutos)) {
            return [];
        }

        // Filtra produtos que compartilham pelo menos uma tag com o produto atual
        // e exclui o próprio produto atual
        const relacionados = todosProdutos.filter(p => 
            p.id !== produtoAtual.id && 
            Array.isArray(p.tags) && 
            p.tags.some(tag => produtoAtual.tags.includes(tag))
        );

        // Embaralha os resultados e limita a 4-8 produtos
        return relacionados
            .sort(() => 0.5 - Math.random())
            .slice(0, Math.min(8, relacionados.length));
    };

    useEffect(() => {
        const fetchProduto = async () => {
            try {
                // Tenta primeiro buscar do localStorage
                const produtosDoLocalStorage = localStorage.getItem('produtos_loja');
                let produtoData: Produto | null = null;
                let todosProdutos: Produto[] = [];
                
                if (produtosDoLocalStorage) {
                    todosProdutos = JSON.parse(produtosDoLocalStorage);
                    // Converte o ID para string para garantir que a comparação seja do mesmo tipo
                    produtoData = todosProdutos.find(p => String(p.id) === String(resolvedParams.id)) || null;
                }
                
                // Se não encontrou no localStorage, busca da API
                if (!produtoData) {
                    produtoData = await getProduto(resolvedParams.id);
                    // Neste caso, não temos todos os produtos para relacionados,
                    // mas podemos buscar novamente a lista completa se necessário
                }
                
                // Verificar se o produto está disponível com base na quantidade
                if (produtoData.quantidade < 1) {
                    produtoData.disponivel = false;
                }
                
                setProduto(produtoData);
                
                if (Array.isArray(produtoData.tags)) {
                    // Verificar se o produto tem tags de tamanho
                    const sizes = detectSizeTags(produtoData.tags);
                    setAvailableSizes(sizes);
                    // Selecionar o primeiro tamanho por padrão se existir
                    if (sizes.length > 0) {
                        setSelectedSize(sizes[0]);
                    }
                    
                    // Verificar se o produto tem tags de tipo de vestimenta
                    const types = detectTypeTags(produtoData.tags);
                    setAvailableTypes(types);
                    // Selecionar o primeiro tipo por padrão se existir
                    if (types.length > 0) {
                        setSelectedType(types[0]);
                    }
                }
                
                // Ordenar produtos por relevância (relacionados primeiro)
                if (todosProdutos.length > 0 && produtoData) {
                    // Separar os produtos relacionados dos não-relacionados
                    const produtosRelacionados = todosProdutos.filter(p => 
                        p.id !== produtoData.id && 
                        Array.isArray(p.tags) && 
                        Array.isArray(produtoData.tags) &&
                        p.tags.some(tag => produtoData.tags.includes(tag))
                    );

                    const produtosNaoRelacionados = todosProdutos.filter(p => 
                        p.id !== produtoData.id && 
                        !produtosRelacionados.some(pr => pr.id === p.id)
                    );

                    // Embaralhar cada grupo separadamente para variar a ordem
                    const relacionadosEmbaralhados = [...produtosRelacionados].sort(() => 0.5 - Math.random());
                    const naoRelacionadosEmbaralhados = [...produtosNaoRelacionados].sort(() => 0.5 - Math.random());

                    // Juntar os dois grupos, com relacionados primeiro
                    const todosProdutosOrdenados = [...relacionadosEmbaralhados, ...naoRelacionadosEmbaralhados];
                    setProdutosRelacionados(todosProdutosOrdenados);
                }
                
                setLoading(false);
            } catch (err) {
                console.error('Erro ao buscar produto:', err);
                setError('Erro ao carregar produto');
                setLoading(false);
            }
        };

        fetchProduto();
    }, [resolvedParams.id]);

    // Carregar informações do produto do carrinho no carregamento inicial
    useEffect(() => {
        if (produto) {
            try {
                const cart: Array<{id: number; nome: string; preco: string; imagem?: string; quantidade: number; tamanho?: string; tipo?: string; quantidadeDisponivel?: number}> = JSON.parse(localStorage.getItem('cart') || '[]');
                
                // Verificar se já existe no carrinho e carregar suas informações
                const cartItem = cart.find(item => item.id === produto.id);
                if (cartItem) {
                    // Carregar a quantidade do carrinho
                    setQuantidade(cartItem.quantidade);
                    
                    // Carregar o tamanho se estiver disponível e for um dos tamanhos válidos
                    if (cartItem.tamanho && availableSizes.includes(cartItem.tamanho)) {
                        setSelectedSize(cartItem.tamanho);
                    }
                    
                    // Carregar o tipo se estiver disponível e for um dos tipos válidos
                    if (cartItem.tipo && availableTypes.includes(cartItem.tipo)) {
                        setSelectedType(cartItem.tipo);
                    }
                }
            } catch (error) {
                console.error('Erro ao carregar informações do carrinho:', error);
            }
        }
    }, [produto, availableSizes, availableTypes]);

    // Verificar status do produto no carrinho quando as opções mudam
    useEffect(() => {
        if (produto) {
            try {
                const cart: Array<{id: number; nome: string; preco: string; imagem?: string; quantidade: number; tamanho?: string; tipo?: string; quantidadeDisponivel?: number}> = JSON.parse(localStorage.getItem('cart') || '[]');
                
                // Verificar se o produto está no carrinho com exatamente as mesmas opções
                const isExactMatch = cart.some((item) => 
                    item.id === produto.id && 
                    item.tamanho === selectedSize && 
                    item.tipo === selectedType
                );
                
                // Verificar se o produto está no carrinho mas com opções diferentes
                const isInCartWithDifferentOptions = cart.some((item) => 
                    item.id === produto.id && 
                    (item.tamanho !== selectedSize || item.tipo !== selectedType)
                );
                
                setAddedToCart(isExactMatch);
                setProductInCartWithDifferentOptions(isInCartWithDifferentOptions);
            } catch (error) {
                console.error('Erro ao verificar status no carrinho:', error);
            }
        }
    }, [produto, selectedSize, selectedType]);

    const addToCart = () => {
        if (!produto) return;

        // Se a quantidade for zero, não adicionar ao carrinho
        if (quantidade === 0) {
            alert('Selecione pelo menos 1 unidade para adicionar ao carrinho');
            return;
        }

        // Se o produto já foi adicionado com as mesmas opções, redirecionar para o carrinho
        if (addedToCart) {
            router.push('/loja/carrinho');
            return;
        }

        try {
            // Obter carrinho atual
            const currentCart: Array<{id: number; nome: string; preco: string; imagem?: string; quantidade: number; tamanho?: string; tipo?: string; quantidadeDisponivel?: number}> = JSON.parse(localStorage.getItem('cart') || '[]');
            
            // Se o produto já está no carrinho mas com opções diferentes
            if (productInCartWithDifferentOptions) {
                // Encontrar todos os itens do produto no carrinho
                const productItems = currentCart.filter(item => item.id === produto.id);
                
                // Se o usuário está modificando um produto que já existe no carrinho
                if (productItems.length > 0) {
                    // Atualizar o primeiro item encontrado com as novas opções
                    // (ou podemos remover todos e adicionar um novo)
                    const firstItemIndex = currentCart.findIndex(item => item.id === produto.id);
                    
                    // Usar a quantidade selecionada
                    const totalQuantity = quantidade;
                    
                    // Atualizar item com novas opções
                    currentCart[firstItemIndex] = {
                        id: produto.id,
                        nome: produto.nome,
                        preco: produto.preco,
                        imagem: produto.imagem,
                        quantidade: totalQuantity,
                        tamanho: selectedSize || undefined,
                        tipo: selectedType || undefined,
                        quantidadeDisponivel: produto.quantidade
                    };
                    
                    // Remover quaisquer outras variações do mesmo produto
                    const updatedCart = currentCart.filter((item, index) => 
                        item.id !== produto.id || index === firstItemIndex
                    );
                    
                    // Salvar no localStorage
                    localStorage.setItem('cart', JSON.stringify(updatedCart));
                }
            } else {
                // Verificar se o produto já está no carrinho (com o mesmo tamanho e tipo)
                const existingItemIndex = currentCart.findIndex((item) => 
                    item.id === produto.id && 
                    item.tamanho === selectedSize && 
                    item.tipo === selectedType
                );
                
                if (existingItemIndex >= 0) {
                    // Atualizar quantidade se já existe
                    currentCart[existingItemIndex].quantidade = quantidade;
                } else {
                    // Adicionar novo item
                    currentCart.push({
                        id: produto.id,
                        nome: produto.nome,
                        preco: produto.preco,
                        imagem: produto.imagem,
                        quantidade: quantidade,
                        tamanho: selectedSize || undefined,
                        tipo: selectedType || undefined,
                        quantidadeDisponivel: produto.quantidade
                    });
                }
                
                // Salvar no localStorage
                localStorage.setItem('cart', JSON.stringify(currentCart));
            }
            
            // Atualizar estado
            setAddedToCart(true);
            setProductInCartWithDifferentOptions(false);
            
            // Disparar evento para atualizar o contador na navbar
            window.dispatchEvent(new CustomEvent('cartUpdated'));
        } catch (error) {
            console.error('Erro ao adicionar ao carrinho:', error);
        }
    };

    const comprarAgora = () => {
        if (!produto) return;

        // Se a quantidade for zero, não prosseguir
        if (quantidade === 0) {
            alert('Selecione pelo menos 1 unidade para comprar');
            return;
        }

        // Adicionar ao carrinho primeiro (opcional)
        addToCart();
        
        // Preparar mensagem para WhatsApp
        const telefone = '557398462159'; // Substitua pelo número do WhatsApp do CA
        const valorUnitario = Number(produto.preco) / 100;
        const valorTotal = valorUnitario * quantidade;
        
        let mensagem = 'Olá! Gostaria de comprar o seguinte produto:\n\n';
        
        // Adicionar informações do produto
        mensagem += `${produto.nome}`;
        
        // Adicionar tamanho e tipo se selecionados
        const detalhes = [];
        if (selectedSize) detalhes.push(`Tamanho: ${selectedSize}`);
        if (selectedType) detalhes.push(`Tipo: ${selectedType}`);
        
        if (detalhes.length > 0) {
            mensagem += ` (${detalhes.join(', ')})`;
        }
        
        mensagem += ` - ${quantidade} unidade(s) - R$ ${valorTotal.toFixed(2)}\n`;
        mensagem += `\nValor Total: R$ ${valorTotal.toFixed(2)}`;
        mensagem += `\n\nOpção de entrega: Retirada no CA de Russas UFC`;
        
        // Codificar a mensagem para URL
        const mensagemCodificada = encodeURIComponent(mensagem);
        
        // Criar URL do WhatsApp
        const whatsappUrl = `https://wa.me/${telefone}?text=${mensagemCodificada}`;
        
        // Abrir em nova aba
        window.open(whatsappUrl, '_blank');
    };

    // Função para formatar texto de tag
    const formatTagText = (text: string) => {
        return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
    };

    const setSelectedSizeAndUpdateCart = (size: string) => {
        setSelectedSize(size);
    };
    
    const setSelectedTypeAndUpdateCart = (type: string) => {
        setSelectedType(type);
    };

    // Funções para controlar a quantidade
    const aumentarQuantidade = () => {
        if (produto && quantidade < produto.quantidade) {
            setQuantidade(quantidade + 1);
        }
    };
    
    const diminuirQuantidade = () => {
        if (quantidade > 0) {
            const novaQuantidade = quantidade - 1;
            setQuantidade(novaQuantidade);
            
            // Se a quantidade chegar a zero e o produto estiver no carrinho, remover do carrinho
            if (novaQuantidade === 0 && (addedToCart || productInCartWithDifferentOptions) && produto) {
                try {
                    const cart: Array<{id: number; nome: string; preco: string; imagem?: string; quantidade: number; tamanho?: string; tipo?: string; quantidadeDisponivel?: number}> = JSON.parse(localStorage.getItem('cart') || '[]');
                    const updatedCart = cart.filter(item => item.id !== produto.id);
                    localStorage.setItem('cart', JSON.stringify(updatedCart));
                    
                    // Atualizar estados
                    setAddedToCart(false);
                    setProductInCartWithDifferentOptions(false);
                    
                    // Disparar evento para atualizar o contador na navbar
                    window.dispatchEvent(new CustomEvent('cartUpdated'));
                    
                    // Notificar o usuário
                    alert('Produto removido do carrinho');
                } catch (error) {
                    console.error('Erro ao remover produto do carrinho:', error);
                }
            }
        }
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

    if (error || !produto) {
        return (
            <>
                <LojaNavbar />
                <main className="container mx-auto px-4 py-8 max-w-7xl">
                    <div className="flex justify-center items-center min-h-[400px]">
                        <p className="text-red-500">{error || 'Produto não encontrado'}</p>
                    </div>
                </main>
            </>
        );
    }

    return (
        <>
            <LojaNavbar />
            <main className="container mx-auto px-4 max-w-7xl">
                <div className="flex items-center mt-1 p-3 pl-0  text-sm">
                    <span 
                        className="text-gray-700 hover:text-orange-600 cursor-pointer font-medium transition-colors whitespace-nowrap"  
                        onClick={() => router.push('/')}
                    >
                        Centro Acadêmico
                    </span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mx-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                    <span 
                        className="text-gray-700 hover:text-orange-600 cursor-pointer font-medium transition-colors"
                        onClick={() => router.push('/loja')}
                    >
                        Loja
                    </span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mx-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                    <span className="text-orange-600 font-medium truncate">
                        {produto?.nome || 'Produto'}
                    </span>
                </div>
            </main>
            <main className="container mx-auto px-4 py-0 pt-2 max-w-7xl">
                <div className="flex flex-col md:flex-row gap-0 bg-white shadow p-6">
                    <div className="w-full md:w-1/2 flex justify-center items-center">
                        {produto.imagem ? (
                            <Image 
                                src={produto.imagem} 
                                alt={produto.nome} 
                                width={500} 
                                height={500} 
                                className=" object-contain"
                            />
                        ) : (
                            <div className="w-full h-[500px] bg-gray-200 rounded-lg flex items-center justify-center">
                                <span className="text-gray-400 text-xl">Sem imagem</span>
                            </div>
                        )}
                    </div>
                    <div className="flex-1 flex flex-col gap-4">
                        <h1 className="text-3xl font-bold text-black">{produto.nome}</h1>
                        <span className="text-4xl text-[#ee4d2d] font-bold">{formatarPreco(produto.preco)}</span>
                        <p className="text-gray-700 text-lg">{produto.descricao}</p>
                        
                        {/* Seleção de tipo de vestimenta (se disponível) */}
                        {availableTypes.length > 0 && (
                            <div className="mt-2">
                                <h3 className="text-gray-700 font-medium mb-2">Tipo:</h3>
                                <div className="flex flex-wrap gap-2">
                                    {availableTypes.map((type) => (
                                        <button
                                            key={type}
                                            className={`px-3 py-1 border transition-colors ${
                                                selectedType === type
                                                    ? 'border-orange-500 bg-orange-50 text-orange-700 font-medium'
                                                    : 'border-gray-300 hover:border-orange-400 hover:bg-orange-50/50 text-gray-700'
                                            }`}
                                            onClick={() => setSelectedTypeAndUpdateCart(type)}
                                        >
                                            {formatTagText(type)}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                        
                        {/* Seleção de tamanho (se disponível) */}
                        {availableSizes.length > 0 && (
                            <div className="mt-2">
                                <h3 className="text-gray-700 font-medium mb-2">Tamanho:</h3>
                                <div className="flex flex-wrap gap-2">
                                    {availableSizes.map((size) => (
                                        <button
                                            key={size}
                                            className={`px-3 py-1 border transition-colors ${
                                                selectedSize === size
                                                    ? 'border-orange-500 bg-orange-50 text-orange-700 font-medium'
                                                    : 'border-gray-300 hover:border-orange-400 hover:bg-orange-50/50 text-gray-700'
                                            }`}
                                            onClick={() => setSelectedSizeAndUpdateCart(size)}
                                        >
                                            {size.toUpperCase()}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                        
                        <div className="flex flex-wrap gap-2">
                            {Array.isArray(produto.tags) && produto.tags
                                .filter(tag => !availableSizes.includes(tag) && !availableTypes.includes(tag)) // Filtrar tamanhos e tipos já exibidos acima
                                .map((tag: string) => (
                                <span 
                                    key={tag} 
                                    className="bg-gray-100 text-gray-800 text-sm px-3 py-1 rounded-full"
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>
                        
                        {/* Espaçador flexível que empurra o conteúdo para baixo */}
                        <div className="flex-grow"></div>
                        
                        {/* Nova organização dos componentes de disponibilidade e ações */}
                        <div className="mt-auto border-t pb-4">
                            <div className="flex flex-col gap-3">
                                {/* Linha 1: Status e quantidade em estoque */}
                                <div className="flex items-center justify-between">
                                    <span className={`text-base font-semibold ${produto.disponivel ? 'text-green-600' : 'text-red-600'}`}>
                                        {produto.disponivel ? 'Disponível' : 'Indisponível'}
                                    </span>
                                    <span className="text-base text-gray-500">
                                        {produto.quantidade} unidades
                                    </span>
                                </div>
                                
                                {/* Seletor de quantidade */}
                                <div className="mb-4">
                                    <label className="text-gray-700 font-medium mb-1 block">Quantidade</label>
                                    <div className="flex items-center">
                                        <button 
                                            onClick={diminuirQuantidade}
                                            className="w-10 h-10 border border-gray-300 flex items-center justify-center rounded-l-md hover:bg-orange-50 hover:border-orange-300 transition-colors"
                                            disabled={quantidade === 0}
                                        >
                                            <span className="text-xl text-gray-700">−</span>
                                        </button>
                                        <div className="w-14 h-10 border-t border-b border-gray-300 flex items-center justify-center bg-white font-medium">
                                            <span>{quantidade}</span>
                                        </div>
                                        <button 
                                            onClick={aumentarQuantidade}
                                            className="w-10 h-10 border border-gray-300 flex items-center justify-center rounded-r-md hover:bg-orange-50 hover:border-orange-300 transition-colors"
                                            disabled={produto && quantidade >= produto.quantidade}
                                        >
                                            <span className="text-xl text-gray-700">+</span>
                                        </button>
                                    </div>
                                </div>
                                
                                {/* Linha 2: Botões de ação */}
                                <div className="flex items-center justify-between">
                                    <button 
                                        onClick={addToCart}
                                        disabled={
                                            !produto.disponivel || 
                                            (availableSizes.length > 0 && !selectedSize) ||
                                            (availableTypes.length > 0 && !selectedType)
                                        }
                                        className="lg:px-8 px-4 lg:py-4 h-20 rounded font-medium lg:text-xl text-md shadow-sm transition-colors flex-1 mr-2 border border-orange-500 bg-white text-orange-500 hover:bg-orange-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <div className="flex items-center justify-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="lg:h-6 lg:w-6 h-10 w-10 lg:mr-2 lg:ml-[-8]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                            </svg>
                                            {addedToCart 
                                                ? 'Ver Carrinho' 
                                                : productInCartWithDifferentOptions 
                                                    ? 'Atualizar Carrinho' 
                                                    : 'Adicionar Ao Carrinho'
                                            }
                                        </div>
                                    </button>
                                    
                                    <button 
                                        onClick={comprarAgora}
                                        className="lg:px-8 px-4 lg:py-4 h-20 rounded font-medium lg:text-xl text-md shadow-sm transition-colors flex-1 bg-orange-600 text-white hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                        disabled={
                                            !produto.disponivel || 
                                            (availableSizes.length > 0 && !selectedSize) ||
                                            (availableTypes.length > 0 && !selectedType)
                                        }
                                    >
                                        <div className="flex items-center justify-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="lg:h-7 lg:w-7 h-8 w-8 lg:mr-2 lg:ml-[-8]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                            Comprar Agora
                                        </div>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            
            {/* Produtos ordenados com relacionados primeiro */}
            {produtosRelacionados.length > 0 && (
                <div className="container mx-auto px-4 py-4 pt-0 max-w-7xl">
                    <ProdutoCarrossel 
                        produtos={produtosRelacionados} 
                        titulo="Mais Produtos" 
                    />
                </div>
            )}
        </>
    );
}
