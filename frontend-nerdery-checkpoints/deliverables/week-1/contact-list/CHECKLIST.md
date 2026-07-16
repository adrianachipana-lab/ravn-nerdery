# Mentor checklist — Contact List

Automated tests cover behaviour. Score these manually (they can't be auto-graded):

- [ ] **Composition** — `SearchableContacts` composes `ContactList`/`ContactCard`/`ContactForm` rather than one giant component.
- [ ] **Keys** — list uses `contact.id` as `key`, not the array index.
- [ ] **Accessibility** — inputs are associated with labels (clicking the label focuses the input); the error message is announced (`role="alert"` or `aria-live`).
- [ ] **No console noise** — no React key/act warnings in the test or dev console.
- [ ] **State** — new contacts get a unique `id` (not a duplicate or empty string).
