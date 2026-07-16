# W1 · Contact List — React Fundamentals

Build a searchable contact list with reusable, composed components, an accessible
form, and an error boundary. This is the base app you'll keep building on.

## Requirements

Implement the files in `src/` so the exports below behave as described.
`src/types.ts` (the `Contact` type + `initialContacts` data) is provided — don't change it.

| File | Export | Must do |
|---|---|---|
| `src/ContactCard.tsx` | `ContactCard({ contact })` | Render the contact's `name`, `email`, and `role`. |
| `src/ContactList.tsx` | `ContactList({ contacts })` | Render one card per contact with a stable `key`. When the array is empty, render the text **"No contacts found"**. |
| `src/ContactForm.tsx` | `ContactForm({ onAdd })` | Accessible form (every input has a `<label>`). Fields: **Name**, **Email**, **Role**. On submit: validate (name required; email must look like an email). If invalid, show an error message and **do not** call `onAdd`. If valid, call `onAdd(newContact)` and clear the fields. |
| `src/SearchableContacts.tsx` | `SearchableContacts()` | Compose the pieces: a search input labelled **"Search contacts"** that filters the list by name **or** email (case-insensitive), the `ContactList`, and the `ContactForm` (adding a contact appends it to the list). |
| `src/ErrorBoundary.tsx` | `ErrorBoundary` (class) | Render `children` normally; if a child throws during render, catch it and show a fallback with `role="alert"` containing **"Something went wrong"**. |

## Success criteria (automated)

Run `npm run test:week1` (or `npx vitest run deliverables/week-1/contact-list`). All tests green:

- All initial contacts render on load.
- Typing in the search box filters the list.
- Submitting the empty form shows a validation error and adds nothing.
- Submitting a valid form adds the contact to the list.
- The error boundary shows its fallback when a child throws.

## Also reviewed (see `CHECKLIST.md`)

Component composition, accessibility, and no console warnings — checked by the mentor.
