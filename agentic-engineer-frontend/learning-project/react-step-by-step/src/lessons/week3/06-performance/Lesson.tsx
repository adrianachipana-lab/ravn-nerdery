import { useState, useMemo, memo, useDeferredValue } from 'react';
import { Link } from 'react-router-dom';

/*
  LECCION 3.6: Performance
  Como hacer que tu app sea rapida
*/

// Demo: sin React.memo vs con React.memo
let renderCountWithout = 0;
let renderCountWith = 0;

function ExpensiveListItem({ text }: { text: string }) {
  renderCountWithout++;
  return <div style={{ padding: '4px 8px', fontSize: '13px', color: '#94979a' }}>{text} (renders: {renderCountWithout})</div>;
}

const MemoizedListItem = memo(function MemoizedListItem({ text }: { text: string }) {
  renderCountWith++;
  return <div style={{ padding: '4px 8px', fontSize: '13px', color: '#70b252' }}>{text} (renders: {renderCountWith})</div>;
});

function MemoDemo() {
  const [count, setCount] = useState(0);
  const items = ['Item A', 'Item B', 'Item C'];

  return (
    <div>
      <button className="btn btn-primary" onClick={() => setCount(c => c + 1)}>
        Re-render parent (count: {count})
      </button>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '12px' }}>
        <div>
          <p style={{ fontSize: '11px', fontWeight: 600, color: '#da584b', textTransform: 'uppercase', marginBottom: '4px' }}>Sin memo (re-renders cada vez)</p>
          {items.map(item => <ExpensiveListItem key={item} text={item} />)}
        </div>
        <div>
          <p style={{ fontSize: '11px', fontWeight: 600, color: '#70b252', textTransform: 'uppercase', marginBottom: '4px' }}>Con memo (no re-renders)</p>
          {items.map(item => <MemoizedListItem key={item} text={item} />)}
        </div>
      </div>
    </div>
  );
}

// Demo: useMemo para calculos pesados
function UseMemoDemo() {
  const [count, setCount] = useState(0);
  const [text, setText] = useState('');

  // Sin useMemo: se recalcula en CADA render (incluyendo cuando escribes texto)
  // Con useMemo: solo se recalcula cuando count cambia
  const expensiveResult = useMemo(() => {
    let result = 0;
    for (let i = 0; i < count * 1000; i++) {
      result += Math.sqrt(i);
    }
    return result.toFixed(2);
  }, [count]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        <button className="btn btn-secondary" onClick={() => setCount(c => c + 1)}>Heavy calc (count: {count})</button>
        <span style={{ fontSize: '12px', color: '#61dafb', fontFamily: 'var(--font-mono)' }}>Result: {expensiveResult}</span>
      </div>
      <input className="input" value={text} onChange={e => setText(e.target.value)} placeholder="Type here — the heavy calc does NOT re-run" />
      <p style={{ fontSize: '12px', color: '#5a5e63' }}>Sin useMemo, escribir aqui recalcularia el resultado pesado. Con useMemo, solo recalcula cuando count cambia.</p>
    </div>
  );
}

// Demo: useDeferredValue para inputs que filtran listas grandes
function DeferredDemo() {
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query);
  const isStale = query !== deferredQuery;

  const allItems = useMemo(() =>
    Array.from({ length: 500 }, (_, i) => `Item ${i + 1} — ${['React', 'TypeScript', 'Node', 'Python', 'Go'][i % 5]}`)
  , []);

  const filtered = useMemo(() =>
    allItems.filter(item => item.toLowerCase().includes(deferredQuery.toLowerCase()))
  , [allItems, deferredQuery]);

  return (
    <div>
      <input className="input" value={query} onChange={e => setQuery(e.target.value)} placeholder="Filter 500 items... (try typing fast)" />
      <div style={{ marginTop: '8px', opacity: isStale ? 0.5 : 1, transition: 'opacity 0.1s', maxHeight: '150px', overflowY: 'auto' }}>
        <p style={{ fontSize: '12px', color: '#5a5e63', marginBottom: '4px' }}>{filtered.length} results</p>
        {filtered.slice(0, 20).map((item, i) => (
          <div key={i} style={{ padding: '2px 0', fontSize: '13px', color: '#94979a' }}>{item}</div>
        ))}
        {filtered.length > 20 && <p style={{ fontSize: '12px', color: '#5a5e63' }}>...and {filtered.length - 20} more</p>}
      </div>
    </div>
  );
}

