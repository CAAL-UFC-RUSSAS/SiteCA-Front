export type Produto = {
    id: number;
    nome: string;
    descricao: string;
    preco: string;
    quantidade: number;
    disponivel: boolean;
    tags: string[] | string; // Pode ser array ou string JSON
    imagem_nome?: string;
    imagem_mime?: string;
    imagem?: string;
    created_at?: string;
    updated_at?: string;
}; 