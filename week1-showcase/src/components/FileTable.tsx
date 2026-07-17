import { recentFiles } from '../data'

function RoundedSquare({ color, size = 28 }: { color: string; size?: number }) {
  return (
    <div style={{
      width: size,
      height: size,
      background: color,
      borderRadius: 6,
      flexShrink: 0,
    }} />
  )
}

export function FileTable() {
  return (
    <div className="section">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-md)' }}>
        <h2 className="section__title" style={{ marginBottom: 0 }}>Recent Files</h2>
        <button type="button" className="link-btn">View All</button>
      </div>
      <div className="file-table">
        <div className="file-table__header">
          <span>Name</span>
          <span>Members</span>
          <span>Last Modified</span>
          <span></span>
        </div>
        {recentFiles.map((file) => (
          <div className="file-table__row" key={file.name}>
            <span className="file-table__name">
              <RoundedSquare color={file.color} />
              {file.name}
            </span>
            <span className="file-table__meta">{file.members}</span>
            <span className="file-table__meta">{file.date}</span>
            <button type="button" className="file-card__menu">&#8942;</button>
          </div>
        ))}
      </div>
    </div>
  )
}
