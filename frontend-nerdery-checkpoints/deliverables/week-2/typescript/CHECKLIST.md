# Mentor checklist — TypeScript

Automated gates cover typing and behaviour. Score these manually:

- [ ] **Props typed precisely** — no `any`, no `@ts-ignore`, no `as unknown as …`
      laundering. `StatusBanner` takes `{ state: FormState }`, not a loose object.
- [ ] **Exhaustive switch with a `never` guard** — `describeState` handles all four
      cases and its `default` branch does `const _exhaustive: never = state`. **Verify it
      bites:** temporarily add a `{ status: 'cancelled' }` member to `FormState`; the
      `default` assignment must now fail `npm run typecheck`. Revert after checking.
- [ ] **Generic genuinely reused** — `useLocalStorageState<T>` is called with **2+
      different types** (e.g. `number` and an object) and stays type-safe at each call
      site — the returned value/setter are typed as `T`, not `any`/`unknown`.
- [ ] **Hydration + persistence** — the hook reads `localStorage` on mount and writes on
      change; the functional updater form (`setValue(prev => …)`) works.
- [ ] **No console noise** — no React key/act warnings in the test or dev console.
