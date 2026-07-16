# RAVN Nerdery — Deliverables (Weeks 1–3)

Hands-on deliverables that go with the workshop track. Each one is a small, focused
task with **pre-written acceptance tests** and a **mentor checklist**, so both the
nerd and the reviewer know exactly when it's done.

> Week 4 (capstone) is not included here — you already have your own challenge for it.

## Setup

```bash
npm install
npm run dev      # open the dev server; pick any deliverable from the home page
```

## The deliverables

| Week | Deliverable | Folder | Workshop it follows |
|---|---|---|---|
| 1 | Contact List | `deliverables/week-1/contact-list` | React Fundamentals |
| 1 | Interactivity (hooks) | `deliverables/week-1/interactivity` | React Hooks |
| 1 | Styling & Theme | `deliverables/week-1/styling` | Module 5: Styling & Layout |
| 2 | Typing React | `deliverables/week-2/typescript` | Advanced React with TypeScript |
| 2 | Reducer + Context | `deliverables/week-2/advanced-apis` | Advanced React APIs |
| 2 | Testing | `deliverables/week-2/testing` | Module 6: Testing |
| 3 | Compound Component | `deliverables/week-3/patterns` | Advanced React Patterns |
| 3 | Suspense | `deliverables/week-3/suspense` | React Suspense |
| 3 | Global + Async State | `deliverables/week-3/state-management` | Module 7: State Management |

Each folder has its own `README.md` (requirements + success criteria) and `CHECKLIST.md`
(the manual review items). The nerd edits the files under `src/` until the tests pass.

## How grading works

Every deliverable is graded on **two** things:

1. **Automated acceptance tests** — behaviour the nerd's code must satisfy. These
   ship **failing** (the `src/` files are stubs). "Done" = green.
2. **Manual checklist** (`CHECKLIST.md`) — the things a machine can't judge well:
   accessibility, composition, naming, no console warnings, code quality.

### Commands

```bash
npm run grade          # typecheck + lint + all tests — the full gate
npm test               # all acceptance tests
npm run test:week1     # just week 1  (also :week2, :week3)
npm run typecheck      # strict TS across the repo (no `any`, no @ts-ignore)
npm run lint           # ESLint (bans `any` and ts-ignore)
npm run grade:testing  # week-2 Testing: runs the nerd's tests with the 85% coverage gate
```

Grade a single deliverable:

```bash
npx vitest run deliverables/week-1/contact-list
```

### What "good work" looks like

- `npm run grade` exits 0 (all tests green, strict types, no lint errors), **and**
- `npm run grade:testing` meets the coverage threshold (week-2 Testing), **and**
- every box in each touched deliverable's `CHECKLIST.md` is ticked.

See [`MENTOR.md`](./MENTOR.md) for the review rubric and scoring guidance.

## Notes for nerds

- Only edit files inside a deliverable's `src/` folder (and, for the Testing
  deliverable, its test file). Don't edit the `*.test.tsx` files elsewhere — those
  are the spec you're building against.
- Read the deliverable's `README.md` first: it lists the exact exports and behaviour
  the tests expect.
- Run the tests in watch mode while you work: `npm run test:watch`.
