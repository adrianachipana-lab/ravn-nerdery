import { useReducer, useState } from 'react'

// ---------------------------------------------------------------------------
// This component is PROVIDED and CORRECT. Do not change it.
// Your job is to write TodoApp.test.tsx (see README.md and CHECKLIST.md).
// ---------------------------------------------------------------------------

type Filter = 'all' | 'active' | 'completed'

interface Todo {
  id: number
  text: string
  completed: boolean
}

type Action =
  | { type: 'add'; text: string }
  | { type: 'toggle'; id: number }
  | { type: 'delete'; id: number }

let nextId = 1

function reducer(todos: Todo[], action: Action): Todo[] {
  switch (action.type) {
    case 'add':
      return [...todos, { id: nextId++, text: action.text, completed: false }]
    case 'toggle':
      return todos.map((todo) =>
        todo.id === action.id ? { ...todo, completed: !todo.completed } : todo,
      )
    case 'delete':
      return todos.filter((todo) => todo.id !== action.id)
    default:
      return todos
  }
}

function visibleTodos(todos: Todo[], filter: Filter): Todo[] {
  switch (filter) {
    case 'active':
      return todos.filter((todo) => !todo.completed)
    case 'completed':
      return todos.filter((todo) => todo.completed)
    default:
      return todos
  }
}

export function TodoApp() {
  const [todos, dispatch] = useReducer(reducer, [])
  const [draft, setDraft] = useState('')
  const [filter, setFilter] = useState<Filter>('all')

  function handleAdd() {
    const text = draft.trim()
    if (text === '') return // empty-input guard
    dispatch({ type: 'add', text })
    setDraft('')
  }

  const shown = visibleTodos(todos, filter)
  const remaining = todos.filter((todo) => !todo.completed).length

  return (
    <section>
      <h2>Todos</h2>

      <form
        onSubmit={(event) => {
          event.preventDefault()
          handleAdd()
        }}
      >
        <label htmlFor="new-todo">New todo</label>
        <input
          id="new-todo"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
        />
        <button type="submit">Add</button>
      </form>

      <div role="group" aria-label="Filter todos">
        <button type="button" aria-pressed={filter === 'all'} onClick={() => setFilter('all')}>
          All
        </button>
        <button
          type="button"
          aria-pressed={filter === 'active'}
          onClick={() => setFilter('active')}
        >
          Active
        </button>
        <button
          type="button"
          aria-pressed={filter === 'completed'}
          onClick={() => setFilter('completed')}
        >
          Completed
        </button>
      </div>

      <p>{remaining} left</p>

      <ul>
        {shown.map((todo) => (
          <li key={todo.id}>
            <label>
              <input
                type="checkbox"
                checked={todo.completed}
                aria-label={todo.text}
                onChange={() => dispatch({ type: 'toggle', id: todo.id })}
              />
              <span>{todo.text}</span>
            </label>
            <button type="button" onClick={() => dispatch({ type: 'delete', id: todo.id })}>
              Delete {todo.text}
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}
