'use client';

import ClientNavbar from '@/components/ClientNavbar';
import Footer from '@/components/Footer';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ClientNavbar />
      {children}
      <Footer />
    </>
  );
} 