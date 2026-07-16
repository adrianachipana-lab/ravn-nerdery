// Provided — do not modify.
export interface Contact {
  id: string
  name: string
  email: string
  role: string
}

export interface NewContact {
  name: string
  email: string
  role: string
}

export const initialContacts: Contact[] = [
  { id: '1', name: 'Ada Lovelace', email: 'ada@ravn.co', role: 'Engineer' },
  { id: '2', name: 'Alan Turing', email: 'alan@ravn.co', role: 'Engineer' },
  { id: '3', name: 'Grace Hopper', email: 'grace@ravn.co', role: 'Manager' },
  { id: '4', name: 'Katherine Johnson', email: 'katherine@ravn.co', role: 'Designer' },
  { id: '5', name: 'Margaret Hamilton', email: 'margaret@ravn.co', role: 'Engineer' },
]
