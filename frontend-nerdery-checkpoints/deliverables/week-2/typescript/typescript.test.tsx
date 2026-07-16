import { describe, it, expect } from 'vitest'
import { render, screen, renderHook, act } from '@testing-library/react'
import { StatusBanner } from './src/StatusBanner'
import { useLocalStorageState } from './src/useLocalStorageState'

describe('StatusBanner', () => {
  it('renders "Ready" for the idle status', () => {
    render(<StatusBanner state={{ status: 'idle' }} />)
    expect(screen.getByText('Ready')).toBeInTheDocument()
  })

  it('renders "Submitting…" for the submitting status', () => {
    render(<StatusBanner state={{ status: 'submitting' }} />)
    expect(screen.getByText('Submitting…')).toBeInTheDocument()
  })

  it('renders "Saved #42" for a success status with id "42"', () => {
    render(<StatusBanner state={{ status: 'success', id: '42' }} />)
    expect(screen.getByText('Saved #42')).toBeInTheDocument()
  })

  it('renders the message inside role="alert" for an error status', () => {
    render(<StatusBanner state={{ status: 'error', message: 'Boom' }} />)
    expect(screen.getByRole('alert')).toHaveTextContent('Boom')
  })
})

describe('useLocalStorageState', () => {
  it('works with a number type and persists to localStorage', () => {
    const { result } = renderHook(() => useLocalStorageState<number>('count', 0))

    act(() => {
      result.current[1](5)
    })

    expect(result.current[0]).toBe(5)
    expect(JSON.parse(localStorage.getItem('count') as string)).toBe(5)
  })

  it('works with an object type (generic reused with a second type)', () => {
    const { result } = renderHook(() => useLocalStorageState('profile', { count: 0 }))

    act(() => {
      result.current[1]({ count: 3 })
    })

    expect(result.current[0].count).toBe(3)
  })
})
