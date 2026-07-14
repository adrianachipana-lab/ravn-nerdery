import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';

/*
  LECCION 2.7: Data Fetching (React Query pattern)
  Como obtener datos de una API de forma profesional
*/

// Simulamos el patron de React Query con un hook custom
// (para no agregar la dependencia al learning project)

interface QueryResult<T> {
  data: T | undefined;
  isLoading: boolean;
  isError: boolean;
  error: string | null;
  refetch: () => void;
}

function useQuery<T>(key: string, fetcher: () => Promise<T>): QueryResult<T> {
  const [data, setData] = useState<T | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(() => {
    setIsLoading(true);
    setIsError(false);
    setError(null);
    fetcher()
      .then((result) => setData(result))
      .catch((err) => { setIsError(true); setError(err.message); })
      .finally(() => setIsLoading(false));
  }, [fetcher]);

  useEffect(() => { refetch(); }, [key]); // eslint-disable-line

  return { data, isLoading, isError, error, refetch };
}

// Demo: sin React Query vs con React Query
interface GithubRepo {
  id: number;
  name: string;
  stargazers_count: number;
  description: string | null;
}

function ManualFetchDemo() {
  const [repos, setRepos] = useState<GithubRepo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    fetch('https://api.github.com/users/facebook/repos?sort=stars&per_page=5')
      .then(res => { if (!res.ok) throw new Error('Failed'); return res.json(); })
      .then(data => setRepos(data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p style={{ color: '#94979a', fontSize: '13px' }}>Loading...</p>;
  if (error) return <p style={{ color: '#da584b', fontSize: '13px' }}>Error: {error}</p>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
      {repos.map(repo => (
        <div key={repo.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', background: '#2c2f33', borderRadius: '6px', fontSize: '13px' }}>
          <span>{repo.name}</span>
          <span style={{ color: '#e5b454' }}>★ {repo.stargazers_count.toLocaleString()}</span>
        </div>
      ))}
    </div>
  );
}

function QueryDemo() {
  const [user, setUser] = useState('facebook');
  const { data, isLoading, isError, error, refetch } = useQuery<GithubRepo[]>(
    user,
    useCallback(() =>
      fetch(`https://api.github.com/users/${user}/repos?sort=stars&per_page=5`)
        .then(res => { if (!res.ok) throw new Error('Failed'); return res.json(); }),
    [user]),
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <div style={{ display: 'flex', gap: '4px' }}>
        {['facebook', 'google', 'microsoft'].map(u => (
          <button key={u} className={`btn ${user === u ? 'btn-primary' : 'btn-secondary'}`} style={{ fontSize: '12px', padding: '4px 12px' }} onClick={() => setUser(u)}>{u}</button>
        ))}
        <button className="btn btn-secondary" style={{ fontSize: '12px', padding: '4px 12px', marginLeft: '8px' }} onClick={refetch}>Refetch</button>
      </div>

      {isLoading && <p style={{ color: '#94979a', fontSize: '13px' }}>Loading...</p>}
      {isError && <p style={{ color: '#da584b', fontSize: '13px' }}>Error: {error}</p>}
      {data && !isLoading && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {data.map(repo => (
            <div key={repo.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', background: '#2c2f33', borderRadius: '6px', fontSize: '13px' }}>
              <div>
                <span style={{ fontWeight: 500 }}>{repo.name}</span>
                {repo.description && <p style={{ color: '#5a5e63', fontSize: '11px', marginTop: '2px' }}>{repo.description.slice(0, 60)}</p>}
              </div>
              <span style={{ color: '#e5b454', flexShrink: 0 }}>★ {repo.stargazers_count.toLocaleString()}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Lesson() {
  return (
    <div className="lesson">
      <h2>2.7 — Data Fetching</h2>
      <p className="subtitle">
        Obtener datos de una API es algo que haras en CADA proyecto.
        Hay una forma mala (manual) y una forma buena (React Query pattern).
      </p>

      <h3>El problema: fetch manual</h3>
      <p>
        Imagina que necesitas mostrar datos de una API. El enfoque "ingenuo" es
        usar <code>useEffect</code> + <code>fetch</code> + tres <code>useState</code>
        (data, loading, error). Funciona, pero tiene muchos problemas.
      </p>

      <div className="code-block">{
`// ENFOQUE MANUAL — repites esto en CADA componente que hace fetch
function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetch('/api/users')
      .then(res => res.json())
      .then(data => setUsers(data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner />;
  if (error) return <Error message={error} />;
  return <List items={users} />;
}

// Problemas:
// 1. Repites loading/error en CADA componente
// 2. No hay cache — si vas y vuelves, hace fetch de nuevo
// 3. No hay retry automatico si falla
// 4. No hay deduplicacion — 2 componentes pidiendo lo mismo = 2 requests
// 5. No hay invalidacion — si cambias un dato, los otros no se enteran`
      }</div>

      <div className="demo">
        <p className="demo-label">Fetch manual (useEffect + useState):</p>
        <ManualFetchDemo />
      </div>

      <h3>La solucion: React Query / TanStack Query</h3>
      <p>
        React Query es una libreria que maneja TODO el data fetching por ti:
        cache, loading, error, retry, refetch, invalidacion, deduplicacion.
        Tu solo le dices <strong>"traeme estos datos"</strong> y ella se encarga del resto.
      </p>

      <div className="code-block">{
`// CON REACT QUERY — limpio, con cache, retry, y refetch
import { useQuery } from '@tanstack/react-query';

function UserList() {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['users'],           // Identificador unico del query
    queryFn: () => fetch('/api/users').then(res => res.json()),
    staleTime: 5 * 60 * 1000,     // Cache valido por 5 minutos
    retry: 3,                     // Reintenta 3 veces si falla
  });

  if (isLoading) return <Spinner />;
  if (isError) return <Error message={error.message} />;
  return <List items={data} />;
}

// Ventajas:
// 1. Cache automatico — si vuelves a esta pagina, los datos ya estan
// 2. Retry — si la red falla, reintenta automaticamente
// 3. Deduplicacion — 2 componentes con el mismo queryKey = 1 request
// 4. Refetch en focus — cuando vuelves al tab, actualiza en background
// 5. Invalidacion — puedes decirle "estos datos ya no son validos, recarga"`
      }</div>

      <div className="demo">
        <p className="demo-label">Pattern React Query (cambia de org, mira la cache):</p>
        <QueryDemo />
      </div>

      <h3>Mutations: crear, editar, eliminar</h3>
      <div className="code-block">{
`// useMutation para operaciones de escritura
const createUser = useMutation({
  mutationFn: (newUser) => fetch('/api/users', {
    method: 'POST',
    body: JSON.stringify(newUser),
  }),

  // Cuando la mutacion tiene exito, invalida el cache de 'users'
  // para que se recarguen automaticamente
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['users'] });
  },
});

// Uso:
createUser.mutate({ name: 'John', email: 'john@test.com' });

// createUser.isLoading → true mientras se envia
// createUser.isError → true si fallo
// createUser.isSuccess → true si funciono`
      }</div>

      <div className="info-box warning">
        <strong>Pregunta del mentor:</strong> "¿Que problema tiene tu proyecto Olympus
        con el data fetching y como lo mejorarias con React Query?"
        <br /><br />
        <strong>Lo que deberias poder responder:</strong> Olympus usa axios + useEffect
        manual en cada componente. Cada uno maneja su propio loading/error/mounted flag.
        No hay cache — si navegas a otra pagina y vuelves, hace fetch de nuevo.
        Con React Query: (1) Elimino los 3 useStates de loading/error/data de cada componente.
        (2) Los datos se cachean — la navegacion es instantanea. (3) Si dos componentes
        piden los mismos datos, solo se hace UN request. (4) Retry automatico si la red falla.
      </div>

      <div className="info-box success">
        <strong>Para el code review:</strong> Si tu app hace mas de 2-3 API calls,
        React Query deberia ser una dependencia. Es el estandar de la industria.
        Manejar loading/error manualmente en cada componente es un red flag.
      </div>

      <div className="lesson-nav">
        <Link to="/week2/testing">← Testing</Link>
        <Link to="/week2/accessibility">Accessibility →</Link>
      </div>
    </div>
  );
}
