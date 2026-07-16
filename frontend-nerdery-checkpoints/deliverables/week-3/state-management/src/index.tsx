import { AppStateProvider } from './AppState'
import { UsersScreen } from './UsersScreen'
import { SelectedUserBadge } from './SelectedUserBadge'

/**
 * Demo wiring: a single `AppStateProvider` shares the fetched-once user list
 * and the global selection between two sibling components.
 */
export default function Demo() {
  return (
    <AppStateProvider>
      <SelectedUserBadge />
      <UsersScreen />
    </AppStateProvider>
  )
}
