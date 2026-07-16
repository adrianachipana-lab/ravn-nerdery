# Mentor checklist — Testing module

Coverage is graded automatically (`npm run grade:testing`, 85% threshold).
Score the following manually — they measure test *quality*, not just coverage:

- [ ] **Behaviour-focused** — tests query by role/label/text (`getByRole`,
      `getByLabelText`, `getByText`), not by implementation details (no reaching
      into component state, class names, test ids, or DOM structure).
- [ ] **`userEvent` over `fireEvent`** — user interactions (type, click, check)
      use `@testing-library/user-event` where natural, not raw `fireEvent`.
- [ ] **Happy path covered** — adding a todo and seeing it in the list.
- [ ] **Edge case covered** — empty / whitespace-only input adds nothing.
- [ ] **Async interaction** — `userEvent` calls are `await`ed; assertions use
      `findBy*` / `await` where the UI updates asynchronously.
- [ ] **No arbitrary timeouts** — no `setTimeout`, no fixed `waitFor` delays;
      wait on the DOM reaching the expected state instead.
- [ ] **Deterministic** — tests pass in isolation and in any order; no shared
      mutable state leaking between tests, no reliance on wall-clock time.
- [ ] **Clear intent** — each `it(...)` name states the behaviour under test and
      the test asserts exactly that.
