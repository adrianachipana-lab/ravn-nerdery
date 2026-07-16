import { useState } from 'react'
import type { Contact, NewContact } from '../types'
import { initialContacts } from '../types'
import { ContactList } from '../components/ContactList'
import { ContactForm } from '../components/ContactForm'

export function ContactsView() {
  const [contacts, setContacts] = useState<Contact[]>(initialContacts)
  const [search, setSearch] = useState('')

  const term = search.toLowerCase()
  const filtered = contacts.filter((c) => {
    return c.name.toLowerCase().includes(term) || c.email.toLowerCase().includes(term)
  })

  function handleAdd(newContact: NewContact) {
    setContacts((prev) => [
      ...prev,
      { ...newContact, id: crypto.randomUUID() },
    ])
  }

  return (
    <>
      <div className="main__header">
        <div>
          <h1 className="main__title">Contact List</h1>
          <p className="main__subtitle">Manage your team contacts</p>
        </div>
      </div>

      <div className="grid grid--2">
        <div>
          <div className="section">
            <div className="search">
              <span className="search__icon">Q</span>
              <label htmlFor="search-contacts" className="form__label" style={{ position: 'absolute', left: '-9999px' }}>
                Search contacts
              </label>
              <input
                className="search__input"
                id="search-contacts"
                placeholder="Search contacts..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
          <ContactList contacts={filtered} />
        </div>

        <div className="card">
          <h2 className="card__title">Add New Contact</h2>
          <ContactForm onAdd={handleAdd} />
        </div>
      </div>
    </>
  )
}
