# Semana 1 - Preguntas de mentor

Usa este archivo para practicar respuestas de revision tecnica. Responde debajo de cada pregunta con tus palabras.

## Contact List

### 1. useState vs useEffect en formularios

En `ContactForm.tsx` usaste varios `useState`:

```tsx
const [name, setName] = useState('')
const [email, setEmail] = useState('')
const [role, setRole] = useState('')
const [error, setError] = useState('')
```

Por que aqui tiene sentido usar `useState` para los inputs, y por que no seria correcto resolver esto con `useEffect`?

Respuesta:


### 2. Inputs controlados vs FormData

En `ContactForm`, cada input es controlado:

```tsx
<input
  id="contact-name"
  value={name}
  onChange={(e) => setName(e.target.value)}
/>
```

Por que decidiste hacerlo como controlled component con `value` y `onChange`, en vez de dejar el input sin estado y leer el valor con `FormData` o `ref` al hacer submit?

Respuesta:


### 3. Validacion con trim

En `handleSubmit` haces esto:

```tsx
if (!name.trim()) {
  setError('Name is required')
  return
}
```

Por que usas `trim()` para validar el nombre? Que bug tendrias si validaras solo con `if (!name)`?

Respuesta:


### 4. Estado derivado

En `SearchableContacts.tsx` calculas los contactos filtrados asi:

```tsx
const filtered = contacts.filter((c) => {
  const term = search.toLowerCase()
  return c.name.toLowerCase().includes(term) || c.email.toLowerCase().includes(term)
})
```

Por que `filtered` no esta guardado en otro `useState`? Por que lo calculas directamente durante el render?

Respuesta:


### 5. Calculos dentro de filter

En la logica de busqueda haces esto dentro del `filter`:

```tsx
const term = search.toLowerCase()
```

Por que podria ser mejor mover `const term = search.toLowerCase()` afuera del `.filter()`? Y por que en este caso tampoco es un problema grave dejarlo como esta?

Respuesta:


### 6. Actualizacion funcional de estado

En `handleAdd` usas actualizacion funcional:

```tsx
setContacts((prev) => [
  ...prev,
  { ...newContact, id: crypto.randomUUID() },
])
```

Por que usaste `setContacts((prev) => ...)` en vez de esto?

```tsx
setContacts([
  ...contacts,
  { ...newContact, id: crypto.randomUUID() },
])
```

Respuesta:


### 7. Keys estables

En `ContactList.tsx` usas:

```tsx
<ContactCard key={contact.id} contact={contact} />
```

Por que usas `contact.id` como `key` y no el indice del array?

Respuesta:


### 8. Accesibilidad en errores

En `ContactForm`, el error se guarda asi:

```tsx
const [error, setError] = useState('')
```

y se renderiza asi:

```tsx
{error && <p role="alert">{error}</p>}
```

Por que `role="alert"` es importante aqui? Que problema habria si solo renderizas un `<p>{error}</p>` normal?

Respuesta:


### 9. ErrorBoundary como clase

En `ErrorBoundary.tsx` hiciste un componente de clase:

```tsx
export class ErrorBoundary extends Component<Props, State> {
```

Por que no usaste un componente funcional con hooks para esto? Existe un `useErrorBoundary` nativo en React?

Respuesta:


### 10. Logging en ErrorBoundary

Tu `ErrorBoundary` tiene esto:

```tsx
componentDidCatch(error: Error, info: ErrorInfo) {
  console.error('ErrorBoundary caught:', error, info)
}
```

En un proyecto real, dejarias ese `console.error` asi? Que otra opcion seria mejor?

Respuesta:


## Interactivity

### 11. Query vs debounced value

En `DebouncedSearch.tsx` tienes esto:

```tsx
const [query, setQuery] = useState('')
const debounced = useDebouncedValue(query, 300)
```

Por que necesitas dos valores: `query` y `debounced`? Por que no usar solo `query`?

Respuesta:


### 12. useEffect en debounce

En `useDebouncedValue.ts` usas:

```tsx
useEffect(() => {
  const timer = setTimeout(() => setDebounced(value), delayMs)
  return () => clearTimeout(timer)
}, [value, delayMs])
```

Por que aqui si tiene sentido usar `useEffect`? Que efecto externo o asincrono estas coordinando?

Respuesta:


### 13. Cleanup del timer

En el debounce limpias el timeout:

```tsx
return () => clearTimeout(timer)
```

