import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import * as api from './src/api'
import { AppStateProvider } from './src/AppState'
import { UsersScreen } from './src/UsersScreen'
import { SelectedUserBadge } from './src/SelectedUserBadge'

// Spy on the network layer so tests are deterministic and we can count calls.
beforeEach(() => {
  vi.spyOn(api, 'fetchUsers').mockResolvedValue([
    { id: '1', name: 'Ada' },
    { id: '2', name: 'Grace' },
  ])
})

afterEach(() => {
  vi.restoreAllMocks()
})

describe('AppState — async cache + dedupe', () => {
  it('fetches users only ONCE even when multiple components call useUsers', async () => {
    render(
      <AppStateProvider>
        <UsersScreen />
        <UsersScreen />
      </AppStateProvider>,
    )

    // Wait until the loaded data is on screen (both consumers render it).
    await waitFor(() => {
      expect(screen.getAllByText('Ada').length).toBeGreaterThan(0)
    })

    // The shared cache/dedupe means a single request regardless of consumers.
    expect(api.fetchUsers).toHaveBeenCalledTimes(1)
  })
})

describe('AppState — shared global selection', () => {
  it('lets sibling components share the selected user', async () => {
    const user = userEvent.setup()
    render(
      <AppStateProvider>
        <UsersScreen />
        <SelectedUserBadge />
      </AppStateProvider>,
    )

    // Nothing selected yet.
    expect(screen.getByText('Selected: none')).toBeInTheDocument()

    // Wait for the users to load, then pick "Grace" in UsersScreen.
    const graceButton = await screen.findByRole('button', { name: 'Grace' })
    await user.click(graceButton)

    // The sibling badge reflects the selection — proving shared global state.
    await waitFor(() => {
      expect(screen.getByText('Selected: Grace')).toBeInTheDocument()
    })
  })
})
