import { useState } from 'react';

type ToastVariant = 'default' | 'destructive' | 'success';

type ToastProps = {
  title?: string;
  description: string;
  variant?: ToastVariant;
  duration?: number;
};

type Toast = ToastProps & {
  id: string;
};

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = (props: ToastProps) => {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast: Toast = {
      id,
      title: props.title || '',
      description: props.description,
      variant: props.variant || 'default',
      duration: props.duration || 3000,
    };

    setToasts((prev) => [...prev, newToast]);

    // Auto-dismiss
    setTimeout(() => {
      dismiss(id);
    }, newToast.duration);

    return id;
  };

  const dismiss = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  return {
    toasts,
    toast,
    dismiss,
  };
} 