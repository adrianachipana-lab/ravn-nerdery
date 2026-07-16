# Mentor checklist — State Management

Automated tests cover the observable behaviour. Score these manually (they can't
be auto-graded):

- [ ] **No duplicate in-flight requests** — mounting several `useUsers` consumers
      at once triggers a single `fetchUsers` call; concurrent callers await the
      same in-flight promise rather than each starting their own.
- [ ] **Cache reused across components / navigation** — unmounting and
      remounting a consumer (or navigating away and back) serves the cached data
      instead of re-fetching.
- [ ] **Global state genuinely shared** — the selection lives in one place
      (context / query cache / store), not duplicated as local `useState` in each
      component. Changing it in one component is immediately visible in siblings.
- [ ] **Scalable state approach (RAVN)** — server/async data is separated from UI
      state; server state is cached and deduped (TanStack Query or an equivalent
      cache) while shared UI state uses Context or a lightweight store. No prop
      drilling, no ad-hoc global mutable variables leaking across renders.
- [ ] **Loading handled** — consumers render a sensible loading state until the
      data arrives; no flashes of `undefined` or crashes on empty data.
- [ ] **No console noise** — no React `act`/state-update-after-unmount warnings.
