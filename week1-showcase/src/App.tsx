import { useState } from 'react'
import { ThemeProvider } from './context/ThemeContext'
import { Sidebar, type View } from './components/Sidebar'
import { DashboardView } from './views/DashboardView'
import { ContactsView } from './views/ContactsView'
import { InteractivityView } from './views/InteractivityView'
import { StylingView } from './views/StylingView'

function Content({ view }: { view: View }) {
  switch (view) {
    case 'dashboard':
      return <DashboardView />
    case 'contacts':
      return <ContactsView />
    case 'interactivity':
      return <InteractivityView />
    case 'styling':
      return <StylingView />
  }
}

export default function App() {
  const [view, setView] = useState<View>('dashboard')

  return (
    <ThemeProvider>
      <div className="layout">
        <Sidebar activeView={view} onNavigate={setView} />
        <main className="main">
          <Content view={view} />
        </main>
      </div>
    </ThemeProvider>
  )
}
