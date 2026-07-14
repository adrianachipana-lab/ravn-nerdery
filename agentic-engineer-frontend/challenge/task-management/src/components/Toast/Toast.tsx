import { X } from 'lucide-react';
import type { Toast as ToastType } from '../../hooks/useToast';
import styles from './Toast.module.css';

interface ToastContainerProps {
  toasts: ToastType[];
  onRemove: (id: string) => void;
}

export function ToastContainer({ toasts, onRemove }: ToastContainerProps) {
  if (toasts.length === 0) return null;

  return (
    <div className={styles.container} aria-live="polite" aria-atomic="false">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`${styles.toast} ${styles[toast.type]}`}
        >
          <span>{toast.message}</span>
          <button
            className={styles.close}
            onClick={() => onRemove(toast.id)}
            aria-label="Dismiss"
          >
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
}
