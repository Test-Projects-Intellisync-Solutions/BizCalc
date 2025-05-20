type ToastVariant = 'default' | 'destructive' | 'success';

type ToastFunction = (title: string, description?: string) => void;

interface ToastService {
  toast: (options: { title: string; description?: string; variant?: ToastVariant }) => void;
  success: ToastFunction;
  error: ToastFunction;
}

const toastService: ToastService = {
  toast: ({ title, description, variant = 'default' }) => {
    console.log(`[${variant}] ${title}`, description || '');
  },
  success: (title, description) => {
    toastService.toast({ title, description, variant: 'success' });
  },
  error: (title, description) => {
    toastService.toast({ title, description, variant: 'destructive' });
  }
};

export const Toaster = () => null; // No-op for now
export const useToast = (): ToastService => toastService;
