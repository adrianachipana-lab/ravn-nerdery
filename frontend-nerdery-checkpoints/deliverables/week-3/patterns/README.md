# W3 · Patterns — Accessible Compound Tabs

Build an advanced React pattern: a **compound component**. `Tabs` shares its
active-tab state through an **internal React context** so consumers compose the
sub-components declaratively — no prop drilling of the active value or an
`onChange` handler through every child.

## Intended consumer API

```tsx
import { Tabs } from './src/Tabs'

<Tabs defaultValue="a">
  <Tabs.List>
    <Tabs.Tab value="a">A</Tabs.Tab>
    <Tabs.Tab value="b">B</Tabs.Tab>
  </Tabs.List>
  <Tabs.Panel value="a">Panel A</Tabs.Panel>
  <Tabs.Panel value="b">Panel B</Tabs.Panel>
</Tabs>
```

The consumer never passes the active value or a setter to the children — they
read it from context. Ordering and grouping of `Tab`/`Panel` is up to the
consumer.

## Requirements

Implement `src/Tabs.tsx` so the exports below behave as described.

| Export | Must do |
|---|---|
| `Tabs` | Uncontrolled root. Takes `defaultValue: string`. Holds the active value in an **internal React context** (via `useState`) and provides it to descendants. |
| `Tabs.List` | Renders a container with `role="tablist"` wrapping the tabs. |
| `Tabs.Tab` | Takes `value: string`. Renders a `<button role="tab">` whose `aria-selected` is `true` **only** when its `value` is the active value. Clicking it activates its `value` via context. |
| `Tabs.Panel` | Takes `value: string`. Renders `role="tabpanel"`, shown **only** when its `value` is active (inactive panels are not rendered). |

`Tabs.List` / `Tabs.Tab` / `Tabs.Panel` are attached as static properties on
`Tabs` (`Object.assign`). Types are precise — **no `any`**, no `@ts-*` escape
hatches.

## Success criteria (automated)

Run:

```
npx vitest run deliverables/week-3/patterns
```

All tests green:

- **Roles present** — exactly one `tablist`, one `tab` per `Tabs.Tab`, and
  exactly one visible `tabpanel`.
- **Default panel** — the `defaultValue` panel's content is shown; other panels'
  content is not in the document.
- **Switching** — clicking a different tab shows its panel and removes the
  previously active panel's content.
- **aria-selected** — the active tab is `aria-selected="true"`, inactive tabs
  `"false"`, and this updates after a click.

## Also reviewed (see `CHECKLIST.md`)

Context-internal state (no prop drilling), sub-components attached to `Tabs`,
ARIA correctness, and a written trade-off note vs. a prop-driven API — checked
by the mentor.
