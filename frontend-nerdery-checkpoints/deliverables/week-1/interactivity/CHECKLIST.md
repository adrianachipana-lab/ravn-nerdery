# Mentor checklist — Interactivity

Automated tests cover behaviour. Score these manually (they can't be auto-graded):

- [ ] **Effect cleanup** — `useDebouncedValue` clears its `setTimeout` in the
      effect cleanup (`return () => clearTimeout(id)`), so rapid changes reset the
      timer instead of firing stale updates. No timer leaks on unmount.
- [ ] **No `exhaustive-deps` suppressions** — dependency arrays are complete and
      correct. There are **no** `// eslint-disable ... react-hooks/exhaustive-deps`
      comments and no `@ts-ignore`/`@ts-expect-error` escape hatches.
- [ ] **`useId` for label association** — the `<label htmlFor>` / `<input id>`
      pairing uses a `useId()`-generated id (not a hardcoded string), so multiple
      instances stay accessible.
- [ ] **`useRef` focus** — auto-focus uses a ref + effect that runs once on mount
      (empty dep array), not a re-focus on every render.
- [ ] **Debounced vs. raw value** — the UI shows the *debounced* query, and typing
      does not update the displayed `Searching:` text until input settles.
- [ ] **Lift vs. colocate** — the README explains why `query` stays colocated in
      `DebouncedSearch` and reuse is achieved via hooks rather than lifted state.
- [ ] **No console noise** — no React `act(...)` or key warnings during tests.
