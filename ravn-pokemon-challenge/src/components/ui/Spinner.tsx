import './Spinner.css'

export function Spinner({ size = 40 }: { size?: number }) {
  return (
    <div className="spinner-container" role="status" aria-label="Loading">
      <div className="spinner" style={{ width: size, height: size }} />
    </div>
  )
}
