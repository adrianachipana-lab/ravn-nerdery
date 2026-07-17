import { recentlyUsed, sharedWithMe } from '../data'
import { FileCard } from './FileCard'
import { FileTable } from './FileTable'
import { StoragePanel } from './StoragePanel'
import { UpgradeCard } from './UpgradeCard'

export function Dashboard() {
  return (
    <div className="dashboard">
      <div className="dashboard__center">
        {/* Search */}
        <div className="section">
          <div className="search">
            <span className="search__icon" />
            <input className="search__input" placeholder="Search" readOnly />
          </div>
        </div>

        {/* Recently Used */}
        <div className="section">
          <div className="section__header">
            <h2 className="section__title" style={{ marginBottom: 0 }}>Recently Used</h2>
            <div className="section__view-toggles">
              <div className="section__view-toggle" />
              <div className="section__view-toggle" />
            </div>
          </div>
          <div className="dashboard__recently-used">
            {recentlyUsed.map((item) => (
              <FileCard key={item.name} name={item.name} date={item.date} members={item.members} doubleIcon />
            ))}
          </div>
        </div>

        {/* Recent Files */}
        <FileTable />

        {/* Share with me */}
        <div className="section">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-md)' }}>
            <h2 className="section__title" style={{ marginBottom: 0 }}>Share with me</h2>
            <button type="button" className="link-btn">View All</button>
          </div>
          <div className="dashboard__recently-used">
            {sharedWithMe.map((item) => (
              <FileCard
                key={item.name}
                name={item.name}
                date={item.date}
                memberColors={item.memberColors}
                showMenu={false}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <aside className="dashboard__right">
        <StoragePanel />
        <UpgradeCard />
      </aside>
    </div>
  )
}
