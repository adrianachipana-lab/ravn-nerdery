import { createContext, useContext, useReducer, useCallback } from 'react';
import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

/*
  LECCION 3.5: State Management
  Cuando usar que herramienta para manejar estado
*/

// Mini store pattern: Context + Reducer encapsulado
interface Todo { id: number; text: string; done: boolean; }

interface TodoState { todos: Todo[]; filter: 'all' | 'active' | 'done'; }

type TodoAction =
  | { type: 'ADD'; payload: string }
  | { type: 'TOGGLE'; payload: number }
  | { type: 'DELETE'; payload: number }
  | { type: 'SET_FILTER'; payload: 'all' | 'active' | 'done' }
  | { type: 'CLEAR_DONE' };

function todoReducer(state: TodoState, action: TodoAction): TodoState {
  switch (action.type) {
    case 'ADD':
      return { ...state, todos: [...state.todos, { id: Date.now(), text: action.payload, done: false }] };
    case 'TOGGLE':
      return { ...state, todos: state.todos.map(t => t.id === action.payload ? { ...t, done: !t.done } : t) };
    case 'DELETE':
      return { ...state, todos: state.todos.filter(t => t.id !== action.payload) };
    case 'SET_FILTER':
      return { ...state, filter: action.payload };
    case 'CLEAR_DONE':
      return { ...state, todos: state.todos.filter(t => !t.done) };
  }
}

// Store: Context + custom hook con metodos de conveniencia
interface TodoStore {
  state: TodoState;
  addTodo: (text: string) => void;
  toggleTodo: (id: number) => void;
  deleteTodo: (id: number) => void;
  setFilter: (f: 'all' | 'active' | 'done') => void;
  clearDone: () => void;
  filteredTodos: Todo[];
  stats: { total: number; active: number; done: number };
}

const TodoContext = createContext<TodoStore | null>(null);

function useTodoStore(): TodoStore {
  const ctx = useContext(TodoContext);
  if (!ctx) throw new Error('useTodoStore must be within TodoProvider');
  return ctx;
}

function TodoProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(todoReducer, {
    todos: [
      { id: 1, text: 'Learn React fundamentals', done: true },
      { id: 2, text: 'Master TypeScript with React', done: true },
      { id: 3, text: 'Understand advanced patterns', done: false },
      { id: 4, text: 'Build a real project', done: false },
    ],
    filter: 'all',
  });

  const addTodo = useCallback((text: string) => dispatch({ type: 'ADD', payload: text }), []);
  const toggleTodo = useCallback((id: number) => dispatch({ type: 'TOGGLE', payload: id }), []);
  const deleteTodo = useCallback((id: number) => dispatch({ type: 'DELETE', payload: id }), []);
  const setFilter = useCallback((f: 'all' | 'active' | 'done') => dispatch({ type: 'SET_FILTER', payload: f }), []);
  const clearDone = useCallback(() => dispatch({ type: 'CLEAR_DONE' }), []);

  const filteredTodos = state.todos.filter(t => {
    if (state.filter === 'active') return !t.done;
    if (state.filter === 'done') return t.done;
    return true;
  });

  const stats = {
    total: state.todos.length,
    active: state.todos.filter(t => !t.done).length,
    done: state.todos.filter(t => t.done).length,
  };

  return (
    <TodoContext.Provider value={{ state, addTodo, toggleTodo, deleteTodo, setFilter, clearDone, filteredTodos, stats }}>
      {children}
    </TodoContext.Provider>
  );
}

// Componentes que consumen el store
function AddTodo() {
  const { addTodo } = useTodoStore();
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const input = form.elements.namedItem('todo') as HTMLInputElement;
    if (input.value.trim()) { addTodo(input.value.trim()); input.value = ''; }
  };
  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '8px' }}>
      <input name="todo" className="input" placeholder="Add a new todo..." style={{ flex: 1 }} />
      <button className="btn btn-primary" type="submit">Add</button>
    </form>
  );
}

