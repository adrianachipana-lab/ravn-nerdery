import { Link } from 'react-router-dom'
import './Pages.css'

export function NotFoundPage() {
  return (
    <div className="page not-found">
      <h2 className="page__title">404 — Page Not Found</h2>
      <p>The page you are looking for does not exist.</p>
      <Link to="/" className="page__action-link">
        Go back to browsing Pokemon
      </Link>
    </div>
  )
}
