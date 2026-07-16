import { useEffect, useState } from 'react'

// basicamente el debounce espera a que dejes de escribir antes de actualizar
// si el valor cambia antes de que pase el delay, se cancela el timer anterior
export function useDebounce<T>(value: T, delayMs: number): T {
  const [debounced, setDebounced] = useState(value)

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delayMs)
    // el cleanup limpia el timer si el valor cambia antes de que se ejecute
    return () => clearTimeout(timer)
  }, [value, delayMs])

  return debounced
}
