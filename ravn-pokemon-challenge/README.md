# PokeTeam Builder

A task management-style app built with React 19, TypeScript, and the PokeAPI. Browse Pokemon, create trainers, and build teams of up to 6 Pokemon per trainer. Built as the Week 4 capstone for the RAVN Frontend Nerdery training program.

## Setup & Running

```bash
# Install dependencies
npm install

# Start the dev server
npm run dev

# Run the test suite
npm test

# Type check
npm run typecheck

# Lint
npm run lint

# Full grade (typecheck + lint + tests)
npm run grade
```

## Project Description

PokeTeam Builder maps the real coding challenge concept (users + tasks) to a Pokemon domain:

- **Pokemon = Tasks**: Browse, search, and filter Pokemon from the PokeAPI
- **Trainers = Users**: Create and manage trainers
- **Teams = Task assignments**: Assign Pokemon to a trainer's team (max 6)

### Features

- Browse 1000+ Pokemon with pagination
- Search Pokemon by name in real-time
- Filter Pokemon by type (fire, water, grass, etc.)
- View detailed Pokemon stats, abilities, and sprites
- Create and delete trainers
- Add/remove Pokemon from trainer teams (max 6 per team, no duplicates)
- Dark/light theme toggle with persistence
- Trainer data persists in localStorage across sessions
- Full keyboard accessibility (skip-to-content, focus management)
- Responsive layout (mobile, tablet, desktop)

## Architecture & Rationale

```
src/
  types/           # TypeScript interfaces (no `any`, strict mode)
  api/             # Pure fetch functions + TanStack Query key factory
  hooks/           # Custom hooks (debounce, TanStack Query wrappers)
  context/         # Global state: trainers (useReducer + Context), theme
  components/
    ui/            # Reusable primitives (Badge, Spinner, Pagination, EmptyState)
    pokemon/       # Pokemon domain (Card, Grid, Detail, SearchBar)
    trainer/       # Trainer domain (Form, Card, Team, AddToTeamModal)
    error/         # ErrorBoundary (class component)
    layout/        # Header with navigation + theme toggle
  pages/           # Route-level components (Browse, Detail, Trainers, 404)
  styles/          # CSS design tokens + global reset
  __tests__/       # Test suite (37 tests)
```

### Key decisions

- **TanStack Query** for server state (Pokemon data): handles caching, deduplication, loading/error states, and stale-time management. This separates async server state from local UI state, following RAVN's scalable state management approach.

- **useReducer + Context** for client state (trainers): a pure reducer handles all mutations (add/remove trainer, add/remove Pokemon from team) with a discriminated union for actions. The reducer is easily testable in isolation.

- **localStorage persistence**: trainer data and theme preference survive page reloads. The reducer state is serialized on every change.

- **CSS design tokens**: all colors, spacing, radii, and shadows are CSS custom properties in `tokens.css`. Components never use hardcoded hex values. Dark theme simply overrides the token values via `[data-theme="dark"]`.

- **Component composition**: small, focused components composed in pages. No giant "god components". Each component has a single responsibility.

- **Folder-by-domain**: Pokemon and trainer components are separated by domain rather than by component type. UI primitives (`ui/`) are shared across domains.

- **Query key factory**: `pokemonKeys.list(limit, offset)` pattern ensures consistent, collision-free cache keys across all TanStack Query hooks.

## Technologies

| Library | Purpose |
|---------|---------|
| React 19 | UI framework |
| TypeScript (strict) | Type safety, no `any` |
| Vite | Build tool and dev server |
| TanStack Query | Async state management (caching, dedup) |
| React Router | Client-side routing |
| Vitest | Test runner |
| React Testing Library | Component testing (behavior-focused) |
| CSS Custom Properties | Design tokens, theming |

## Skills Demonstrated

| Week | Skill | Where |
|------|-------|-------|
| W1 | useState, useEffect, useRef, useId | SearchBar, TrainerForm, debounce hook |
| W1 | Error Boundaries | ErrorBoundary wrapping routes |
| W1 | Composition | Components composed in pages |
| W1 | CSS tokens + responsive grid | tokens.css, PokemonGrid |
| W1 | Dark/light theme | ThemeProvider + toggle |
| W2 | Strict TypeScript | All types, no `any`, discriminated unions |
| W2 | useReducer + Context | trainers-reducer + trainers-context |
| W2 | Testing | 37 tests, userEvent, role/label queries |
| W3 | TanStack Query | All API data via useQuery with query keys |
| W3 | Async state dedup | Single fetch per query, cache reuse |

## API

This project uses the [PokeAPI](https://pokeapi.co/api/v2/) (public, no auth required):

- `GET /pokemon?limit=20&offset=0` - List Pokemon with pagination
- `GET /pokemon/{id|name}` - Pokemon detail (stats, abilities, sprites)
- `GET /type` - List all Pokemon types
