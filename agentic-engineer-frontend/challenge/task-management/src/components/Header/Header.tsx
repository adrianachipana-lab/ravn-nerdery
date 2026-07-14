import { Bell } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import styles from './Header.module.css';

/*
  REACT CONCEPT: useLocation (React Router Hook)
  -------------------------------------------------
  useLocation nos da info de la URL actual.
  Lo usamos para mostrar el título dinámico del header.
*/

const PAGE_TITLES: Record<string, string> = {
  '/': 'Dashboard',
  '/settings': 'Settings',
  '/my-tasks': 'My Tasks',
  '/team': 'Team',
  '/analytics': 'Analytics',
};

export function Header() {
  const location = useLocation();
  const title = PAGE_TITLES[location.pathname] ?? 'Page';

  return (
    <header className={styles.header}>
      <div className={styles.left}>
        <h1 className={styles.title}>{title}</h1>
      </div>

      <div className={styles.right}>
        <button className={styles.iconButton} aria-label="Notifications">
          <Bell size={20} />
        </button>

        <img
          className={styles.avatar}
          src="https://i.pravatar.cc/150?u=currentuser"
          alt="Profile"
        />
      </div>
    </header>
  );
}
