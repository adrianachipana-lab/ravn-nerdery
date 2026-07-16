import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ThemeProvider } from './src/ThemeProvider'
import { ThemeToggle } from './src/ThemeToggle'

function Harness() {
  return (
    <ThemeProvider>
      <ThemeToggle />
    </ThemeProvider>
  )
}

describe('styling / theme', () => {
  it('defaults to the light theme', async () => {
    render(<Harness />)
    // Wait for the button so the theme effect has run.
    await screen.findByRole('button')
    expect(document.documentElement.dataset.theme).toBe('light')
  })

  it('switches to dark when the toggle is clicked', async () => {
    const user = userEvent.setup()
    render(<Harness />)
    const button = await screen.findByRole('button')
    await user.click(button)
    expect(document.documentElement.dataset.theme).toBe('dark')
    expect(screen.getByRole('button', { name: /dark/i })).toBeInTheDocument()
  })

  it('persists the chosen theme to localStorage', async () => {
    const user = userEvent.setup()
    render(<Harness />)
    const button = await screen.findByRole('button')
    await user.click(button)
    expect(localStorage.getItem('theme')).toBe('dark')
  })

  it('throws when useTheme is used outside a ThemeProvider', () => {
    // Suppress the expected React error boundary log for the thrown render.
    const spy = vi.spyOn(console, 'error').mockImplementation(() => undefined)
    expect(() => render(<ThemeToggle />)).toThrow()
    spy.mockRestore()
  })
})
