import { describe, it, expect } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Header } from '../components/layout/Header'
import { renderWithProviders } from './test-utils'

describe('Header', () => {
  it('renders navigation links', () => {
    renderWithProviders(<Header />)
    expect(screen.getByRole('link', { name: /pokemon/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /matchups/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /trainers/i })).toBeInTheDocument()
  })

  it('renders the app logo', () => {
    renderWithProviders(<Header />)
    expect(screen.getByText('PokeTeam Builder')).toBeInTheDocument()
  })

  it('renders theme toggle button', () => {
    renderWithProviders(<Header />)
    expect(
      screen.getByRole('button', { name: /switch to dark mode/i }),
    ).toBeInTheDocument()
  })

  it('toggles theme on click', async () => {
    const user = userEvent.setup()
    renderWithProviders(<Header />)

    const toggle = screen.getByRole('button', { name: /switch to dark mode/i })
    await user.click(toggle)

    expect(
      screen.getByRole('button', { name: /switch to light mode/i }),
    ).toBeInTheDocument()
  })
})
