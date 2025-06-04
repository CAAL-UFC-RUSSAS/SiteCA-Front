'use client';

import { use } from 'react';
import AvisoForm from '@/components/AvisoForm';

interface EditarAvisoPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function EditarAvisoPage({ params }: EditarAvisoPageProps) {
  const resolvedParams = use(params);
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Editar Aviso</h1>
      <AvisoForm id={resolvedParams.id} isEditing={true} />
    </div>
  );
} 