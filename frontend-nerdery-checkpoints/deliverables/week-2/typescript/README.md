# W2 · TypeScript — Discriminated Unions, Exhaustiveness & a Generic Hook

Apply TypeScript to React. Model a form's lifecycle as a **discriminated union**,
exhaust it safely with a `never` assertion, and build **one reusable generic hook**
that works with more than one type.

## Requirements

Implement the files in `src/` so the exports below behave as described.

| File | Export | Must do |
|---|---|---|
| `src/formState.ts` | `type FormState` | Discriminated union: `{ status: 'idle' }` \| `{ status: 'submitting' }` \| `{ status: 'success'; id: string }` \| `{ status: 'error'; message: string }`. |
| `src/formState.ts` | `describeState(state)` | **Exhaustive** `switch` on `state.status`: `idle`→`'Ready'`, `submitting`→`'Submitting…'`, `success`→`` `Saved #${id}` ``, `error`→the `message`. The `default` branch must assert `const _exhaustive: never = state` so adding a new union case is a **compile error**. |
| `src/useLocalStorageState.ts` | `useLocalStorageState<T>(key, initialValue)` | Generic hook returning `[T, (value: T \| ((prev: T) => T)) => void]`. Hydrate from `localStorage` on mount; persist on every change. Must be reusable across types (no `any`). |
| `src/StatusBanner.tsx` | `StatusBanner({ state })` | Render `describeState(state)`. When `state.status === 'error'`, wrap the text in an element with `role="alert"`. |
| `src/index.tsx` | `default Demo()` | Runnable demo: buttons cycle through the `FormState` variants and render `StatusBanner`. |

## Success criteria (automated)

Grading runs three gates. **All must pass.**

1. **Strict typing** — `npm run typecheck` (runs `tsc --noEmit`). No `any`, no `@ts-ignore`
   anywhere; both are hard errors in this repo.
2. **Lint** — `npm run lint`. `@typescript-eslint/no-explicit-any` and `ban-ts-comment`
   are **errors**, so any escape hatch fails the build.
3. **Behaviour** — `npx vitest run deliverables/week-2/typescript`. All tests green:
   - `StatusBanner` renders the correct text for each of the 4 statuses (and puts the
     error message inside `role="alert"`).
   - `useLocalStorageState` stores a **number** and persists it to `localStorage`.
   - `useLocalStorageState` stores an **object** — proving the generic is reused with a
     second type.

## Also reviewed (see `CHECKLIST.md`)

Precise prop typing, the exhaustiveness `never` guard, and genuine generic reuse are
checked manually by the mentor.
