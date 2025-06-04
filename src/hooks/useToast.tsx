type ToastVariant = 'default' | 'success' | 'destructive';

type ToastProps = {
  title: string;
  description?: string;
  variant?: ToastVariant;
};

export function useToast() {
  // Stub implementation - não precisa realmente fazer nada
  const toast = (props: ToastProps) => {
    // Em uma implementação real, exibiria um toast
    console.log('Toast:', props);
  };

  return { toast };
} 