Que bug tendrias si no limpiaras el timer cuando `value` cambia rapido?

Respuesta:


### 14. useRef para focus

En `DebouncedSearch.tsx` usas:

```tsx
const inputRef = useRef<HTMLInputElement>(null)

useEffect(() => {
  inputRef.current?.focus()
}, [])
```

Por que usas `useRef` para enfocar el input y no `useState`?

Respuesta:


### 15. useId para accesibilidad

En `DebouncedSearch.tsx` usas:

```tsx
const id = useId()
```

Por que `useId` es una buena opcion para conectar `label` e `input`? Que problema podria aparecer si hardcodeas el mismo id en varios componentes reutilizados?

Respuesta:


### 16. LocalStorage y lazy initializer

En `useLocalStorageState.ts` inicializas el estado asi:

```tsx
const [state, setState] = useState<T>(() => {
  const stored = localStorage.getItem(key)
  return stored !== null ? (JSON.parse(stored) as T) : initialValue
})
```

Por que usas una funcion dentro de `useState` en vez de leer `localStorage` directamente antes del hook?

Respuesta:


### 17. Riesgo de JSON.parse

En `useLocalStorageState.ts` usas:

```tsx
JSON.parse(stored) as T
```

Que pasaria si el valor guardado en `localStorage` no es JSON valido? Como podrias hacerlo mas robusto?

Respuesta:


## Styling & Theme

### 18. Context para tema

En `ThemeProvider.tsx` creaste un contexto para `theme` y `toggle`.

Por que tiene sentido usar Context aqui en vez de pasar `theme` y `toggle` por props manualmente?

Respuesta:


### 19. useEffect para sincronizar el tema

En `ThemeProvider.tsx` tienes:

```tsx
useEffect(() => {
  document.documentElement.dataset.theme = theme
  localStorage.setItem('theme', theme)
}, [theme])
```

Por que aqui si corresponde usar `useEffect`? Que cosas externas a React estas sincronizando?

Respuesta:


### 20. Valor inicial desde localStorage

El tema se inicializa asi:

```tsx
const [theme, setTheme] = useState<Theme>(() => {
  const stored = localStorage.getItem('theme')
  return stored === 'dark' ? 'dark' : 'light'
})
```

Por que validas especificamente `stored === 'dark'` en vez de aceptar cualquier string guardado?

Respuesta:


### 21. Custom hook useTheme

Tu hook `useTheme` hace esto:

```tsx
if (value === null) {
  throw new Error('useTheme must be used within a ThemeProvider')
}
```

Por que es mejor lanzar un error claro si `useTheme` se usa fuera del provider?

Respuesta:


### 22. useCallback en toggle

En `ThemeProvider.tsx` usas:

```tsx
const toggle = useCallback(() => {
  setTheme((prev) => (prev === 'light' ? 'dark' : 'light'))
}, [])
```

Por que podrias usar `useCallback` aqui? Y por que tambien seria aceptable no usarlo en una app pequena?

Respuesta:


### 23. Estado minimo

En general, que valores de semana 1 son estado real y cuales son valores derivados?

Ejemplos: `contacts`, `search`, `filtered`, `query`, `debounced`, `theme`, `error`.

Respuesta:


### 24. Cuándo usar useEffect

Explica con tus palabras cuando si usarias `useEffect` y cuando no.

Da un ejemplo de tu codigo donde si corresponde y uno donde no corresponde.

Respuesta:


### 25. Alternativas

Si tuvieras que rehacer `ContactForm`, que alternativa elegirias?

Opciones: inputs controlados con `useState`, `FormData` en submit, `useReducer`, una libreria de forms.

Explica que opcion eliges para este caso y por que.

Respuesta:


## Mas preguntas de revision

### 26. Responsabilidad de componentes

Por que `ContactCard` solo recibe `contact` y no maneja estado propio?

Respuesta:


### 27. Composicion

Por que `SearchableContacts` compone `ContactList` y `ContactForm` en vez de poner todo el JSX en un solo componente grande?

Respuesta:


### 28. Lifting state up

Por que el estado `contacts` vive en `SearchableContacts` y no dentro de `ContactList`?

Respuesta:


### 29. Callback onAdd

Por que `ContactForm` recibe `onAdd` por props en vez de importar o modificar directamente la lista de contactos?

Respuesta:


### 30. Tipo NewContact vs Contact

En `types.ts` existen `Contact` y `NewContact`.

Por que el formulario trabaja con `NewContact` y no con `Contact` completo?

