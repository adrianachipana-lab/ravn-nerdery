import { useState } from 'react';
import { Link } from 'react-router-dom';

/*
  LECCION 3: Rendering Lists
  Como renderizar arrays de datos y por que "key" es importante
*/

interface Todo {
  id: number;
  text: string;
  done: boolean;
}

const initialTodos: Todo[] = [
  { id: 1, text: 'Learn JSX', done: true },
  { id: 2, text: 'Learn Components', done: true },
  { id: 3, text: 'Learn Rendering Lists', done: false },
  { id: 4, text: 'Learn Forms', done: false },
  { id: 5, text: 'Build something cool', done: false },
];

function TodoList() {
  const [todos, setTodos] = useState(initialTodos);

  const toggleTodo = (id: number) => {
    setTodos(prev => prev.map(t =>
      t.id === id ? { ...t, done: !t.done } : t
    ));
  };

  const completedCount = todos.filter(t => t.done).length;

  return (
    <div>
      <p style={{ color: '#94979a', fontSize: '13px', marginBottom: '12px' }}>
        {completedCount}/{todos.length} completed
      </p>
      <ul style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {todos.map(todo => (
          <li
            key={todo.id}
            onClick={() => toggleTodo(todo.id)}
            style={{
              display: 'flex', alignItems: 'center', gap: '10px',
              padding: '10px 14px', background: '#2c2f33', borderRadius: '6px',
              cursor: 'pointer', border: '1px solid rgba(255,255,255,0.06)',
              transition: 'background 0.12s',
            }}
          >
            <div style={{
              width: 18, height: 18, borderRadius: '4px',
              border: todo.done ? 'none' : '2px solid #5a5e63',
              background: todo.done ? '#70b252' : 'transparent',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '12px', color: 'white', flexShrink: 0,
            }}>
              {todo.done && '✓'}
            </div>
            <span style={{
              textDecoration: todo.done ? 'line-through' : 'none',
              color: todo.done ? '#5a5e63' : '#f0f0f0',
              fontSize: '14px',
            }}>
              {todo.text}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Lesson() {
  return (
    <div className="lesson">
      <h2>1.3 — Rendering Lists</h2>
      <p className="subtitle">
        En React, usamos <code>.map()</code> para convertir arrays de datos en
        arrays de elementos JSX. El prop <code>key</code> es esencial.
      </p>

      <h3>El patron basico: .map()</h3>
      <p>
        Para renderizar una lista de datos, usamos el metodo <code>.map()</code> de
        los arrays. Toma cada item y retorna un elemento JSX.
      </p>

      <div className="code-block">{
`const fruits = ['Apple', 'Banana', 'Cherry'];

return (
  <ul>
    {fruits.map(fruit => (
      <li key={fruit}>{fruit}</li>
    ))}
  </ul>
);

// Resultado:
// • Apple
// • Banana
// • Cherry`
      }</div>

      <div className="info-box warning">
        <strong>Pregunta del mentor:</strong> "¿Por que usamos <code>.map()</code> y no un
        <code>for</code> loop para renderizar listas?"
        <br /><br />
        <strong>Respuesta esperada:</strong> Porque JSX solo acepta expresiones (cosas que
        retornan un valor). <code>.map()</code> retorna un nuevo array — es una expresion.
        Un <code>for</code> loop es un statement — no retorna nada. Podrias usar un for
        FUERA del JSX y guardar el resultado en una variable, pero <code>.map()</code> es
        mas declarativo: describes QUE quieres, no COMO hacerlo paso a paso.
      </div>

      <h3>¿Por que key es obligatorio?</h3>
      <p>
        React necesita <code>key</code> para identificar <strong>que elementos cambiaron,
        se agregaron o se eliminaron</strong>. Sin key, React tiene que re-renderizar
        toda la lista cada vez. Con key, solo actualiza los que cambiaron.
      </p>

      <div className="code-block">{
`// BIEN: key unico y estable (usa el ID de la base de datos)
{todos.map(todo => (
  <li key={todo.id}>{todo.text}</li>
))}

// MAL: usar el indice como key
{todos.map((todo, index) => (
  <li key={index}>{todo.text}</li>  // ❌ problemas al reordenar
))}

// MAL: no poner key
{todos.map(todo => (
  <li>{todo.text}</li>  // ❌ React te va a advertir`
      }</div>

      <div className="info-box warning">
        <strong>Regla:</strong> Usa un ID unico como key, no el indice del array.
        El indice causa bugs cuando la lista se reordena, filtra, o cuando se
        agregan/eliminan items del medio.
      </div>

      <h3>Listas con objetos complejos</h3>
      <p>
        En apps reales, los items de la lista son objetos con multiples propiedades.
        El patron es el mismo, pero pasas los datos como props a un componente hijo.
      </p>

      <div className="code-block">{
`interface Todo {
  id: number;
  text: string;
  done: boolean;
}

const todos: Todo[] = [
  { id: 1, text: 'Learn JSX', done: true },
  { id: 2, text: 'Learn Components', done: true },
  { id: 3, text: 'Build something cool', done: false },
];

// Renderizamos y manejamos el click
{todos.map(todo => (
  <li
    key={todo.id}
    onClick={() => toggleTodo(todo.id)}
    style={{
      textDecoration: todo.done ? 'line-through' : 'none',
    }}
  >
    {todo.text}
  </li>
))}`
      }</div>

      <h3>Demo Interactiva</h3>
      <p>Clickea los items para marcarlos como completados:</p>

      <div className="demo">
        <p className="demo-label">Todo List con .map() y key:</p>
        <TodoList />
      </div>

      <h3>Filtrar y transformar listas</h3>
      <p>
        Puedes encadenar <code>.filter()</code> antes de <code>.map()</code> para
        mostrar solo algunos items. Tambien puedes usar <code>.sort()</code> para
        ordenarlos.
      </p>

      <div className="code-block">{
`// Mostrar solo los no completados
{todos
  .filter(todo => !todo.done)
  .map(todo => (
    <li key={todo.id}>{todo.text}</li>
  ))
}

// Contar completados
const completedCount = todos.filter(t => t.done).length;`
      }</div>

      <div className="info-box warning">
        <strong>Pregunta del mentor:</strong> "En tu proyecto, si el backend cambia el orden
        de los items, ¿que pasa si usas el index como key? Dame un ejemplo concreto de un bug."
        <br /><br />
        <strong>Respuesta esperada:</strong> Si tengo una lista con inputs controlados
        y uso el index como key, al reordenar, React asocia el estado del input con la
        posicion, no con el item. Ejemplo: tengo [A, B, C] y cada uno tiene un checkbox.
        Marco B como checked. Si el backend reordena a [C, A, B], el checkbox queda en la
        posicion 1 (ahora es A), no en B. El estado "se mueve" con el index, no con el dato.
        Con un ID estable como key, React sabe que B es B sin importar la posicion.
      </div>

      <div className="info-box success">
        <strong>Para el code review:</strong> Cuando te pregunten "¿como manejas listas
        en React?", menciona: (1) <code>.map()</code> con key unico, (2) <code>.filter()</code>
        para subsets, (3) nunca mutar el array original — siempre crear uno nuevo.
        Si te preguntan sobre performance con listas grandes (+1000 items), menciona
        virtualizacion con react-window o react-virtual.
      </div>

      <div className="lesson-nav">
        <Link to="/week1/components-props">← Components y Props</Link>
        <Link to="/week1/forms">Forms →</Link>
      </div>
    </div>
  );
}
