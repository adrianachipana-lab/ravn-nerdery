# W2 · Advanced APIs — useReducer + Context

Build a shopping cart whose state lives in a `useReducer` reducer and is shared
through a typed React Context. Components read and mutate the cart through a
single consumer hook (`useCart`) that fails loudly when used outside its provider.

## Requirements

Implement the files in `src/` so the exports below behave as described.

| File | Export | Must do |
|---|---|---|
| `src/cartReducer.ts` | `CartItem`, `CartState`, `CartAction`, `initialCart` | `CartAction` is a **discriminated union** (no `any`). `initialCart` is `{ items: [] }`. |
| `src/cartReducer.ts` | `cartReducer(state, action)` | **Pure function.** `add`: if the id exists, increment its `qty`, else push a new item with `qty: 1`. `remove`: drop the item by id. `setQty`: set the item's `qty` (remove it if `qty <= 0`). `clear`: empty the cart. Never mutate `state`. |
| `src/cartReducer.ts` | `selectTotal(state)` | Return the sum of `price * qty` across all items. |
| `src/CartContext.tsx` | `CartProvider({ children })` | Own the cart state via `useReducer`; expose `state`, `total`, and action dispatchers through context. |
| `src/CartContext.tsx` | `useCart()` | Return `{ state, total, add, remove, setQty, clear }`. **Throw a clear error** when called outside `CartProvider`. |
| `src/Cart.tsx` | `Cart()` | Render the items, a total like `Total: $X`, and buttons to add sample products / remove an item / clear the cart, all via `useCart`. |
| `src/index.tsx` | `default Demo()` | Render `<CartProvider><Cart/></CartProvider>`. |

## Success criteria (automated)

Run `npx vitest run deliverables/week-2/advanced-apis`. All tests green:

- Reducer `add` creates one entry with `qty 1`; adding the same id twice yields a single entry with `qty 2`.
- `setQty` changes the quantity, and setting it to `0` removes the item.
- `remove` drops one item; `clear` empties the cart.
- `selectTotal` sums `price * qty` across items.
- `useCart` throws when rendered outside `CartProvider`.
- Rendering `<CartProvider><Cart/></CartProvider>` and clicking an add button updates the displayed total.

## Also reviewed (see `CHECKLIST.md`)

Reducer purity, action typing, the outside-provider guard, and focus management
after mutations — checked by the mentor.