Respuesta:


### 31. Generacion de id

En `handleAdd` generas el id con:

```tsx
crypto.randomUUID()
```

Por que necesitas generar un id para el contacto nuevo? Que alternativas existen?

Respuesta:


### 32. Riesgo de crypto.randomUUID

Que considerarias si la app tuviera que correr en navegadores antiguos donde `crypto.randomUUID()` no existe?

Respuesta:


### 33. Busqueda case-insensitive

Por que conviertes `search`, `name` y `email` a lowercase antes de comparar?

Respuesta:


### 34. Busqueda por role

El requerimiento dice filtrar por nombre o email.

Si el usuario pide filtrar tambien por `role`, donde cambiarias el codigo? Que impacto tendria en tests?

Respuesta:


### 35. Empty state

Por que `ContactList` muestra `"No contacts found"` cuando el array esta vacio?

Respuesta:


### 36. Empty state y accesibilidad

Si quisieras hacer el empty state mas accesible, que podrias cambiar o agregar?

Respuesta:


### 37. HTML semantico para lista

Ahora `ContactList` usa un `<div>`.

Cuando tendria sentido usar `<ul>` y `<li>` para renderizar los contactos?

Respuesta:


### 38. Inputs con type

El input de email esta asi:

```tsx
<input id="contact-email" value={email} onChange={(e) => setEmail(e.target.value)} />
```

Por que podria ser mejor usar `type="email"`?

Respuesta:


### 39. Validacion nativa vs validacion custom

Que diferencia hay entre validar email con regex en React y usar validacion nativa del navegador con `type="email"` y `required`?

Respuesta:


### 40. Mensajes de error

Actualmente hay un solo estado `error`.

Que limitacion tiene esto si quieres mostrar errores separados para `name`, `email` y `role`?

Respuesta:


### 41. useReducer en formularios

En que momento considerarias cambiar los estados del formulario a `useReducer`?

Respuesta:


### 42. Estado agrupado

Otra alternativa seria:

```tsx
const [form, setForm] = useState({ name: '', email: '', role: '' })
```

Que ventajas y desventajas tiene frente a usar tres `useState` separados?

Respuesta:


### 43. Reset del formulario

Despues de guardar haces:

```tsx
setName('')
setEmail('')
setRole('')
setError('')
```

Por que limpias tambien el error?

Respuesta:


### 44. Prevencion del submit nativo

En `handleSubmit` llamas:

```tsx
e.preventDefault()
```

Que pasaria si no lo hicieras?

Respuesta:


### 45. Tipado del evento

En `handleSubmit` usas:

```tsx
function handleSubmit(e: React.FormEvent) {
```

Que tipo mas especifico podrias usar para indicar que el evento viene de un formulario?

Respuesta:


### 46. Props inline types

En `ContactCard` escribiste:

```tsx
export function ContactCard({ contact }: { contact: Contact })
```

Cuando dejarias ese tipo inline y cuando crearias una interfaz `ContactCardProps`?

Respuesta:


### 47. Tests orientados a usuario

Los tests usan:

```tsx
screen.getByLabelText(/name/i)
screen.getByRole('button', { name: /add/i })
```

Por que es mejor probar por label/role que por clases CSS o ids?

Respuesta:


### 48. A11y y labels

Que problema habria si los inputs tuvieran placeholder pero no label?

Respuesta:


### 49. Controlled input y performance

Cada tecla en un input controlado causa un render.

Por que esto normalmente esta bien? Cuando podria ser un problema?

Respuesta:


### 50. useMemo para filtered

Considerarias usar `useMemo` para `filtered`?

```tsx
const filtered = useMemo(() => contacts.filter(...), [contacts, search])
```

Por que si o por que no en este caso?

Respuesta:


### 51. Debounce en busqueda de contactos

En `SearchableContacts` la busqueda filtra inmediatamente.

Cuando tendria sentido aplicar debounce aqui?

Respuesta:


### 52. ErrorBoundary coverage

Que tipos de errores captura un Error Boundary? Captura errores dentro de eventos como `onClick`?

Respuesta:


### 53. Fallback custom

Tu `ErrorBoundary` acepta una prop `fallback`.

Para que sirve permitir un fallback custom? Que ventaja tiene frente a hardcodear siempre el mismo mensaje?

Respuesta:


### 54. componentDidCatch vs getDerivedStateFromError

Que responsabilidad tiene `getDerivedStateFromError` y cual tiene `componentDidCatch`?

