import { useTheme } from '../context/ThemeContext'

export type View = 'dashboard' | 'contacts' | 'interactivity' | 'styling'

const menuItems: { id: View; label: string }[] = [
  { id: 'dashboard', label: 'Home' },
  { id: 'contacts', label: 'Contact List' },
  { id: 'interactivity', label: 'Interactivity' },
  { id: 'styling', label: 'Styling & Theme' },
]

interface SidebarProps {
  activeView: View
  onNavigate: (view: View) => void
}

export function Sidebar({ activeView, onNavigate }: SidebarProps) {
  const { theme, toggle } = useTheme()

  return (
    <aside className="sidebar">
      <div className="sidebar__logo">
        <div className="sidebar__logo-icon" />
        <span className="sidebar__logo-text">RAVN Nerdery</span>
      </div>

      <nav className="sidebar__nav">
        {menuItems.map((item) => (
          <button
            key={item.id}
            type="button"
            className={`sidebar__item${activeView === item.id ? ' sidebar__item--active' : ''}`}
            onClick={() => onNavigate(item.id)}
          >
            <div className="sidebar__icon" />
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="sidebar__footer">
        <button type="button" className="sidebar__theme-btn" onClick={toggle}>
          <span>{theme === 'light' ? 'Dark Mode' : 'Light Mode'}</span>
        </button>
      </div>
    </aside>
  )
}
