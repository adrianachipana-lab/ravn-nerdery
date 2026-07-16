import { describe, it, expect } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TrainerForm } from '../components/trainer/TrainerForm'
import { renderWithProviders } from './test-utils'

describe('TrainerForm', () => {
  it('renders the form with a labeled input and submit button', () => {
    renderWithProviders(<TrainerForm />)
    expect(screen.getByLabelText(/new trainer name/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /create trainer/i })).toBeInTheDocument()
  })

  it('shows validation error when submitting empty name', async () => {
    const user = userEvent.setup()
    renderWithProviders(<TrainerForm />)

    await user.click(screen.getByRole('button', { name: /create trainer/i }))
    expect(screen.getByRole('alert')).toHaveTextContent(/trainer name is required/i)
  })

  it('clears the input after successful submission', async () => {
    const user = userEvent.setup()
    renderWithProviders(<TrainerForm />)

    const input = screen.getByLabelText(/new trainer name/i)
    await user.type(input, 'Ash Ketchum')
    await user.click(screen.getByRole('button', { name: /create trainer/i }))

    expect(input).toHaveValue('')
  })

  it('does not show error after valid submission', async () => {
    const user = userEvent.setup()
    renderWithProviders(<TrainerForm />)

    await user.click(screen.getByRole('button', { name: /create trainer/i }))
    expect(screen.getByRole('alert')).toBeInTheDocument()

    await user.type(screen.getByLabelText(/new trainer name/i), 'Misty')
    await user.click(screen.getByRole('button', { name: /create trainer/i }))
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })
})
