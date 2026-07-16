import React, { createContext, useContext, useState, useEffect } from 'react'
import { fetchUsers, type User } from './api'

interface UsersState {
  users: User[]
  isLoading: boolean
}

interface SelectionState {
  selectedId: string | null
  select: (id: string) => void
}

// separo en dos contexts para que un cambio de seleccion no re-renderice los que solo leen users
const UsersContext = createContext<UsersState | null>(null)
const SelectionContext = createContext<SelectionState | null>(null)

// este provider centraliza el estado de la app: usuarios + seleccion
export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedId, setSelectedId] = useState<string | null>(null)

  // el flag active evita setear state si el componente se desmonto antes de que la api responda
  useEffect(() => {
    let active = true
    fetchUsers().then((result) => {
      if (!active) return
      setUsers(result)
      setIsLoading(false)
    })
    return () => {
      active = false
    }
  }, [])

  // anido los providers, los hijos pueden consumir cualquiera de los dos contexts
  return (
    <UsersContext.Provider value={{ users, isLoading }}>
      <SelectionContext.Provider value={{ selectedId, select: setSelectedId }}>
        {children}
      </SelectionContext.Provider>
    </UsersContext.Provider>
  )
}

// si el context es null significa que no hay provider arriba, tiro error
export function useUsers(): { users: User[]; isLoading: boolean } {
  const ctx = useContext(UsersContext)
  if (!ctx) throw new Error('useUsers must be used within AppStateProvider')
  return ctx
}

// hook para leer y cambiar la seleccion, mismo patron de validar el context
export function useSelectedUser(): {
  selectedId: string | null
  select: (id: string) => void
} {
  const ctx = useContext(SelectionContext)
  if (!ctx) throw new Error('useSelectedUser must be used within AppStateProvider')
  return ctx
}
