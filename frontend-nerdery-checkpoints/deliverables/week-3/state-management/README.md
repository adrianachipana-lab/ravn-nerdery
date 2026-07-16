# W3 · State Management — async cache + shared global state

Fetch data **once**, cache and dedupe it so many components share a single
request, and share a piece of **global state** (the selected user) across
sibling components under one provider.

You MAY solve this with **TanStack Query** (a per-provider `QueryClient` handles
the fetch-once/cache/dedupe) **or** with a plain **Context + in-memory cache**.
Both approaches pass the automated tests — the contract below is
implementation-agnostic.

## Requirements

Implement the files in `src/` so the exports below behave as described.

| File | Export | Must do |
|---|---|---|
| `src/api.ts` | `User`, `fetchUsers()` | `User` is `{ id: string; name: string }`. `fetchUsers` resolves (after a small delay) to a few users. Tests mock/spy this. |
| `src/AppState.tsx` | `AppStateProvider({ children })` | Owns the shared user cache and the global selection for everything rendered inside it. |
| `src/AppState.tsx` | `useUsers()` | Returns `{ users, isLoading }`. Fetches via `fetchUsers` and **caches/dedupes** so that if multiple components call it, `fetchUsers` runs **exactly once**. |
| `src/AppState.tsx` | `useSelectedUser()` | Returns `{ selectedId, select }`. The selection is **global** — every consumer under the provider reads and writes the same value. |
| `src/UsersScreen.tsx` | `UsersScreen()` | Renders each user's name with a button (accessible name = the user's name) that calls `select(id)`. |
| `src/SelectedUserBadge.tsx` | `SelectedUserBadge()` | Shows the selected user's name via `useSelectedUser` + `useUsers`, e.g. `Selected: Ada` or `Selected: none`. |
| `src/index.tsx` | `default Demo()` | Renders `<AppStateProvider>` wrapping both `UsersScreen` and `SelectedUserBadge`. |

## Success criteria (automated)

Run `npx vitest run deliverables/week-3/state-management`. All tests green:

- **Dedupe/cache** — with two components both calling `useUsers`, after the data
  appears, `fetchUsers` was called **exactly once**
  (`expect(fetchUsers).toHaveBeenCalledTimes(1)`).
- **Shared global state** — clicking the `Grace` button in `UsersScreen` makes
  `SelectedUserBadge` show `Selected: Grace`, proving the two siblings share one
  global selection.

## Also reviewed (see `CHECKLIST.md`)

No duplicate in-flight requests, cache reuse across components/navigation,
genuinely shared (not duplicated) global state, and RAVN's scalable approach to
state — checked by the mentor.
