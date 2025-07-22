export interface NavItem {
  label: string;
  href?: string;
  submenu?: NavItem[];
  target?: '_blank' | '_self' | '_parent' | '_top';
  rel?: string;
} 