import { useState } from 'react'
import type { NewContact } from '../types'

export function ContactForm({ onAdd }: { onAdd: (contact: NewContact) => void }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [role, setRole] = useState('')
  const [error, setError] = useState('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!name.trim()) {
      setError('Name is required')
      return
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Valid email is required')
      return
    }

    onAdd({ name: name.trim(), email: email.trim(), role: role.trim() })
    setName('')
    setEmail('')
    setRole('')
    setError('')
  }

  return (
    <form className="form" onSubmit={handleSubmit}>
      <div className="form__group">
        <label className="form__label" htmlFor="contact-name">Name</label>
        <input className="form__input" id="contact-name" value={name} onChange={(e) => setName(e.target.value)} />
      </div>
      <div className="form__group">
        <label className="form__label" htmlFor="contact-email">Email</label>
        <input className="form__input" id="contact-email" value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>
      <div className="form__group">
        <label className="form__label" htmlFor="contact-role">Role</label>
        <input className="form__input" id="contact-role" value={role} onChange={(e) => setRole(e.target.value)} />
      </div>
      {error && <p className="form__error" role="alert">{error}</p>}
      <button className="form__submit" type="submit">Add contact</button>
    </form>
  )
}
