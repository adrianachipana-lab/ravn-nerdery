# W3 · Suspense — Data Fetching with `use`, Suspense & an Error Boundary

Fetch a list of users and render it with React Suspense. While the request is in
flight a Suspense fallback shows a loading state; if it fails, a class Error
Boundary shows an error message with a **Try again** button that refetches.

The inner component reads the data with React 19's `use(promise)` hook, where the
promise comes from a **module-level cache** (the fetch is kicked off once, not on
every render).

## Requirements

Implement the files in `src/`. `src/api.ts` is provided — it is the module the
tests **mock**; don't change its exported shape.

| File | Export | Must do |
|---|---|---|
| `src/api.ts` | `interface User`, `fetchUsers()` | `User` = `{ id: string; name: string }`. `fetchUsers()` returns `Promise<User[]>` resolving (after a small `setTimeout` delay) to a few users. **Provided.** |
| `src/UsersView.tsx` | `UsersView()` | The full feature (see below). |
| `src/index.tsx` | `default Demo()` | Renders `<UsersView />`. |

`UsersView` must:

- Wrap the data-reading subtree in a **`<Suspense>`** boundary whose `fallback`
  contains the text **"Loading"** (e.g. `<p>Loading…</p>`).
- Wrap that in a class **Error Boundary** whose fallback shows an error message
  **and** a button named **"Try again"**.
- Read the users in an inner component via **`use(promise)`**, where the promise
  comes from a **module-level cache** created by calling `fetchUsers()` once
  (not recreated on every render). Render each user's `name`.
- On **Try again**: clear the cached promise, call `fetchUsers()` again, and reset
  the error boundary so the subtree re-suspends and re-renders (e.g. bump a `key`
  on the boundary to remount it).

## Success criteria (automated)

Run `npx vitest run deliverables/week-3/suspense`. All tests green:

- **Loading → data:** the "Loading" fallback appears, then the fetched user
  (`Ada`) renders.
- **Error → retry → data:** the fetch rejects once, the error fallback with a
  **Try again** button appears, clicking it refetches and renders `Ada`.

## Also reviewed (see `CHECKLIST.md`)

No fetch waterfalls, a genuinely cached promise, a real error boundary, and a
retry that actually refetches — checked by the mentor.
