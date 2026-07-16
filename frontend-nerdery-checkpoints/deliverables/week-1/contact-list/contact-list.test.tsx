import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { SearchableContacts } from './src/SearchableContacts'
import { ErrorBoundary } from './src/ErrorBoundary'

describe('SearchableContacts', () => {
  it('renders all initial contacts on load', () => {
    render(<SearchableContacts />)
    expect(screen.getByText('Ada Lovelace')).toBeInTheDocument()
    expect(screen.getByText('Grace Hopper')).toBeInTheDocument()
    expect(screen.getByText('Margaret Hamilton')).toBeInTheDocument()
  })

  it('filters the list as you type in the search box', async () => {
    const user = userEvent.setup()
    render(<SearchableContacts />)
    await user.type(screen.getByLabelText(/search contacts/i), 'grace')
    expect(screen.getByText('Grace Hopper')).toBeInTheDocument()
    expect(screen.queryByText('Ada Lovelace')).not.toBeInTheDocument()
  })

  it('shows a validation error and adds nothing when the form is empty', async () => {
    const user = userEvent.setup()
    render(<SearchableContacts />)
    const before = screen.getAllByText(/@ravn\.co/).length
    await user.click(screen.getByRole('button', { name: /add/i }))
    expect(screen.getByRole('alert')).toBeInTheDocument()
    expect(screen.getAllByText(/@ravn\.co/).length).toBe(before)
  })

  it('adds a valid contact to the list', async () => {
    const user = userEvent.setup()
    render(<SearchableContacts />)
    await user.type(screen.getByLabelText(/name/i), 'Barbara Liskov')
    await user.type(screen.getByLabelText(/email/i), 'barbara@ravn.co')
    await user.type(screen.getByLabelText(/role/i), 'Engineer')
    await user.click(screen.getByRole('button', { name: /add/i }))
    expect(screen.getByText('Barbara Liskov')).toBeInTheDocument()
  })
})

describe('ErrorBoundary', () => {
  function Boom(): React.ReactNode {
    throw new Error('boom')
  }

  it('renders a fallback when a child throws', () => {
    render(
      <ErrorBoundary>
        <Boom />
      </ErrorBoundary>,
    )
    expect(screen.getByRole('alert')).toHaveTextContent(/something went wrong/i)
  })
})
