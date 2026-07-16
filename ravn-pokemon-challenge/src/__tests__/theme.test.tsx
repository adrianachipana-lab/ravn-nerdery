import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ThemeProvider, useTheme } from '../context/theme-context'

function ThemeDisplay() {
  const { theme, toggle } = useTheme()
  return (
    <div>
      <span>Current: {theme}</span>
      <button type="button" onClick={toggle}>Toggle</button>
    </div>
  )
}

describe('ThemeProvider', () => {
  it('defaults to light theme', () => {
    render(
      <ThemeProvider>
        <ThemeDisplay />
      </ThemeProvider>,
    )
    expect(screen.getByText('Current: light')).toBeInTheDocument()
  })

  it('toggles to dark on click', async () => {
    const user = userEvent.setup()
    render(
      <ThemeProvider>
        <ThemeDisplay />
      </ThemeProvider>,
    )
    await user.click(screen.getByRole('button', { name: /toggle/i }))
    expect(screen.getByText('Current: dark')).toBeInTheDocument()
    expect(document.documentElement.dataset.theme).toBe('dark')
  })

  it('persists theme to localStorage', async () => {
    const user = userEvent.setup()
    render(
      <ThemeProvider>
        <ThemeDisplay />
      </ThemeProvider>,
    )
    await user.click(screen.getByRole('button', { name: /toggle/i }))
    expect(localStorage.getItem('theme')).toBe('dark')
  })

  it('throws when useTheme is used outside provider', () => {
    expect(() => render(<ThemeDisplay />)).toThrow()
  })
})
