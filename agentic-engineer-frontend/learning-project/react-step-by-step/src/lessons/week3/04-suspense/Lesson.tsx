import { Suspense, useState, use } from 'react';
import { Link } from 'react-router-dom';

/*
  LECCION 3.4: React Suspense
  Manejo declarativo de estados de carga
*/

// Simulamos una API call que retorna un Promise
function fetchUser(id: number): Promise<{ login: string; avatar_url: string; bio: string | null; public_repos: number }> {
  return fetch(`https://api.github.com/users/${id === 1 ? 'octocat' : id === 2 ? 'torvalds' : 'gaearon'}`)
    .then(res => { if (!res.ok) throw new Error('Failed'); return res.json(); });
}

// Cache simple para promises
const cache = new Map<number, Promise<{ login: string; avatar_url: string; bio: string | null; public_repos: number }>>();

function getUserPromise(id: number) {
  if (!cache.has(id)) {
    cache.set(id, fetchUser(id));
  }
  return cache.get(id)!;
}

// Componente que usa `use()` — React 19 hook para leer Promises
function UserProfile({ userId }: { userId: number }) {
  const user = use(getUserPromise(userId));
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px', background: '#2c2f33', borderRadius: '8px' }}>
      <img src={user.avatar_url} alt={user.login} style={{ width: 56, height: 56, borderRadius: '50%' }} />
      <div>
        <p style={{ fontWeight: 600, fontSize: '15px' }}>{user.login}</p>
        <p style={{ fontSize: '12px', color: '#94979a' }}>{user.bio ?? 'No bio'}</p>
        <p style={{ fontSize: '12px', color: '#61dafb' }}>{user.public_repos} repos</p>
      </div>
    </div>
  );
}

// Loading fallback
function Skeleton() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px', background: '#2c2f33', borderRadius: '8px' }}>
      <div style={{ width: 56, height: 56, borderRadius: '50%', background: '#393d41', animation: 'pulse 1.5s infinite' }} />
      <div style={{ flex: 1 }}>
        <div style={{ width: '40%', height: 14, background: '#393d41', borderRadius: '4px', marginBottom: '8px', animation: 'pulse 1.5s infinite' }} />
        <div style={{ width: '60%', height: 10, background: '#393d41', borderRadius: '4px', animation: 'pulse 1.5s infinite' }} />
      </div>
    </div>
  );
}

function Demo() {
  const [userId, setUserId] = useState(1);

  const handleChange = (id: number) => {
    cache.delete(id); // Clear cache to see loading state again
    setUserId(id);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <style>{`@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }`}</style>
      <div style={{ display: 'flex', gap: '8px' }}>
        <button className={`btn ${userId === 1 ? 'btn-primary' : 'btn-secondary'}`} onClick={() => handleChange(1)}>User 1</button>
        <button className={`btn ${userId === 2 ? 'btn-primary' : 'btn-secondary'}`} onClick={() => handleChange(2)}>User 2</button>
        <button className={`btn ${userId === 3 ? 'btn-primary' : 'btn-secondary'}`} onClick={() => handleChange(3)}>User 3</button>
      </div>

      <Suspense fallback={<Skeleton />}>
        <UserProfile userId={userId} />
      </Suspense>
    </div>
  );
}

