import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';

/*
  LECCION 2.4: Custom Hooks
  Extraer y reutilizar logica de estado
*/

// Hook 1: useDebounce — retrasa un valor
function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}

// Hook 2: useFetch — data fetching generico
interface UseFetchResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

function useFetch<T>(url: string): UseFetchResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(() => {
    setLoading(true);
    setError(null);
    fetch(url)
      .then(res => { if (!res.ok) throw new Error(`HTTP ${res.status}`); return res.json(); })
      .then(json => setData(json as T))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [url]);

  useEffect(() => { fetchData(); }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}

// Hook 3: useCounter — logica simple reutilizable
function useCounter(initial = 0, { min = -Infinity, max = Infinity } = {}) {
  const [count, setCount] = useState(initial);
  const increment = () => setCount(c => Math.min(c + 1, max));
  const decrement = () => setCount(c => Math.max(c - 1, min));
  const reset = () => setCount(initial);
  return { count, increment, decrement, reset, set: setCount };
}

// Demos
function DebounceDemo() {
  const [text, setText] = useState('');
  const debounced = useDebounce(text, 500);

  return (
    <div>
      <input className="input" value={text} onChange={e => setText(e.target.value)} placeholder="Type fast... value debounces after 500ms" />
      <div style={{ marginTop: '8px', fontSize: '13px', display: 'flex', gap: '16px' }}>
        <span>Raw: <code>{text || '(empty)'}</code></span>
        <span>Debounced: <code style={{ color: '#61dafb' }}>{debounced || '(empty)'}</code></span>
      </div>
    </div>
  );
}

interface GithubUser {
  login: string;
  avatar_url: string;
  public_repos: number;
  followers: number;
}

function FetchDemo() {
  const [username, setUsername] = useState('octocat');
  const debouncedUser = useDebounce(username, 600);
  const { data, loading, error, refetch } = useFetch<GithubUser>(
    `https://api.github.com/users/${debouncedUser}`
  );

  return (
    <div>
      <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
        <input className="input" value={username} onChange={e => setUsername(e.target.value)} placeholder="GitHub username" style={{ flex: 1 }} />
        <button className="btn btn-secondary" onClick={refetch}>Refetch</button>
      </div>

      {loading && <p style={{ color: '#94979a', fontSize: '13px' }}>Loading...</p>}
      {error && <p style={{ color: '#da584b', fontSize: '13px' }}>Error: {error}</p>}
      {data && !loading && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', background: '#2c2f33', borderRadius: '8px' }}>
          <img src={data.avatar_url} alt={data.login} style={{ width: 48, height: 48, borderRadius: '50%' }} />
          <div>
            <p style={{ fontWeight: 600, fontSize: '14px' }}>{data.login}</p>
            <p style={{ fontSize: '12px', color: '#94979a' }}>{data.public_repos} repos · {data.followers} followers</p>
          </div>
        </div>
      )}
    </div>
  );
}

function CounterDemo() {
  const likes = useCounter(0, { min: 0, max: 99 });
  const quantity = useCounter(1, { min: 1, max: 10 });

  return (
    <div style={{ display: 'flex', gap: '24px' }}>
      <div>
        <p style={{ fontSize: '12px', color: '#5a5e63', marginBottom: '4px' }}>Likes (0-99)</p>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button className="btn btn-secondary" onClick={likes.decrement}>−</button>
          <span style={{ fontSize: '20px', fontWeight: 700, minWidth: '32px', textAlign: 'center' }}>{likes.count}</span>
          <button className="btn btn-primary" onClick={likes.increment}>♥</button>
          <button className="btn btn-secondary" onClick={likes.reset} style={{ fontSize: '12px' }}>Reset</button>
        </div>
      </div>
      <div>
        <p style={{ fontSize: '12px', color: '#5a5e63', marginBottom: '4px' }}>Qty (1-10)</p>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button className="btn btn-secondary" onClick={quantity.decrement}>−</button>
          <span style={{ fontSize: '20px', fontWeight: 700, minWidth: '32px', textAlign: 'center' }}>{quantity.count}</span>
          <button className="btn btn-primary" onClick={quantity.increment}>+</button>
        </div>
      </div>
    </div>
  );
}

export default function Lesson() {
  return (
    <div className="lesson">
      <h2>2.4 — Custom Hooks</h2>
      <p className="subtitle">
        Un custom hook es una funcion que empieza con <code>use</code> y puede usar
        otros hooks. Permite extraer logica reutilizable de los componentes.
      </p>

      <h3>Reglas de los Custom Hooks</h3>
      <ul>
        <li>El nombre DEBE empezar con <code>use</code> (React lo usa para validar las reglas de hooks)</li>
        <li>Puede usar cualquier otro hook dentro (useState, useEffect, otros custom hooks)</li>
        <li>Retorna lo que necesites: valor, objeto, array, funcion</li>
        <li>Se llama en el nivel superior del componente (no dentro de ifs/loops)</li>
      </ul>

      <h3>useDebounce — Retrasar valores</h3>
      <div className="code-block">{
`function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer); // Cleanup al cambiar
  }, [value, delay]);

  return debounced;
}

// Uso: el valor solo se actualiza 500ms despues del ultimo cambio
const debouncedSearch = useDebounce(searchText, 500);`
      }</div>

      <div className="demo">
        <p className="demo-label">useDebounce — escribe rapido:</p>
        <DebounceDemo />
      </div>

      <h3>useFetch — Data fetching generico</h3>
      <div className="code-block">{
`function useFetch<T>(url: string): UseFetchResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // useCallback memoriza fetchData para no re-crear en cada render
  const fetchData = useCallback(() => {
    setLoading(true);
    fetch(url)
      .then(res => res.json())
      .then(json => setData(json as T))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [url]);

  useEffect(() => { fetchData(); }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}

// Uso:
const { data, loading, error } = useFetch<GithubUser>('/api/user/1');`
      }</div>

      <div className="demo">
        <p className="demo-label">useFetch + useDebounce combinados (GitHub API):</p>
        <FetchDemo />
      </div>

      <h3>useCounter — Logica simple reutilizable</h3>
      <div className="demo">
        <p className="demo-label">useCounter con limites (min/max):</p>
        <CounterDemo />
      </div>

      <div className="info-box warning">
        <strong>Pregunta del mentor:</strong> "¿Cual es la diferencia entre una funcion normal y un custom hook? ¿Por que el nombre debe empezar con 'use'?"
        <br /><br />
        <strong>Lo que deberias poder responder:</strong> Tecnicamente, un custom hook ES una funcion normal de JavaScript. La unica diferencia es que PUEDE usar otros hooks adentro (useState, useEffect, etc.). El prefijo "use" le dice a React y a ESLint "esta funcion usa hooks", para que puedan verificar que se cumplen las reglas de hooks (no llamar dentro de ifs, siempre en el mismo orden). Si no pones "use", ESLint no validara las reglas y puedes tener bugs silenciosos.
      </div>

      <div className="info-box success">
        <strong>Concepto clave:</strong> Los custom hooks son LA forma de compartir
        logica en React moderno. Reemplazan HOCs y render props en la mayoria de
        casos. Si ves logica repetida entre componentes, extraela a un custom hook.
      </div>

      <div className="lesson-nav">
        <Link to="/week2/useReducer">← useReducer</Link>
        <Link to="/week2/context">Context API →</Link>
      </div>
    </div>
  );
}
