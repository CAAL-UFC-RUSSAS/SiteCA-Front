import { NavItem } from "@/types/navigation";

export const navItems: NavItem[] = [
  { label: 'Início', href: '/' },
  {
    label: 'Sobre',
    submenu: [
      { label: 'O Centro Acadêmico', href: '/sobre' },
      { label: 'Gestão Atual', href: '/sobre/gestao' },
      { label: 'Documentos', href: '/sobre/documentos' },
      { label: 'Contato', href: '/contato' },
    ],
  },
  {
    label: 'Serviços',
    href: '/servicos',
  },
  {
    label: 'Eventos',
    submenu: [
      { label: 'Calendário UFC', href: '/eventos' },
      { label: 'Galeria', href: '/eventos/galeria' },
    ],
  },
  {
    label: 'Projetos',
    submenu: [
      { label: 'Projetos em Andamento', href: '/projetos' },
      { label: 'Parceiros', href: '/projetos/parceiros' },
      { label: 'Oportunidades', href: '/projetos/oportunidades' },
    ],
  },
  
  /* Comentado temporariamente
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