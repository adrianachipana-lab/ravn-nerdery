# Mentor checklist — Advanced APIs (useReducer + Context)

Automated tests cover behaviour. Score these manually (they can't be auto-graded):

- [ ] **Pure reducer** — `cartReducer` is a pure function: same inputs → same output, no side effects, and it never mutates the incoming `state` (returns new arrays/objects).
- [ ] **Typed action union** — `CartAction` is a discriminated union keyed on `type`; the `switch` is exhaustive. **No `any`** and **no `@ts-` comments** anywhere.
- [ ] **Provider guard** — `useCart` throws a clear, human-readable error when used outside `CartProvider` (not a vague "cannot read property of null").
- [ ] **Focus management** — after a mutation that removes an item (Remove / Clear / setQty→0), focus is returned to a sensible element (e.g. the triggering region or the add controls) rather than being lost to `document.body`. *Manual check.*
- [ ] **No console noise** — no React key/act warnings in the test or dev console.
