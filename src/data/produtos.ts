export interface Produto {
  id: number;
  nome: string;
  descricao: string;
  preco: string;
  imagem: string;
  tags: string[];
  disponivel: boolean;
  quantidade: number;
}

export const produtos: Produto[] = [
  {
    id: 1,
    nome: "Camiseta",
    descricao: "Camiseta oficial do Centro Acadêmico, 100% algodão, várias cores e tamanhos.",
    preco: "R$ 40,00",
    imagem: "/imgs/banner.png",
    tags: ["camiseta", "azul", "vermelho", "preto"],
    disponivel: true,
    quantidade: 12
  },
  {
    id: 2,
    nome: "Caneca",
    descricao: "Caneca personalizada do CAOC, resistente e estilosa para o seu dia a dia.",
    preco: "R$ 25,00",
    imagem: "/imgs/banner.png",
    tags: ["caneca", "branco", "vermelho"],
    disponivel: true,
    quantidade: 8
  },
  {
    id: 3,
    nome: "Chaveiro",
    descricao: "Chaveiro exclusivo do CAOC, leve a marca do seu curso para todo lugar!",
    preco: "R$ 10,00",
    imagem: "/imgs/banner.png",
    tags: ["chaveiro", "amarelo"],
    disponivel: false,
    quantidade: 0
  },
  {
    id: 4,
    nome: "Adesivo",
    descricao: "Adesivo do CAOC para personalizar seu material.",
    preco: "R$ 5,00",
    imagem: "/imgs/banner.png",
    tags: ["adesivo", "verde"],
    disponivel: true,
    quantidade: 30
  },
  {
    id: 5,
    nome: "Botton",
    descricao: "Botton exclusivo do CAOC, colecione!",
    preco: "R$ 8,00",
    imagem: "/imgs/banner.png",
    tags: ["botton", "azul"],
    disponivel: true,
    quantidade: 15
  },    
  {
    id: 6,
    nome: "Botton",
    descricao: "Botton exclusivo do CAOC, colecione!",
    preco: "R$ 8,00",
    imagem: "/imgs/banner.png",
    tags: ["botton", "azul"],
    disponivel: true,
    quantidade: 15
  },    
  {
    id: 7,
    nome: "Botton",
    descricao: "Botton exclusivo do CAOC, colecione!",
    preco: "R$ 8,00",
    imagem: "/imgs/banner.png",
    tags: ["botton", "azul"],
    disponivel: true,
    quantidade: 15
  },    
  {
    id: 8,
    nome: "Botton Vermlho",
    descricao: "Botton exclusivo do CAOC, colecione!",
    preco: "R$ 8,00",
    imagem: "/imgs/banner.png",
    tags: ["botton", "azul"],
    disponivel: true,
    quantidade: 15
  },    
  {
    id: 9,
    nome: "Botton",
    descricao: "Botton exclusivo do CAOC, colecione!",
    preco: "R$ 8,00",
    imagem: "/imgs/banner.png",
    tags: ["botton", "azul"],
    disponivel: true,
    quantidade: 15
  },    
  {
    id: 10,
    nome: "Botton",
    descricao: "Botton exclusivo do CAOC, colecione!",
    preco: "R$ 8,00",
    imagem: "/imgs/banner.png",
    tags: ["botton", "azul"],
    disponivel: true,
    quantidade: 15
  },    
  {
    id: 11,
    nome: "Botton Vermlho",
    descricao: "Botton exclusivo do CAOC, colecione!",
    preco: "R$ 8,00",
    imagem: "/imgs/banner.png",
    tags: ["botton", "azul"],
    disponivel: true,
    quantidade: 15
  }
]; 