export default function Lesson() {
  return (
    <div className="lesson">
      <h2>3.6 — Performance</h2>
      <p className="subtitle">
        React es rapido por defecto, pero hay patrones que lo hacen mas rapido.
        Aqui aprendes CUANDO y COMO optimizar.
      </p>

      <h3>Regla de oro: no optimices prematuramente</h3>
      <p>
        La mayoria de apps React son suficientemente rapidas sin optimizacion.
        <strong> Solo optimiza cuando midas un problema real.</strong> Agregar React.memo
        a todo es como poner candado a cada cajon de tu casa — innecesario y
        agrega complejidad.
      </p>

      <h3>React.memo — evitar re-renders innecesarios</h3>
      <p>
        Cuando un componente padre se re-renderiza, TODOS sus hijos se re-renderizan
        tambien, aunque sus props no hayan cambiado. <code>React.memo</code> le dice
        a React: "si las props son las mismas, reutiliza el render anterior".
      </p>

      <div className="demo">
        <p className="demo-label">Clickea el boton — mira los contadores de render:</p>
        <MemoDemo />
      </div>

      <div className="code-block">{
`// Sin memo: se re-renderiza cada vez que el padre cambia
function ListItem({ text }) { ... }

// Con memo: solo se re-renderiza si "text" cambia
const ListItem = memo(function ListItem({ text }) { ... });

// ¿CUANDO usar memo?
// - Componentes en LISTAS (se renderizan muchas veces)
// - Componentes PESADOS (charts, tablas grandes)
// - Componentes que reciben las MISMAS props frecuentemente

// ¿CUANDO NO usar memo?
// - Componentes simples (un <p>, un <span>)
// - Componentes cuyas props SIEMPRE cambian
// - Si no has medido un problema de performance`
      }</div>

      <h3>useMemo — memorizar calculos pesados</h3>
      <p>
        <code>useMemo</code> guarda el resultado de un calculo y solo lo recalcula
        cuando cambian las dependencias. Util para filtros, sorts, o calculos matematicos.
      </p>

      <div className="demo">
        <p className="demo-label">Escribe en el input — el calculo pesado NO se re-ejecuta:</p>
        <UseMemoDemo />
      </div>

      <h3>useDeferredValue — input fluido con lista grande</h3>
      <p>
        Cuando filtras una lista grande, cada keystroke puede sentirse lento porque
        React tiene que filtrar y renderizar muchos items. <code>useDeferredValue</code>
        le dice a React: "actualiza el input inmediatamente, pero la lista puede
        esperar un poquito".
      </p>

      <div className="demo">
        <p className="demo-label">Escribe rapido — el input responde inmediato, la lista se actualiza despues:</p>
        <DeferredDemo />
      </div>

      <h3>Code Splitting con React.lazy</h3>
      <div className="code-block">{
`// SIN lazy: todo se descarga al inicio (bundle grande)
import { Dashboard } from './pages/Dashboard';
import { Settings } from './pages/Settings';

// CON lazy: cada pagina se descarga cuando la visitas
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Settings = lazy(() => import('./pages/Settings'));

// Suspense muestra un fallback mientras carga
<Suspense fallback={<Spinner />}>
  <Routes>
    <Route path="/" element={<Dashboard />} />
    <Route path="/settings" element={<Settings />} />
  </Routes>
</Suspense>

// Resultado: la primera carga es mas rapida porque
// solo descarga el codigo de la pagina actual.`
      }</div>

      <div className="info-box warning">
        <strong>Pregunta del mentor:</strong> "¿Como medis si tu app tiene un problema
        de performance? ¿Que herramientas usas?"
        <br /><br />
        <strong>Lo que deberias poder responder:</strong> (1) <strong>React DevTools Profiler</strong> —
        graba un periodo de uso y te muestra que componentes se re-renderizan, cuanto
        tardan, y por que. (2) <strong>Chrome DevTools Performance tab</strong> — mide
        frames per second y long tasks. (3) <strong>Lighthouse</strong> — audit automatico
        de performance. (4) <strong>React.StrictMode</strong> — en desarrollo, re-renderiza
        todo dos veces para detectar side effects impuros. Si la app es lenta en StrictMode,
        tienes un problema.
      </div>

      <div className="info-box success">
        <strong>Para el code review:</strong> Un reviewer no espera que optimices todo.
        Espera que: (1) No hagas cosas obviamente malas (crear objetos/funciones dentro
        del render que se pasan como props). (2) Uses memo en listas grandes. (3) Sepas
        EXPLICAR cuando optimizar y cuando no. La respuesta "no optimize porque no he
        medido un problema" es perfectamente valida.
      </div>

      <div className="lesson-nav">
        <Link to="/week3/state-management">← State Management</Link>
        <Link to="/week3/tooling">Tooling →</Link>
      </div>
    </div>
  );
}
