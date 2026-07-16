# Mentor checklist — Patterns (Compound Tabs)

Automated tests cover behaviour. Score these manually:

- [ ] **Context used internally** — the active value lives in a React context
      created inside `Tabs.tsx`. The active state and setter are **not** prop-drilled
      through `Tabs.List` down to `Tabs.Tab` / `Tabs.Panel`; each sub-component reads
      context directly.
- [ ] **Compound sub-components** — `Tabs.List`, `Tabs.Tab`, and `Tabs.Panel` are
      attached to `Tabs` as static properties and are used via the `Tabs.X`
      namespace, not imported separately.
- [ ] **Guarded context** — sub-components used outside `<Tabs>` throw a clear
      error (context consumer checks for `null`), rather than silently misbehaving.
- [ ] **ARIA correctness** — `role="tablist"` on the list, `role="tab"` on each
      button with `aria-selected` reflecting only the active tab, `role="tabpanel"`
      on the panel. Tabs are real `<button type="button">` elements (keyboard/focus
      for free).
- [ ] **No escape hatches** — no `any`, no `@ts-ignore` / `@ts-expect-error`; types
      are precise (`ReactNode` children, string `value`).

## Trade-off note — compound + context vs. a prop-driven API

A **prop-driven** tabs component would take everything up front, e.g.
`<Tabs active="a" onChange={...} tabs={[{ value, label, panel }]} />`. That is
explicit and easy to test, but it forces a fixed data shape, makes custom markup
or ordering per tab awkward, and couples the parent to every wiring detail.

The **compound + context** API instead lets the consumer compose freely
(`Tabs.List` / `Tabs.Tab` / `Tabs.Panel` in any arrangement) while the shared
active state is threaded implicitly through context — no `active`/`onChange`
prop-drilling through intermediate elements. The cost: the pieces are only
meaningful together (a `Tabs.Tab` outside `<Tabs>` is an error), the data flow is
less obvious at a glance, and context adds a small indirection. For a
composition-first, accessibility-focused widget the ergonomics win; for a simple,
data-driven list the prop-driven form can be the clearer choice.
