import { NavLink } from 'react-router-dom'
import { useTheme } from '../../context/theme-context'
import './Header.css'

export function Header() {
  const { theme, toggle } = useTheme()

  return (
    <header className="header">
      <h1 className="header__logo">PokeTeam Builder</h1>
      <div className="header__right">
        <nav className="header__nav" aria-label="Main navigation">
          <NavLink to="/" className="header__link" end>
            Pokemon
          </NavLink>
          <NavLink to="/matchups" className="header__link">
            Matchups
          </NavLink>
          <NavLink to="/trainers" className="header__link">
            Trainers
          </NavLink>
        </nav>
        <button
          type="button"
          className="header__theme-toggle"
          onClick={toggle}
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          {theme === 'light' ? '\u263D' : '\u2600'}
        </button>
      </div>
    </header>
  )
}
