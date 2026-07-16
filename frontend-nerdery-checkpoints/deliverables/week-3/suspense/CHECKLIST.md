# Mentor checklist — Suspense

Automated tests cover the loading/error/retry behaviour. Score these manually:

- [ ] **No fetch waterfalls** — the request is started once, up front (module-level
      cache), not sequentially nested inside child renders that each fetch.
- [ ] **Promise is cached** — the promise passed to `use()` is a stable, cached
      value, **not** a fresh `fetchUsers()` call on every render. Re-rendering the
      subtree without retrying must not trigger a new request.
- [ ] **Retry actually refetches** — "Try again" clears the cache and calls
      `fetchUsers()` again (verify a second network call fires), rather than
      replaying the already-settled promise.
- [ ] **Error boundary is a real boundary** — a class component implementing
      `getDerivedStateFromError` / `componentDidCatch` that catches the thrown
      rejection, not a try/catch or conditional around the fetch.
- [ ] **Boundary resets on retry** — after a successful retry the error fallback is
      gone and the boundary can catch a future error again (state was reset, e.g.
      via remount).
