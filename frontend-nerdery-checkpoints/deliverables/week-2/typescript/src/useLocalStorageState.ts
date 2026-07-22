import { useState, useCallback, useEffect } from 'react'

// hook que sincroniza estado con localStorage
// es como useState pero el valor sobrevive recargas de pagina
export function useLocalStorageState<T>(
  key: string,
  initialValue: T,
): [T, (value: T | ((prev: T) => T)) => void] {
  // lazy init: lee de localStorage solo al montar, si no hay nada usa initialValue
  const [state, setState] = useState<T>(() => {
    const stored = localStorage.getItem(key)
    return stored !== null ? (JSON.parse(stored) as T) : initialValue
  })

  useEffect(() => {
    // siempre guardo en localStorage cuando el estado cambia
    localStorage.setItem(key, JSON.stringify(state))
  }, [key, state])

  // uso useCallback para que la referencia de setValue sea estable
  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      setState((prev) => {
        // si value es funcion la ejecuto con el prev, si no uso el valor directo
        return typeof value === 'function' ? (value as (prev: T) => T)(prev) : value
      })
    },
    [],
  )

  return [state, setValue]
}
