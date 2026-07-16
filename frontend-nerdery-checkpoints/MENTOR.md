# Mentor Guide — Reviewing Nerd Deliverables

This repo is built so you can grade quickly and consistently. Each deliverable ships
with failing acceptance tests; the nerd's job is to make them pass while following
the manual checklist.

## Fast path to a grade

```bash
npm install
npm run grade          # typecheck + lint + all acceptance tests
npm run grade:testing  # week-2 Testing coverage gate (separate)
```

- **All green + `grade:testing` passes** → the nerd met the objective bar. Now do
  the manual review below.
- **Red** → open the failing deliverable, run it in isolation
  (`npx vitest run deliverables/<week>/<name>`), and read that folder's `README.md`
  to see which behaviour is missing.

## Two-part score per deliverable

| Part | Source | Weight (suggested) |
|---|---|---|
| Automated tests pass | `npx vitest run <folder>` | 60% |
| Manual checklist | the folder's `CHECKLIST.md` | 40% |

The automated part is pass/fail per test. The manual part is where you judge quality:
composition, accessibility, naming, effect hygiene, no console warnings, and whether the
solution reflects the concept the workshop was teaching (not just "tests are green").

## Reviewing for real understanding

Green tests prove behaviour, not understanding. Spot-check:

- **Contact List** — is it composed from small components, or one giant one? Keys by `id`?
- **Interactivity** — do effects clean up? Any `eslint-disable react-hooks/exhaustive-deps`?
- **Styling** — real tokens (CSS variables) and responsive reflow, or hard-coded values?
- **Typing React** — zero `any`/`@ts-ignore`? Does the exhaustive `switch` use a `never`
  check (add a union case and confirm it fails to compile)?
- **Reducer + Context** — is the reducer pure? Does `useCart` throw outside its provider?
- **Testing** — behaviour-focused queries (role/label), not implementation details? An
  edge case (empty input) and an async interaction covered — not just the happy path?
- **Compound Component** — context used internally (no prop drilling)? ARIA correct?
- **Suspense** — is the promise cached (not recreated each render)? Does retry refetch?
- **Global + Async State** — one fetch shared across components (check the call count),
  and is the selection genuinely global?

## Anti-gaming

- Tests import specific exports with specific behaviour; hard-coding return values to
  satisfy one assertion usually breaks another.
- `npm run typecheck` + `npm run lint` block `any`, `@ts-ignore`, and unused code.
- For the Testing deliverable, the 85% **coverage gate** means the nerd can't pass by
  writing one trivial test.
- If you want a stronger gate, keep a private copy of the deliverable `README`s and ask
  the nerd to explain one design choice verbally.
