# W2 · Testing — Write the Test Suite

This deliverable is **inverted**. Unlike the other modules, the app is already
written for you: `src/TodoApp.tsx` is **provided and correct**. Your job is to
write the **test suite** for it in `TodoApp.test.tsx`, following RAVN testing
standards.

## What `TodoApp` does

`TodoApp` (exported from `src/TodoApp.tsx`) is a small Todo app:

- An input labelled **"New todo"** and an **"Add"** button. Adding a non-empty
  todo appends it to the list (text is trimmed; empty/whitespace input is
  ignored). The input clears after a successful add.
- A list where each todo has a **checkbox** (accessible name = the todo text)
  that toggles its completed state, and a **"Delete"** button.
- Filter buttons **All / Active / Completed** that change which todos are shown.
- A count rendered as **`{n} left`** showing how many todos are not completed.

## Your task

Fill in `TodoApp.test.tsx`. A starter file is provided with one passing smoke
test and a set of `it.todo(...)` placeholders. Replace each placeholder with a
real test. Behaviours you should cover:

- **Add** — typing a todo and clicking Add (or submitting) shows it in the list.
- **Ignore empty** — clicking Add with an empty or whitespace-only input adds
  nothing.
- **Toggle** — checking a todo's checkbox marks it completed; unchecking undoes it.
- **Delete** — the Delete button removes that todo from the list.
- **Filter: Active** — only not-completed todos are visible.
- **Filter: Completed** — only completed todos are visible.
- **Filter: All** — every todo is visible again.
- **Count** — the `{n} left` text reflects the number of active todos and
  updates as you add/toggle.

(The assertions are up to you — that's the point of the exercise.)

## Your grade

1. **All your tests pass** — `npx vitest run deliverables/week-2/testing`.
2. **Coverage meets 85%** — `npm run grade:testing`
   (= `vitest run --coverage deliverables/week-2/testing`) must pass the 85%
   thresholds for statements / branches / functions / lines. With only the
   starter smoke test this is **red**; it goes green once your suite covers the
   behaviours above.
3. **The manual quality checklist** — see `CHECKLIST.md`. Behaviour-focused tests
   queried by role/label, `userEvent` over `fireEvent`, a happy path plus the
   empty-input edge case and an async interaction, no arbitrary timeouts,
   deterministic.

Do **not** modify `src/TodoApp.tsx`, `src/index.tsx`, or any root config.
