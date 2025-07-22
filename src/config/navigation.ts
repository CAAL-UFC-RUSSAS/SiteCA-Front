import { NavItem } from "@/types/navigation";

export const navItems: NavItem[] = [
  { label: 'Início', href: '/' },
  {
    label: 'Serviços',
    href: '/servicos',
  },
  {
    label: 'Sobre',
    submenu: [
      { label: 'O Centro Acadêmico', href: '/sobre' },
      { label: 'Gestão Atual', href: '/sobre/gestao' },
      { label: 'Documentos', href: 'https://drive.google.com/drive/folders/1tTChUjAH1TMKU1_7lZY4bSL9HJ0wULPq',
                target: '_blank',
        rel: 'noopener noreferrer'
      },
      { label: 'Contato', href: '/contato' },
    ],
  },
  {
    label: 'Eventos',
    submenu: [
      { label: 'Calendário UFC', href: '/eventos' },
      { 
        label: 'Galeria', 
        href: 'https://drive.google.com/drive/folders/18aEnTSwyr3-Mm9zQGo7yfaSk9n9zKe4H',
        target: '_blank',
        rel: 'noopener noreferrer'
      },
    ],
  },
  /*
  {
    label: 'Projetos',
    submenu: [
      { label: 'Projetos em Andamento', href: '/projetos' },
      { label: 'Parceiros', href: '/projetos/parceiros' },
      { label: 'Oportunidades', href: '/projetos/oportunidades' },
    ],
  },
  
  {
    label: 'Calouros',
    href: '/calouros',
    submenu: [
      { label: 'Guia do Calouro', href: '/calouros/guia' },
      { label: 'FAQ', href: '/calouros/faq' },
      { label: 'Dicas', href: '/calouros/dicas' },
      { label: 'Mapa do Campus', href: '/calouros/mapa' },
    ],
  },
  */
  
  {
    label: 'Financeiro',
    submenu: [
      { label: 'Prestação de Contas', href: '/financeiro' },
      { label: 'Transparência', href: '/financeiro/transparencia' },
    ],
  },
  {
    label: 'Loja do CA',
    href: '/loja',
  },
]; 