function FilterBar() {
  const { state, setFilter, clearDone, stats } = useTodoStore();
  const filters: Array<'all' | 'active' | 'done'> = ['all', 'active', 'done'];
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div style={{ display: 'flex', gap: '2px', background: '#2c2f33', borderRadius: '6px', padding: '2px' }}>
        {filters.map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{
            padding: '4px 12px', borderRadius: '4px', fontSize: '12px', fontWeight: 500, border: 'none', cursor: 'pointer',
            background: state.filter === f ? '#393d41' : 'transparent',
            color: state.filter === f ? '#f0f0f0' : '#94979a',
          }}>
            {f} ({f === 'all' ? stats.total : f === 'active' ? stats.active : stats.done})
          </button>
        ))}
      </div>
      {stats.done > 0 && (
        <button className="btn btn-secondary" style={{ fontSize: '12px', padding: '4px 8px' }} onClick={clearDone}>
          Clear done
        </button>
      )}
    </div>
  );
}

function TodoList() {
  const { filteredTodos, toggleTodo, deleteTodo } = useTodoStore();
  if (filteredTodos.length === 0) return <p style={{ color: '#5a5e63', fontSize: '13px', textAlign: 'center', padding: '20px' }}>No todos</p>;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
      {filteredTodos.map(todo => (
        <div key={todo.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', background: '#2c2f33', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.04)' }}>
          <button onClick={() => toggleTodo(todo.id)} style={{
            width: 20, height: 20, borderRadius: '4px', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: todo.done ? 'none' : '2px solid #5a5e63', background: todo.done ? '#70b252' : 'transparent', color: 'white', fontSize: '12px', cursor: 'pointer',
          }}>{todo.done && '✓'}</button>
          <span style={{ flex: 1, fontSize: '14px', textDecoration: todo.done ? 'line-through' : 'none', color: todo.done ? '#5a5e63' : '#f0f0f0' }}>{todo.text}</span>
          <button onClick={() => deleteTodo(todo.id)} style={{ color: '#5a5e63', cursor: 'pointer', background: 'none', border: 'none', fontSize: '14px' }}>✕</button>
        </div>
      ))}
    </div>
  );
}

function StatsBar() {
  const { stats } = useTodoStore();
  const pct = stats.total > 0 ? Math.round((stats.done / stats.total) * 100) : 0;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
      <div style={{ flex: 1, height: '4px', background: '#2c2f33', borderRadius: '999px', overflow: 'hidden' }}>
        <div style={{ width: `${pct}%`, height: '100%', background: '#70b252', borderRadius: '999px', transition: 'width 0.3s' }} />
      </div>
      <span style={{ fontSize: '12px', color: '#94979a', whiteSpace: 'nowrap' }}>{pct}% done</span>
    </div>
  );
}

function TodoApp() {
  return (
    <TodoProvider>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <AddTodo />
        <FilterBar />
        <TodoList />
        <StatsBar />
      </div>
    </TodoProvider>
  );
}

