import { sidebarMenuItems, sidebarUploadItems } from '../data'

export function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar__logo">
        <div className="sidebar__logo-icon" />
      </div>

      <nav className="sidebar__nav">
        {sidebarMenuItems.map((label, i) => (
          <button
            key={label}
            type="button"
            className={`sidebar__item${i === 0 ? ' sidebar__item--active' : ''}`}
          >
            <div className="sidebar__icon" />
            <span>{label}</span>
          </button>
        ))}
      </nav>

      <div className="sidebar__footer">
        <div className="sidebar__upload-list">
          {sidebarUploadItems.map((label) => (
            <div key={label} className="sidebar__upload-item">
              <div className="sidebar__upload-check" />
              <span>{label}</span>
            </div>
          ))}
        </div>
        <button type="button" className="sidebar__create-btn">
          <span>Create New</span>
          <span className="sidebar__create-plus">+</span>
        </button>
      </div>
    </aside>
  )
}
