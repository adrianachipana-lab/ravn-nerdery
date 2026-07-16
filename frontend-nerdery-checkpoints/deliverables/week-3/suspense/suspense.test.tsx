import { render, screen, act, fireEvent } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { User } from './src/api'

// Mock the data module so tests control resolution/rejection.
vi.mock('./src/api')

const ADA: User[] = [{ id: '1', name: 'Ada' }]

// A promise whose settlement we control, so the Suspense fallback is observable
// while it is pending and settles deterministically inside `act`.
function deferred<T>() {
  let resolve!: (value: T) => void
  let reject!: (reason: unknown) => void
  const promise = new Promise<T>((res, rej) => {
    resolve = res
    reject = rej
  })
  // Defensive: keep an unconsumed rejection from surfacing as an "unhandled
  // rejection" while the component is still a stub. React's use()/boundary attach
  // their own handlers, so this no-op catch does not affect the solved behaviour.
  promise.catch(() => {})
  return { promise, resolve, reject }
}

// Flush pending microtasks + a macrotask tick so React commits the resumed
// (or errored) Suspense boundary before we assert.
const flush = () => new Promise<void>((resolve) => window.setTimeout(resolve, 0))

// UsersView keeps a module-level promise cache, so each test needs a fresh
// module instance. Reset the registry, then re-import both the (mocked) api and
// the view so they share the same freshly-configured mock.
beforeEach(() => {
  vi.resetModules()
})

async function setup() {
  const api = await import('./src/api')
  const { UsersView } = await import('./src/UsersView')
  return { fetchUsers: vi.mocked(api.fetchUsers), UsersView }
}

describe('UsersView — Suspense for data fetching', () => {
  it('shows the loading fallback, then the fetched users', async () => {
    const { fetchUsers, UsersView } = await setup()
    const data = deferred<User[]>()
    fetchUsers.mockReturnValue(data.promise)

    await act(async () => {
      render(<UsersView />)
    })

    // Promise still pending → Suspense fallback is visible.
    expect(screen.getByText(/loading/i)).toBeInTheDocument()

    await act(async () => {
      data.resolve(ADA)
      await flush()
    })

    expect(await screen.findByText('Ada')).toBeInTheDocument()
  })

  it('shows the error fallback, then refetches and renders data on retry', async () => {
    const { fetchUsers, UsersView } = await setup()
    const first = deferred<User[]>()
    const second = deferred<User[]>()
    // First fetch rejects; the retry's fetch resolves.
    fetchUsers.mockReturnValueOnce(first.promise).mockReturnValueOnce(second.promise)

    await act(async () => {
      render(<UsersView />)
    })

    await act(async () => {
      first.reject(new Error('boom'))
      await flush()
    })

    const retry = await screen.findByRole('button', { name: /try again/i })
    await act(async () => {
      fireEvent.click(retry)
    })

    // Retry cleared the cache and refetched → suspends again on the new promise.
    expect(screen.getByText(/loading/i)).toBeInTheDocument()

    await act(async () => {
      second.resolve(ADA)
      await flush()
    })

    expect(await screen.findByText('Ada')).toBeInTheDocument()
  })
})
