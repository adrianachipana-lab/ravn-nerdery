import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Spinner } from '../components/ui/Spinner'

describe('Spinner', () => {
  it('renders with loading role', () => {
    render(<Spinner />)
    expect(screen.getByRole('status', { name: /loading/i })).toBeInTheDocument()
  })
})
