import { describe, it, expect } from 'vitest'
import { render, screen, renderHook } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {
  cartReducer,
  selectTotal,
  initialCart,
  type CartState,
} from './src/cartReducer'
import { CartProvider, useCart } from './src/CartContext'
import { Cart } from './src/Cart'

describe('cartReducer (pure function)', () => {
  it('add: a new item creates one entry with qty 1', () => {
    const next = cartReducer(initialCart, {
      type: 'add',
      item: { id: 'a', name: 'Apple', price: 2 },
    })
    expect(next.items).toHaveLength(1)
    expect(next.items[0]).toMatchObject({ id: 'a', qty: 1 })
  })

  it('add: adding the same id twice keeps a single entry with qty 2', () => {
    let state: CartState = initialCart
    state = cartReducer(state, { type: 'add', item: { id: 'a', name: 'Apple', price: 2 } })
    state = cartReducer(state, { type: 'add', item: { id: 'a', name: 'Apple', price: 2 } })
    expect(state.items).toHaveLength(1)
    expect(state.items[0].qty).toBe(2)
  })

  it('setQty: changes qty, and setting qty to 0 removes the item', () => {
    let state: CartState = cartReducer(initialCart, {
      type: 'add',
      item: { id: 'a', name: 'Apple', price: 2 },
    })
    state = cartReducer(state, { type: 'setQty', id: 'a', qty: 5 })
    expect(state.items[0].qty).toBe(5)
    state = cartReducer(state, { type: 'setQty', id: 'a', qty: 0 })
    expect(state.items).toHaveLength(0)
  })

  it('remove drops the item; clear empties the cart', () => {
    let state: CartState = initialCart
    state = cartReducer(state, { type: 'add', item: { id: 'a', name: 'Apple', price: 2 } })
    state = cartReducer(state, { type: 'add', item: { id: 'b', name: 'Bread', price: 3 } })
    state = cartReducer(state, { type: 'remove', id: 'a' })
    expect(state.items.map((i) => i.id)).toEqual(['b'])
    state = cartReducer(state, { type: 'clear' })
    expect(state.items).toHaveLength(0)
  })

  it('selectTotal sums price * qty across items', () => {
    let state: CartState = initialCart
    state = cartReducer(state, { type: 'add', item: { id: 'a', name: 'Apple', price: 2 } })
    state = cartReducer(state, { type: 'add', item: { id: 'a', name: 'Apple', price: 2 } })
    state = cartReducer(state, { type: 'add', item: { id: 'b', name: 'Bread', price: 3 } })
    // 2 * 2 + 3 * 1 = 7
    expect(selectTotal(state)).toBe(7)
  })
})

describe('useCart context', () => {
  it('throws when used outside CartProvider', () => {
    expect(() => renderHook(() => useCart())).toThrow()
  })
})

describe('Cart integration', () => {
  it('updates the displayed total after clicking an add button', async () => {
    const user = userEvent.setup()
    render(
      <CartProvider>
        <Cart />
      </CartProvider>,
    )
    expect(screen.getByText(/Total: \$0/)).toBeInTheDocument()
    const addButtons = screen.getAllByRole('button', { name: /add/i })
    await user.click(addButtons[0])
    // Sample product prices are known; after one add the total is no longer $0.
    expect(screen.queryByText(/Total: \$0(\.00)?$/)).not.toBeInTheDocument()
    expect(screen.getByTestId('cart-total')).toHaveTextContent(/Total: \$/)
  })
})