export default function Lesson() {
  return (
    <div className="lesson">
      <h2>3.4 — React Suspense</h2>
      <p className="subtitle">
        Suspense permite manejar estados de carga de forma declarativa.
        En vez de <code>if (loading) return {'<Spinner />'}</code>, usas
        <code>{'<Suspense fallback={<Spinner />}>'}</code>.
      </p>

      <h3>El Problema: Loading manual</h3>
      <div className="code-block">{
`// Sin Suspense — cada componente maneja su propio loading
function UserProfile({ id }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetchUser(id)
      .then(setUser)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Spinner />;
  if (error) return <ErrorMessage />;
  return <div>{user.name}</div>;
}
// Esto se repite en CADA componente que hace fetch.`
      }</div>

      <h3>Con Suspense: declarativo y limpio</h3>
      <div className="code-block">{
`// React 19: use() hook lee Promises directamente
function UserProfile({ userId }) {
  const user = use(getUserPromise(userId));
  // Si la Promise no se resolvio, React "suspende" este componente
  // y muestra el fallback del Suspense mas cercano

  return <div>{user.name}</div>; // Solo maneja el happy path
}

// El padre decide que mostrar mientras carga:
<Suspense fallback={<Skeleton />}>
  <UserProfile userId={1} />
</Suspense>

// El componente NO sabe nada de loading states.
// Solo renderiza data. Suspense maneja el loading.`
      }</div>

      <div className="info-box">
        <strong>use() hook (React 19):</strong> Es un hook nuevo que puede leer
        Promises y Context. Cuando le pasas una Promise que aun no se resolvio,
        React "suspende" el componente — lo pausa y muestra el fallback de
        Suspense. Cuando la Promise se resuelve, React re-renderiza con los datos.
      </div>

      <h3>Loading Skeletons</h3>
      <p>
        En vez de un spinner generico, muestra un <strong>skeleton</strong> que tiene
        la misma forma que el contenido real. Esto reduce el "layout shift" percibido
        y se siente mas rapido.
      </p>

      <div className="code-block">{
`function Skeleton() {
  return (
    <div className="skeleton-card">
      <div className="skeleton-avatar" />     {/* Mismo tamaño que avatar real */}
      <div className="skeleton-text-line" />  {/* Mismo ancho que texto real */}
    </div>
  );
}

// CSS con animacion pulse
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
}
.skeleton-avatar {
  background: #393d41;
  animation: pulse 1.5s infinite;
}`
      }</div>

      <h3>Demo Interactiva</h3>
      <p>Clickea los botones para ver Suspense en accion (fetch real de GitHub):</p>
      <div className="demo">
        <p className="demo-label">Suspense + use() + Skeleton fallback:</p>
        <Demo />
      </div>

      <h3>Suspense boundaries multiples</h3>
      <div className="code-block">{
`// Puedes anidar Suspense para loading independiente:
<Suspense fallback={<PageSkeleton />}>
  <Header />

  <div className="grid">
    <Suspense fallback={<SidebarSkeleton />}>
      <Sidebar />   {/* Carga independiente */}
    </Suspense>

    <Suspense fallback={<ContentSkeleton />}>
      <MainContent />  {/* Carga independiente */}
    </Suspense>
  </div>
</Suspense>

// Cada seccion puede cargar a su propio ritmo.
// El Suspense exterior captura si TODO falla.`
      }</div>

      <div className="info-box warning">
        <strong>Pregunta del mentor:</strong> "¿Por que Suspense es mejor que el patron clasico de if(loading) return &lt;Spinner /&gt;?"
        <br /><br />
        <strong>Lo que deberias poder responder:</strong> Porque con el patron clasico, CADA componente que hace fetch tiene que manejar su propio loading/error state — es codigo repetitivo. Con Suspense, el componente solo se preocupa por renderizar los datos (happy path). El PADRE decide donde y como mostrar el loading con el boundary de Suspense. Ademas, Suspense permite loading independiente de diferentes secciones de la pagina en paralelo.
      </div>

      <div className="info-box success">
        <strong>Concepto clave:</strong> Suspense invierte el modelo mental de loading.
        En vez de que cada componente maneje su estado de carga (imperativo),
        defines DONDE mostrar fallbacks en el arbol de componentes (declarativo).
        Los componentes solo se preocupan por renderizar data.
      </div>

      <div className="lesson-nav">
        <Link to="/week3/slots">← Slots Pattern</Link>
        <Link to="/week3/state-management">State Management →</Link>
      </div>
    </div>
  );
}
