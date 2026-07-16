import { TodoApp } from './TodoApp'

// Runnable demo shown in the dev server.
export default function Demo() {
  return (
    <main style={{ fontFamily: 'system-ui', maxWidth: 640, margin: '1rem auto', padding: '0 1rem' }}>
      <h1>Testing module — Todo App</h1>
      <TodoApp />
    </main>
  )
}
