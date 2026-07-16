import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Badge } from '../components/ui/Badge'

describe('Badge', () => {
  it('renders the type name', () => {
    render(<Badge typeName="fire" />)
    expect(screen.getByText('fire')).toBeInTheDocument()
  })

  it('applies the correct background color for known types', () => {
    render(<Badge typeName="water" />)
    const badge = screen.getByText('water')
    expect(badge).toHaveStyle({ backgroundColor: '#6890f0' })
  })

  it('uses a fallback color for unknown types', () => {
    render(<Badge typeName="unknown-type" />)
    const badge = screen.getByText('unknown-type')
    expect(badge).toHaveStyle({ backgroundColor: '#888' })
  })
})
