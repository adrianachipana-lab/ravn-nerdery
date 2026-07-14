import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Settings,
  Users,
  BarChart3,
  Folder,
} from 'lucide-react';
import styles from './Sidebar.module.css';

/*
  REACT CONCEPT: Components & JSX
  ---------------------------------
  Un componente es una función que retorna JSX (HTML-like syntax).
  JSX se transforma en React.createElement() calls.

  REACT CONCEPT: NavLink (React Router)
  ---------------------------------
  NavLink es como <a> pero para SPA routing.
  Recibe una función en className que indica si está activo.
*/

const NAV_ITEMS = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/my-tasks', icon: Folder, label: 'My Tasks' },
  { to: '/team', icon: Users, label: 'Team' },
  { to: '/analytics', icon: BarChart3, label: 'Analytics' },
  { to: '/settings', icon: Settings, label: 'Settings' },
];

export function Sidebar() {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.logo}>
        <div className={styles.logoIcon}>
          <LayoutDashboard size={24} />
        </div>
        <span className={styles.logoText}>Task Manager</span>
      </div>

      <nav className={styles.nav}>
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `${styles.navItem} ${isActive ? styles.active : ''}`
            }
          >
            <item.icon size={20} />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
