import type { Contact } from '../types'

export function ContactCard({ contact }: { contact: Contact }) {
  const initial = contact.name.charAt(0).toUpperCase()

  return (
    <div className="contact-card">
      <div className="contact-card__avatar">{initial}</div>
      <div className="contact-card__info">
        <p className="contact-card__name">{contact.name}</p>
        <p className="contact-card__email">{contact.email}</p>
      </div>
      <span className="contact-card__role">{contact.role}</span>
    </div>
  )
}
