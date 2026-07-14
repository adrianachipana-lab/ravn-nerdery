import { SearchX } from 'lucide-react';
import styles from './EmptyState.module.css';

interface EmptyStateProps {
  message?: string;
}

export function EmptyState({ message = 'No results found' }: EmptyStateProps) {
  return (
    <div className={styles.container}>
      <SearchX size={48} className={styles.icon} />
      <p className={styles.message}>{message}</p>
    </div>
  );
}
