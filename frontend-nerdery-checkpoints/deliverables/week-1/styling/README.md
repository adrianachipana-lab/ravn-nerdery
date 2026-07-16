# W1 · Styling — Tokens, Theming & Responsive Layout

Build a token-based theme that can be switched between **light** and **dark** at
runtime and persists across reloads, plus a small responsive layout. Colors live
in CSS variables (design tokens); components never hard-code hex values.

## Requirements

Implement the files in `src/` so the exports below behave as described.

| File | Export | Must do |
|---|---|---|
| `src/ThemeProvider.tsx` | `ThemeProvider({ children })` | Hold the theme in state (default `'light'`, hydrate from `localStorage` key `'theme'` if present). On change, write it to `localStorage` and set `document.documentElement.dataset.theme` (via `useEffect`). |
| `src/ThemeProvider.tsx` | `useTheme()` | Return `{ theme: 'light' \| 'dark'; toggle: () => void }`. **Throw** if called outside a `ThemeProvider`. |
| `src/ThemeToggle.tsx` | `ThemeToggle()` | A button that calls `toggle`; its accessible name includes the current theme (e.g. `Theme: light` / `Theme: dark`). |
| `src/theme.css` | — | Color tokens as CSS variables on `:root` and `[data-theme="dark"]`, plus a responsive grid/flex layout that reflows at a breakpoint. |
| `src/index.tsx` | `Demo()` | A themed, responsive layout (header + content) wrapped in `ThemeProvider`, rendering `ThemeToggle`. |

## Success criteria (automated)

Run:

```
npx vitest run deliverables/week-1/styling
```

All tests green:

- Default theme is **light** (`document.documentElement.dataset.theme === 'light'`).
- Clicking the toggle switches to **dark** and the button label reflects it.
- The chosen theme is persisted to `localStorage` (`'theme' === 'dark'`).
- `useTheme` **throws** when used outside a `ThemeProvider`.

## Also reviewed (see `CHECKLIST.md`)

Responsive behaviour, no layout shift on theme switch, RAVN styling conventions,
and token usage — checked manually by the mentor.
