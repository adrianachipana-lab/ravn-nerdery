import { useTheme } from '../context/ThemeContext'

const cards = [
  { title: 'Design tokens', body: 'Colors come from CSS variables, not hex literals.' },
  { title: 'Runtime theming', body: 'Toggle light/dark without a reload; choice is persisted.' },
  { title: 'Responsive layout', body: 'The grid reflows from 1 to 3 columns as the viewport grows.' },
]

export function StylingView() {
  const { theme, toggle } = useTheme()

  return (
    <>
      <div className="main__header">
        <div>
          <h1 className="main__title">Styling & Theme</h1>
          <p className="main__subtitle">CSS Variables, BEM, and responsive layout</p>
        </div>
        <button type="button" className="theme-toggle-btn" onClick={toggle}>
          Theme: {theme}
        </button>
      </div>

      <div className="styling-grid">
        {cards.map((card) => (
          <article className="styling-card" key={card.title}>
            <h2 className="styling-card__title">{card.title}</h2>
            <p className="styling-card__body">{card.body}</p>
          </article>
        ))}
      </div>
    </>
  )
}
