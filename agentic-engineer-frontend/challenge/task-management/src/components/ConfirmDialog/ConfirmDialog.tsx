import { Modal } from '../Modal';
import styles from './ConfirmDialog.module.css';

/*
  REACT CONCEPT: Reusable Components
  -------------------------------------
  ConfirmDialog reutiliza Modal (composición).
  Es genérico: no sabe si está confirmando un delete
  o cualquier otra acción. Solo muestra un mensaje
  y dos botones.
*/

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  variant?: 'danger' | 'default';
}

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = 'Confirm',
  variant = 'default',
}: ConfirmDialogProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <p className={styles.message}>{message}</p>
      <div className={styles.actions}>
        <button className={styles.cancelButton} onClick={onClose}>
          Cancel
        </button>
        <button
          className={`${styles.confirmButton} ${variant === 'danger' ? styles.danger : ''}`}
          onClick={onConfirm}
        >
          {confirmLabel}
        </button>
      </div>
    </Modal>
  );
}
