const recentlyUsed = [
  { name: 'App Project', date: '20.02.2020', members: 2 },
  { name: 'Project: fitbit', date: '28.02.2020', members: 2 },
  { name: 'Client Documents', date: '4.03.2020', members: 3 },
]

const recentFiles = [
  { name: 'Travel Landing Page', members: '5 members', date: 'Mar 8, 2020', color: '#ff6b35' },
  { name: 'True Photos', members: '12 members', date: 'Mar 8, 2020', color: '#22c55e' },
  { name: 'Dashboard Structure', members: '10 members', date: 'Mar 9, 2020', color: '#ef4444' },
  { name: 'Character Illustration', members: '3 members', date: 'Mar 10, 2020', color: '#ff6b35' },
]

const sharedWithMe = [
  { name: 'Landing Page', date: '20.02.2020' },
  { name: 'Illustration Pack', date: '20.02.2020' },
  { name: 'CV Design', date: '20.02.2020' },
]

const storageItems = [
  { name: 'Documents', files: '720 files', size: '200 GB', color: '#ff6b35' },
  { name: 'Documents', files: '720 files', size: '125 GB', color: '#4c6fff' },
  { name: 'Documents', files: '720 files', size: '75 GB', color: '#22c55e' },
  { name: 'Documents', files: '720 files', size: '50 GB', color: '#9ca3af' },
]

function FolderIcon({ color }: { color: string }) {
  return (
    <div style={{
      width: 40,
      height: 32,
      background: color,
      borderRadius: '4px 4px 6px 6px',
      position: 'relative',
    }}>
      <div style={{
        position: 'absolute',
        top: -4,
        left: 0,
        width: 18,
        height: 8,
        background: color,
        borderRadius: '4px 4px 0 0',
      }} />
    </div>
  )
}

function MemberDots({ count }: { count: number }) {
  return (
    <div style={{ display: 'flex', gap: 0 }}>
      {Array.from({ length: Math.min(count, 2) }).map((_, i) => (
        <div key={i} style={{
          width: 24,
          height: 24,
          borderRadius: '50%',
          border: '2px solid var(--color-surface)',
          background: 'var(--color-border)',
          marginLeft: i > 0 ? -8 : 0,
        }} />
      ))}
      {count > 2 && (
        <div style={{
          width: 24,
          height: 24,
          borderRadius: '50%',
          border: '2px solid var(--color-surface)',
          background: 'var(--color-input-bg)',
          marginLeft: -8,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '0.6rem',
          color: 'var(--color-text-secondary)',
          fontWeight: 600,
        }}>
          +{count - 2}
        </div>
      )}
    </div>
  )
}

export function DashboardView() {
  return (
    <>
      <div className="main__header">
        <div>
          <h1 className="main__title">Dashboard</h1>
          <p className="main__subtitle">File management overview</p>
        </div>
      </div>

      <div className="dashboard">
        <div className="dashboard__center">
          {/* Search */}
          <div className="section">
            <div className="search">
              <span className="search__icon">Q</span>
              <input className="search__input" placeholder="Search..." readOnly />
            </div>
          </div>

          {/* Recently Used */}
          <div className="section">
            <h2 className="section__title">Recently Used</h2>
            <div className="dashboard__recently-used">
              {recentlyUsed.map((item) => (
                <div className="file-card" key={item.name}>
                  <div className="file-card__header">
                    <FolderIcon color="#ff6b35" />
                    <MemberDots count={item.members} />
                    <button type="button" className="file-card__menu">...</button>
                  </div>
                  <p className="file-card__name">{item.name}</p>
                  <p className="file-card__date">Created: {item.date}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Files */}
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
                    <FolderIcon color={file.color} />
                    {file.name}
                  </span>
                  <span className="file-table__meta">{file.members}</span>
                  <span className="file-table__meta">{file.date}</span>
                  <button type="button" className="file-card__menu">...</button>
                </div>
              ))}
            </div>
          </div>

          {/* Share with me */}
          <div className="section">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-md)' }}>
              <h2 className="section__title" style={{ marginBottom: 0 }}>Share with me</h2>
              <button type="button" className="link-btn">View All</button>
            </div>
            <div className="dashboard__recently-used">
              {sharedWithMe.map((item) => (
                <div className="file-card" key={item.name}>
                  <div className="file-card__header">
                    <FolderIcon color="#ff6b35" />
                    <MemberDots count={2} />
                  </div>
                  <p className="file-card__name">{item.name}</p>
                  <p className="file-card__date">Created: {item.date}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Panel */}
        <aside className="dashboard__right">
          {/* Storage */}
          <div className="card">
            <h2 className="card__title">Storage</h2>
            <div className="storage-ring">
              <svg viewBox="0 0 120 120" className="storage-ring__svg">
                <circle cx="60" cy="60" r="50" fill="none" stroke="var(--color-border)" strokeWidth="10" />
                <circle cx="60" cy="60" r="50" fill="none" stroke="#4c6fff" strokeWidth="10"
                  strokeDasharray="220 94" strokeDashoffset="0" strokeLinecap="round"
                  transform="rotate(-90 60 60)" />
                <circle cx="60" cy="60" r="50" fill="none" stroke="#22c55e" strokeWidth="10"
                  strokeDasharray="50 264" strokeDashoffset="-220" strokeLinecap="round"
                  transform="rotate(-90 60 60)" />
                <circle cx="60" cy="60" r="50" fill="none" stroke="#ff6b35" strokeWidth="10"
                  strokeDasharray="30 284" strokeDashoffset="-270" strokeLinecap="round"
                  transform="rotate(-90 60 60)" />
                <text x="60" y="55" textAnchor="middle" fontSize="20" fontWeight="700" fill="var(--color-text)">85%</text>
                <text x="60" y="72" textAnchor="middle" fontSize="11" fill="var(--color-text-secondary)">Used</text>
              </svg>
            </div>
            <p style={{ textAlign: 'center', fontSize: '0.8rem', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-md)' }}>
              420.2 GB of 500 GB used
            </p>

            <div className="storage-list">
              {storageItems.map((item, i) => (
                <div className="storage-list__item" key={i}>
                  <FolderIcon color={item.color} />
                  <div className="storage-list__info">
                    <p className="storage-list__name">{item.name}</p>
                    <p className="storage-list__files">{item.files}</p>
                  </div>
                  <span className="storage-list__size">{item.size}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Upgrade */}
          <div className="card upgrade-card">
            <div className="upgrade-card__gradient" />
            <p className="upgrade-card__title">Buy more space now!</p>
            <p className="upgrade-card__subtitle">Upgrade to cloud premium</p>
            <button type="button" className="upgrade-card__btn">Upgrade Account!</button>
          </div>
        </aside>
      </div>
    </>
  )
}
