import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import styles from './Modal.module.css';

/*
  REACT CONCEPT: useEffect
  --------------------------
  useEffect ejecuta side-effects después del render.
  Aquí lo usamos para:
  1. Bloquear el scroll del body cuando el modal está abierto
  2. Cerrar el modal con Escape

  REACT CONCEPT: useRef
  -----------------------
  useRef nos da una referencia mutable que persiste entre renders.
  Lo usamos para acceder al DOM directamente (el overlay del modal)
  sin causar re-renders.

  REACT CONCEPT: children (Composition)
  ----------------------------------------
  El prop especial "children" permite que un componente
  envuelva cualquier contenido. Esto es composición pura:
  Modal no sabe qué va adentro, solo provee la estructura.
*/

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    // Bloquear scroll del body
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);

    // Cleanup: se ejecuta cuando el componente se desmonta
    // o cuando isOpen cambia. Esto es el "teardown" del effect.
    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current) onClose();
  };

  return (
    <div
      className={styles.overlay}
      ref={overlayRef}
      onClick={handleOverlayClick}
    >
      <div className={styles.modal} role="dialog" aria-label={title}>
        <div className={styles.header}>
          <h2 className={styles.title}>{title}</h2>
          <button
            className={styles.closeButton}
            onClick={onClose}
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>
        <div className={styles.body}>{children}</div>
      </div>
    </div>
  );
}
