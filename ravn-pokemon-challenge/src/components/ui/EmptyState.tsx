import './EmptyState.css'

export function EmptyState({ message }: { message: string }) {
  return (
    <div className="empty-state">
      <p className="empty-state__text">{message}</p>
    </div>
  )
}
