export interface ProdutoImagem {
    id: number;
    produto_id: number;
    url: string;
    ordem: number;
}

export interface ProdutoCampoPersonalizado {
    id?: number;
    produto_id?: number;
    nome: string;
    tipo: 'texto' | 'numero' | 'opcao';
    opcoes?: string[];
    valor: string;
}

export interface Produto {
    id: number;
    nome: string;
    descricao: string;
    preco: string;
    quantidade: number;
    tags: string | string[];
    disponivel: boolean;
    imagens: (string | ProdutoImagem)[];
    campos_personalizados?: ProdutoCampoPersonalizado[];
} 