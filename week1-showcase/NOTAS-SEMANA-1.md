# Notas de estudio — Semana 1

## Contact List

### SearchableContacts — Alternativa con contador para generar IDs
```tsx
// En vez de crypto.randomUUID(), se puede usar un contador simple:
let nextId = initialContacts.length + 1
function handleAdd(newContact: NewContact) {
  setContacts((prev) => [...prev, { ...newContact, id: String(nextId++) }])
}
// Ambos funcionan para este ejercicio. randomUUID es mas robusto,
// el contador es mas simple. Lo importante es saber justificar cual usaste.
```

### ContactForm — Alternativa multi-error (mejor UX)
```tsx
// En vez de un solo error string, usar un array para mostrar TODOS los errores a la vez:
const [errors, setErrors] = useState<string[]>([])

function handleSubmit(e: React.FormEvent) {
  e.preventDefault()
  const newErrors: string[] = []
  if (!name.trim()) newErrors.push('Name is required')
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) newErrors.push('Valid email is required')
  if (newErrors.length > 0) { setErrors(newErrors); return }
  onAdd({ name: name.trim(), email: email.trim(), role: role.trim() })
  setName(''); setEmail(''); setRole(''); setErrors([])
}

// En el return:
{errors.map(err => <p key={err} role="alert">{err}</p>)}

// El test del checkpoint espera error unico, pero en una app real multi-error es mejor UX.
// Se probo en week1-showcase/src/__tests__/contact-form-comparison.test.tsx
```

## Interactivity

### DebouncedSearch — autoFocus como alternativa a useRef + useEffect
```tsx
// En vez de:
const inputRef = useRef<HTMLInputElement>(null)
useEffect(() => { inputRef.current?.focus() }, [])
<input ref={inputRef} ... />

// Se puede usar simplemente:
<input autoFocus ... />

// Ambos hacen lo mismo: dar focus al montar.
// Se uso useRef + useEffect porque el ejercicio pedia demostrar refs y effects.
```

### DebouncedSearch — useLocalStorageState para persistir busqueda
```tsx
// En vez de:
const [query, setQuery] = useState('')

// Se puede usar:
import { useLocalStorageState } from './useLocalStorageState'
const [query, setQuery] = useLocalStorageState('search-query', '')

// Asi el texto de busqueda sobrevive al recargar la pagina.
// No se uso porque podria afectar los tests del debounce.
```

## Conceptos clave para la revision con el mentor

- **Controlado vs No controlado**: si el input tiene value={} es controlado (React manda),
  si tiene defaultValue={} es no controlado (el navegador manda). Casi siempre usar controlado.
- **Functional update (prev)**: usar cuando el nuevo estado depende del anterior.
  setTheme(prev => ...) en vez de setTheme(theme === ...) para evitar race conditions.
- **useCallback**: memoriza funciones para que no se recreen en cada render.
  Necesario cuando la funcion sale de un hook custom o se pasa como prop a hijos.
- **Lazy initializer**: useState(() => ...) ejecuta la funcion solo al montar,
  useState(valor) ejecuta el calculo en cada render aunque React ignore el resultado.
- **ErrorBoundary**: solo atrapa errores en el render, NO en onClick/onSubmit/useEffect.
  Tiene que ser clase porque React no tiene hooks para capturar errores de render.
- **BEM**: Block__Element--Modifier. Convencion para nombrar clases CSS sin colisiones.
- **CSS variables**: permiten cambiar tema sin duplicar clases. Se definen en :root y
  se sobreescriben con [data-theme='dark'].
- **data-theme en el html**: es el puente entre React (JS) y CSS.
  React pone el atributo, CSS lo detecta y cambia las variables.
- **key estable**: usar id, no index. El index cambia cuando filtras/reordenas la lista.
- **role="alert"**: accesibilidad, el screen reader anuncia el contenido automaticamente.
- **e.preventDefault()**: siempre primera linea del handleSubmit para evitar recarga.
