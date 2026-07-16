import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Pagination } from '../components/ui/Pagination'

describe('Pagination', () => {
  it('renders page info', () => {
    render(
      <Pagination page={2} totalPages={10} onPrev={vi.fn()} onNext={vi.fn()} />,
    )
    expect(screen.getByText('Page 2 of 10')).toBeInTheDocument()
  })

  it('disables Previous on first page', () => {
    render(
      <Pagination page={1} totalPages={5} onPrev={vi.fn()} onNext={vi.fn()} />,
    )
    expect(screen.getByRole('button', { name: /previous/i })).toBeDisabled()
  })

  it('disables Next on last page', () => {
    render(
      <Pagination page={5} totalPages={5} onPrev={vi.fn()} onNext={vi.fn()} />,
    )
    expect(screen.getByRole('button', { name: /next/i })).toBeDisabled()
  })

  it('calls onPrev when Previous is clicked', async () => {
    const user = userEvent.setup()
    const onPrev = vi.fn()
    render(
      <Pagination page={3} totalPages={5} onPrev={onPrev} onNext={vi.fn()} />,
    )
    await user.click(screen.getByRole('button', { name: /previous/i }))
    expect(onPrev).toHaveBeenCalledOnce()
  })

  it('calls onNext when Next is clicked', async () => {
    const user = userEvent.setup()
    const onNext = vi.fn()
    render(
      <Pagination page={3} totalPages={5} onPrev={vi.fn()} onNext={onNext} />,
    )
    await user.click(screen.getByRole('button', { name: /next/i }))
    expect(onNext).toHaveBeenCalledOnce()
  })
})