export default function Lesson() {
  return (
    <div className="lesson">
      <h2>3.5 — State Management</h2>
      <p className="subtitle">
        Cuando la app crece, necesitas una estrategia para manejar estado.
        Aprende a elegir la herramienta correcta para cada situacion.
      </p>

      <h3>El espectro de state management</h3>
      <div className="code-block">{
`// Nivel 1: useState — estado local simple
const [count, setCount] = useState(0);

// Nivel 2: useReducer — estado local complejo
const [state, dispatch] = useReducer(reducer, initialState);

// Nivel 3: Context + Reducer — estado global en la app
// Lo que construimos en esta leccion ↓

// Nivel 4: Librerias externas — para apps grandes
// Zustand, Jotai, Redux Toolkit, React Query`
      }</div>

      <h3>Patron: Context + Reducer + Custom Hook</h3>
      <div className="code-block">{
`// 1. Reducer maneja la logica pura
function todoReducer(state, action) { ... }

// 2. Provider encapsula reducer + metodos de conveniencia
function TodoProvider({ children }) {
  const [state, dispatch] = useReducer(todoReducer, initialState);

  // Metodos que abstraen el dispatch:
  const addTodo = useCallback((text) => {
    dispatch({ type: 'ADD', payload: text });
  }, []);

  // Valores derivados (computados del estado):
  const filteredTodos = state.todos.filter(...);
  const stats = { total: ..., active: ..., done: ... };

  return (
    <TodoContext.Provider value={{ state, addTodo, filteredTodos, stats }}>
      {children}
    </TodoContext.Provider>
  );
}

// 3. Custom hook para consumir
function useTodoStore() {
  const ctx = useContext(TodoContext);
  if (!ctx) throw new Error('Must be within TodoProvider');
  return ctx;
}

// 4. Los componentes son simples y desacoplados:
function AddTodo() {
  const { addTodo } = useTodoStore();
  // Solo sabe de addTodo, no de dispatch ni del reducer
}

function Stats() {
  const { stats } = useTodoStore();
  // Solo sabe de stats, no de como se calculan
}`
      }</div>

      <div className="info-box">
        <strong>El provider NO expone dispatch directamente.</strong> En cambio,
        expone funciones con nombre (<code>addTodo</code>, <code>toggleTodo</code>).
        Asi, los consumidores no necesitan saber la estructura de las acciones.
        Es una API mas limpia y facil de refactorizar.
      </div>

      <h3>Demo Interactiva</h3>
      <p>Todo app completa con Context store (5 componentes comparten estado):</p>
      <div className="demo">
        <p className="demo-label">TodoProvider → AddTodo, FilterBar, TodoList, StatsBar:</p>
        <TodoApp />
      </div>

      <h3>¿Cuando usar que?</h3>
      <div style={{ overflowX: 'auto', margin: '16px 0' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
              <th style={{ padding: '8px', textAlign: 'left', color: '#94979a' }}>Situacion</th>
              <th style={{ padding: '8px', textAlign: 'left', color: '#94979a' }}>Herramienta</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['Form input, toggle, modal open/close', 'useState'],
              ['Form con muchos campos relacionados', 'useReducer'],
              ['Theme, auth, locale (pocos cambios)', 'Context + useReducer'],
              ['Data del servidor (fetch, cache, sync)', 'React Query / SWR'],
              ['Estado global complejo (muchos writes)', 'Zustand / Redux Toolkit'],
              ['Estado derivado (computado)', 'useMemo / computed en el provider'],
            ].map(([sit, tool], i) => (
              <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                <td style={{ padding: '8px' }}>{sit}</td>
                <td style={{ padding: '8px', color: '#61dafb' }}>{tool}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="info-box warning">
        <strong>Sobre tu proyecto Olympus:</strong> Actualmente usa solo useState local
        y token duplicado en 3 sitios. Con lo que aprendiste aqui, podrias crear un
        <code>AuthProvider</code> con Context que centralice el manejo del token y
        exponga un hook <code>useAuth()</code> limpio.
      </div>

      <div className="info-box warning">
        <strong>Pregunta del mentor:</strong> "En tu proyecto Olympus, el token JWT se guarda en localStorage, en una cookie, y en axios defaults. ¿Que problemas causa esto y como lo resolverias con lo que aprendiste?"
        <br /><br />
        <strong>Lo que deberias poder responder:</strong> Tener el mismo dato en 3 lugares causa problemas de sincronizacion — si actualizo uno y olvido los otros, la app tiene estado inconsistente. Con lo que aprendi, crearia un AuthProvider con Context que centralice el token en UN solo lugar. Un hook useAuth() expone el token, funciones de login/logout, y datos del usuario. Los interceptores de axios leen del Context, no de localStorage. Asi hay UNA fuente de verdad.
      </div>

      <div className="info-box success">
        <strong>Concepto clave:</strong> No hay una solucion unica. La mejor
        herramienta depende del tipo de estado. Empieza simple (useState), sube a
        useReducer cuando se complica, y sube a Context cuando multiples componentes
        necesitan el mismo estado. Solo agrega librerias cuando las anteriores no alcanzan.
      </div>

      <div className="lesson-nav">
        <Link to="/week3/suspense">← Suspense</Link>
        <Link to="/">Inicio →</Link>
      </div>
    </div>
  );
}
