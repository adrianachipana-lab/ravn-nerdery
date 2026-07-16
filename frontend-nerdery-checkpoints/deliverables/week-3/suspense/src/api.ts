export interface User {
  id: string
  name: string
}

const SAMPLE_USERS: User[] = [
  { id: '1', name: 'Ada Lovelace' },
  { id: '2', name: 'Alan Turing' },
  { id: '3', name: 'Grace Hopper' },
]

// Simulates a network request. Tests MOCK this function to control
// resolution/rejection, so the real delay never runs under test.
export function fetchUsers(): Promise<User[]> {
  return new Promise((resolve) => {
    window.setTimeout(() => resolve(SAMPLE_USERS), 300)
  })
}
