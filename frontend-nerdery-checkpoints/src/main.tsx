import { StrictMode, Suspense, lazy, type ComponentType } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider, Link } from 'react-router-dom'

// Each deliverable exposes a runnable demo at src/index.tsx (default export).
// Routes are lazy so an unfinished deliverable never blocks the dev server.
const deliverables = [
  { path: 'week-1/contact-list', title: 'W1 · Contact List (React Fundamentals)' },
  { path: 'week-1/interactivity', title: 'W1 · Interactivity (Hooks)' },
  { path: 'week-1/styling', title: 'W1 · Styling & Theme' },
  { path: 'week-2/typescript', title: 'W2 · Typing React' },
  { path: 'week-2/advanced-apis', title: 'W2 · Reducer + Context' },
  { path: 'week-2/testing', title: 'W2 · Testing (Todo app)' },
  { path: 'week-3/patterns', title: 'W3 · Compound Component' },
  { path: 'week-3/suspense', title: 'W3 · Suspense' },
  { path: 'week-3/state-management', title: 'W3 · Global + Async State' },
]

const modules = import.meta.glob('../deliverables/*/*/src/index.tsx')

function Home() {
  return (
    <main style={{ fontFamily: 'system-ui', maxWidth: 720, margin: '2rem auto', padding: '0 1rem' }}>
      <h1>RAVN Nerdery</h1>
      <p>Pick a deliverable to run its demo. Grade with <code>npm run grade</code>.</p>
      <ul>
        {deliverables.map((d) => (
          <li key={d.path} style={{ margin: '0.4rem 0' }}>
            <Link to={`/${d.path}`}>{d.title}</Link>
          </li>
        ))}
      </ul>
    </main>
  )
}

const router = createBrowserRouter([
  { path: '/', element: <Home /> },
  ...deliverables.map((d) => {
    const loader = modules[`../deliverables/${d.path}/src/index.tsx`]
    const Demo = lazy(loader as () => Promise<{ default: ComponentType }>)
    return {
      path: `/${d.path}`,
      element: (
        <Suspense fallback={<p style={{ padding: '2rem' }}>Loading…</p>}>
          <p style={{ fontFamily: 'system-ui', padding: '0.5rem 1rem' }}>
            <Link to="/">← All deliverables</Link>
          </p>
          <Demo />
        </Suspense>
      ),
    }
  }),
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
