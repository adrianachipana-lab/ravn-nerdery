# Mentor checklist — Styling

Automated tests cover the theme behaviour. Score these manually (they can't be auto-graded):

- [ ] **Responsive — mobile (~375px)** — layout is a single readable column; nothing overflows horizontally.
- [ ] **Responsive — tablet (~768px)** — the grid reflows to more columns at the breakpoint.
- [ ] **Responsive — desktop (~1280px)** — content uses the wider space (multi-column) without stretching awkwardly.
- [ ] **No layout shift on theme switch** — toggling light/dark changes only colors; nothing moves, resizes, or reflows.
- [ ] **Tokens, not literals** — colors come from CSS variables (`var(--color-*)`), not hard-coded hex values in components or rules.
- [ ] **RAVN conventions** — consistent spacing/radius tokens, semantic class names, header + content structure.
- [ ] **No console noise** — no React key/act warnings in the test or dev console.
