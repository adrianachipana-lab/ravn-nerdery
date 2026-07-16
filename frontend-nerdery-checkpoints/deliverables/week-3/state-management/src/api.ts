export interface User {
  id: string
  name: string
}

const SAMPLE_USERS: User[] = [
  { id: '1', name: 'Ada' },
  { id: '2', name: 'Grace' },
  { id: '3', name: 'Linus' },
]

/**
 * Simulates an async network request for the list of users.
 * Resolves after a small delay so callers must handle a loading state.
 * Tests mock/spy this function.
 */
export function fetchUsers(): Promise<User[]> {
  return new Promise((resolve) => {
    window.setTimeout(() => resolve(SAMPLE_USERS), 50)
  })
}
