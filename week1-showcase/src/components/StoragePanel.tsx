import { storageItems } from '../data'
import { SquareIcon } from './SquareIcon'
import { StorageRing } from './StorageRing'
import { TopBar } from './TopBar'

export function StoragePanel() {
  return (
    <div className="card storage-card">
      <TopBar />
      <h2 className="card__title">Storage</h2>
      <StorageRing />
      <p style={{ textAlign: 'center', fontSize: '10px', color: 'var(--color-text-secondary)', marginTop: '2px', marginBottom: 'var(--space-xl)' }}>
        420.2 GB of 500 GB used
      </p>
      <div className="storage-list">
        {storageItems.map((item, i) => (
          <div className="storage-list__item" key={i}>
            <div style={{ width: 34, height: 34, background: item.color, borderRadius: 6, flexShrink: 0 }} />
            <div className="storage-list__info">
              <p className="storage-list__name">{item.name}</p>
              <p className="storage-list__files">{item.files}</p>
            </div>
            <span className="storage-list__size">{item.size}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