Respuesta:


### 55. Console warnings en tests

El test del ErrorBoundary imprime un error intencional.

Como distinguirias entre un warning esperado por test y un problema real que deberias arreglar?

Respuesta:


### 56. useEffect dependencies

En `useDebouncedValue`, el effect depende de:

```tsx
[value, delayMs]
```

Por que `delayMs` tambien debe estar en el array de dependencias?

Respuesta:


### 57. Stale closures

Que es un stale closure en React? Donde podria pasar si usas estado anterior incorrectamente?

Respuesta:


### 58. LocalStorage como side effect

En `useLocalStorageState`, guardas en `localStorage` dentro del setter.

Que diferencia tendria guardarlo en un `useEffect` que dependa de `state`?

Respuesta:


### 59. SSR y localStorage

Que problema tendrias si este codigo corriera en server-side rendering?

```tsx
localStorage.getItem(key)
```

Respuesta:


### 60. Try/catch en localStorage

Por que podria fallar `localStorage.setItem`? Que harias para evitar que rompa toda la app?

Respuesta:


### 61. useCallback en setter custom

En `useLocalStorageState`, `setValue` usa `useCallback`.

Que problema intenta evitar? Es estrictamente necesario?

Respuesta:


### 62. Generic hook

`useLocalStorageState<T>` usa generics.

Que ventaja tiene hacerlo generico en vez de aceptar solo strings?

Respuesta:


### 63. ThemeProvider y re-render

Cada vez que cambia `theme`, el provider cambia el valor:

```tsx
<ThemeContext.Provider value={{ theme, toggle }}>
```

Que componentes vuelven a renderizar cuando cambia el contexto?

Respuesta:


### 64. Memoizar value del context

Considerarias memoizar el value del provider?

```tsx
const value = useMemo(() => ({ theme, toggle }), [theme, toggle])
```

Por que si o por que no?

Respuesta:


### 65. data-theme

Por que guardar el tema en `document.documentElement.dataset.theme` puede ser util para CSS?

Respuesta:


### 66. Preferencia del sistema

Como agregarias soporte para detectar `prefers-color-scheme` si no hay tema guardado en localStorage?

Respuesta:


### 67. Persistencia de tema

Por que guardas el tema en `localStorage`? Que otras opciones existen?

Respuesta:


### 68. Custom hook error

Por que `useTheme` lanza un error si se usa fuera del provider en vez de devolver un valor default?

Respuesta:


### 69. Nombres de componentes

Que te dice el nombre `SearchableContacts` sobre la responsabilidad del componente? Lo cambiarias?

Respuesta:


### 70. Comentarios en codigo

Tu codigo tiene varios comentarios explicando cada paso.

En un proyecto real, cuales comentarios dejarias y cuales eliminarias?

Respuesta:


### 71. Separacion de archivos

Por que cada componente esta en su propio archivo? Cuando preferirias tener varios componentes pequenos en el mismo archivo?

Respuesta:


### 72. Imports de tipos

Usas:

```tsx
import type { Contact } from './types'
```

Que ventaja tiene `import type`?

Respuesta:


### 73. Estado inicial importado

`initialContacts` se importa desde `types.ts`.

Que problema podria haber si mutaras directamente `initialContacts` en vez de copiarlo al estado?

Respuesta:


### 74. Inmutabilidad

Por que agregas contactos con:

```tsx
[...prev, newContact]
```

en vez de hacer `prev.push(newContact)`?

Respuesta:


### 75. Orden de contactos

Actualmente agregas nuevos contactos al final.

Como cambiaria el codigo si producto pidiera que los nuevos contactos aparezcan primero?

Respuesta:


### 76. Validacion de email

Tu regex de email es basica.

Por que validar email perfectamente con regex suele ser mala idea?

Respuesta:


### 77. Errores y UX

Despues de mostrar un error, cuando deberia desaparecer? Al escribir de nuevo, al hacer submit valido, o al corregir el campo?

Respuesta:


### 78. Boton submit

Por que el boton tiene `type="submit"`? Que pasaria si fuera `type="button"`?

Respuesta:


### 79. Orden visual

Por que renderizas primero busqueda, luego lista, luego formulario? Que otra estructura podria ser mejor dependiendo del producto?

Respuesta:


### 80. Checklist manual

Ademas de que pasen los tests, que cosas revisarias manualmente antes de decir que el entregable esta listo?

Respuesta:
