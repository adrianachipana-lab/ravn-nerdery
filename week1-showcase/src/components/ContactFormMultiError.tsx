import { useState } from 'react'
import type { NewContact } from '../types'

// Version alternativa: muestra TODOS los errores a la vez
export function ContactFormMultiError({ onAdd }: { onAdd: (contact: NewContact) => void }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [role, setRole] = useState('')
  const [errors, setErrors] = useState<string[]>([])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    // acumulo todos los errores en vez de parar en el primero
    const newErrors: string[] = []
    if (!name.trim()) newErrors.push('Name is required')
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) newErrors.push('Valid email is required')

    if (newErrors.length > 0) {
      setErrors(newErrors)
      return
    }

    onAdd({ name: name.trim(), email: email.trim(), role: role.trim() })
    setName('')
    setEmail('')
    setRole('')
    setErrors([])
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="multi-name">Name</label>
        <input id="multi-name" value={name} onChange={(e) => setName(e.target.value)} />
      </div>
      <div>
        <label htmlFor="multi-email">Email</label>
        <input id="multi-email" value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>
      <div>
        <label htmlFor="multi-role">Role</label>
        <input id="multi-role" value={role} onChange={(e) => setRole(e.target.value)} />
      </div>
      {errors.length > 0 && (
        <div role="alert">
          {errors.map((err) => (
            <p key={err}>{err}</p>
          ))}
        </div>
      )}
      <button type="submit">Add contact</button>
    </form>
  )
}
