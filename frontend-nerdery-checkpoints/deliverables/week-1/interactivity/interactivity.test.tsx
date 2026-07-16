import { describe, it, expect, vi } from 'vitest'
import { render, screen, renderHook, act } from '@testing-library/react'
import { useDebouncedValue } from './src/useDebouncedValue'
import { useLocalStorageState } from './src/useLocalStorageState'
import { DebouncedSearch } from './src/DebouncedSearch'

describe('useDebouncedValue', () => {
  it('updates the returned value only after the delay elapses', () => {
    vi.useFakeTimers()
    const { result, rerender } = renderHook(
      ({ value }) => useDebouncedValue(value, 300),
      { initialProps: { value: 'first' } },
    )

    expect(result.current).toBe('first')

    rerender({ value: 'second' })
    // Immediately after the change the OLD value is still returned.
    expect(result.current).toBe('first')

    act(() => {
      vi.advanceTimersByTime(300)
    })
    expect(result.current).toBe('second')

    vi.useRealTimers()
  })
})

describe('useLocalStorageState', () => {
  it('persists updates to localStorage', () => {
    const { result } = renderHook(() => useLocalStorageState('count', 0))

    act(() => {
      result.current[1](5)
    })

    expect(JSON.parse(localStorage.getItem('count') as string)).toBe(5)
  })

  it('hydrates initial state from localStorage when present', () => {
    localStorage.setItem('count', JSON.stringify(42))

    const { result } = renderHook(() => useLocalStorageState('count', 0))

    expect(result.current[0]).toBe(42)
  })
})

describe('DebouncedSearch', () => {
  it('auto-focuses the search input on mount', () => {
    render(<DebouncedSearch />)
    const input = screen.getByLabelText(/search/i)
    expect(input).toHaveFocus()
  })

  it('associates the "Search" label with the input', () => {
    render(<DebouncedSearch />)
    // getByLabelText resolving at all proves the label is associated;
    // assert it points at the <input> element specifically.
    expect(screen.getByLabelText(/search/i).tagName).toBe('INPUT')
  })
})
