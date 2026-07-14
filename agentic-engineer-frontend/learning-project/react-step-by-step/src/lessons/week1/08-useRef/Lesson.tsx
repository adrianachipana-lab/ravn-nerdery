import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';

/*
  LECCION 7: useRef
  Referencias al DOM y valores mutables que no causan re-render
*/

// Demo 1: Focus input
function FocusDemo() {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    inputRef.current?.focus();
    inputRef.current?.select();
  };

  return (
    <div style={{ display: 'flex', gap: '8px' }}>
      <input ref={inputRef} className="input" defaultValue="Click the button to focus me" style={{ flex: 1 }} />
      <button className="btn btn-primary" onClick={handleClick}>Focus</button>
    </div>
  );
}

// Demo 2: Stopwatch with useRef for timing
function Stopwatch() {
  const [elapsed, setElapsed] = useState(0);
  const [running, setRunning] = useState(false);
  const startTimeRef = useRef(0);
  const rafRef = useRef(0);

  const update = () => {
    setElapsed(Date.now() - startTimeRef.current);
    rafRef.current = requestAnimationFrame(update);
  };

  const start = () => {
    startTimeRef.current = Date.now() - elapsed;
    rafRef.current = requestAnimationFrame(update);
    setRunning(true);
  };

  const stop = () => {
    cancelAnimationFrame(rafRef.current);
    setRunning(false);
  };

  const reset = () => {
    cancelAnimationFrame(rafRef.current);
    setRunning(false);
    setElapsed(0);
  };

  useEffect(() => {
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  const ms = elapsed % 1000;
  const secs = Math.floor(elapsed / 1000) % 60;
  const mins = Math.floor(elapsed / 60000);

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '28px', fontWeight: 700, minWidth: '160px' }}>
        {String(mins).padStart(2, '0')}:{String(secs).padStart(2, '0')}.{String(ms).padStart(3, '0')}
      </span>
      <button className="btn btn-primary" onClick={running ? stop : start}>
        {running ? 'Stop' : 'Start'}
      </button>
      <button className="btn btn-secondary" onClick={reset}>Reset</button>
    </div>
  );
}

// Demo 3: Render counter
function RenderCounter() {
  const [text, setText] = useState('');
  const renderCount = useRef(0);

  renderCount.current += 1;

  return (
    <div>
      <input className="input" value={text} onChange={e => setText(e.target.value)} placeholder="Type anything..." />
      <p style={{ fontSize: '13px', color: '#94979a', marginTop: '8px' }}>
        This component has rendered <strong style={{ color: '#61dafb' }}>{renderCount.current}</strong> times
      </p>
      <p style={{ fontSize: '12px', color: '#5a5e63' }}>
        (renderCount es un useRef, no causa re-renders al actualizarse)
      </p>
    </div>
  );
}

export default function Lesson() {
  return (
    <div className="lesson">
      <h2>1.7 — useRef</h2>
      <p className="subtitle">
        <code>useRef</code> crea una referencia mutable que persiste entre renders sin causar re-renders.
        Se usa para acceder al DOM y para guardar valores que no necesitan ser reactivos.
      </p>

      <h3>useRef para acceder al DOM</h3>
      <p>
        A veces necesitas interactuar directamente con un elemento del DOM (focus, scroll, medir tamanio).
        <code>useRef</code> te da una referencia directa.
      </p>

      <div className="code-block">{
`const inputRef = useRef<HTMLInputElement>(null);

// Acceder al elemento DOM real
const handleClick = () => {
  inputRef.current?.focus();  // .current contiene el elemento
};

// Conectar ref al JSX
<input ref={inputRef} />
<button onClick={handleClick}>Focus</button>`
      }</div>

      <div className="demo">
        <p className="demo-label">Focus input con useRef:</p>
        <FocusDemo />
      </div>

      <h3>useRef vs useState</h3>
      <div className="code-block">{
`// useState: cuando el valor debe MOSTRARSE en la UI
const [count, setCount] = useState(0);
// Cambiar count → React re-renderiza → UI se actualiza

// useRef: cuando el valor NO necesita mostrarse
const intervalRef = useRef(0);
// Cambiar intervalRef.current → NO re-renderiza
// Perfecto para: timers, IDs, valores previos, contadores internos`
      }</div>

      <div className="info-box">
        <strong>Regla simple:</strong> Si el usuario debe VER el cambio → <code>useState</code>.
        Si es un valor interno que no afecta la UI → <code>useRef</code>.
      </div>

      <h3>useRef para valores mutables</h3>
      <p>
        useRef es como una "caja" que mantiene un valor entre renders. Cambiar
        <code>.current</code> no causa re-render. Perfecto para almacenar IDs de
        timers, timestamps, o cualquier valor que necesites persistir.
      </p>

      <div className="demo">
        <p className="demo-label">Stopwatch precision (useRef para timing):</p>
        <Stopwatch />
      </div>

      <h3>Contar renders sin causar re-render</h3>
      <div className="code-block">{
`const renderCount = useRef(0);

// Se incrementa en cada render, pero NO causa otro render
renderCount.current += 1;

// Si usaramos useState para esto:
// const [renderCount, setRenderCount] = useState(0);
// setRenderCount(c => c + 1);  // ❌ Causaria un loop infinito!`
      }</div>

      <div className="demo">
        <p className="demo-label">Render counter (escribe para causar re-renders):</p>
        <RenderCounter />
      </div>

      <div className="info-box warning">
        <strong>Pregunta del mentor:</strong> "¿Por que useRef no causa re-renders cuando cambia .current, si internamente React lo mantiene entre renders igual que useState?"
        <br /><br />
        <strong>Respuesta esperada:</strong> Porque useState tiene un mecanismo de notificacion — cuando llamas al setter, React marca el componente como "dirty" y programa un re-render. useRef es simplemente un objeto JavaScript con una propiedad `.current` — cambiarla es como cambiar cualquier propiedad de un objeto, React no se entera. Por eso useRef es perfecto para valores que necesitas persistir entre renders pero que no afectan la UI.
      </div>

      <div className="info-box warning">
        <strong>Pregunta del mentor:</strong> "¿Que pasa si leo ref.current durante el render (no en un effect o handler)? ¿Es seguro?"
        <br /><br />
        <strong>Respuesta esperada:</strong> Leer es seguro, pero ESCRIBIR ref.current durante el render puede causar bugs porque React puede ejecutar la funcion del componente multiples veces (StrictMode lo hace). La regla es: lee refs en render si necesitas, pero ESCRIBE refs solo en effects o event handlers, donde el timing es predecible.
      </div>

      <div className="info-box success">
        <strong>Concepto clave:</strong> useRef es un "escape hatch" de React.
        Te permite guardar valores mutables y acceder al DOM real cuando el modelo
        declarativo de React no es suficiente. Usalo con moderacion — si puedes
        resolver el problema con props y estado, prefiere eso.
      </div>

      <div className="lesson-nav">
        <Link to="/week1/useEffect">← useEffect</Link>
        <Link to="/week1/styling">Styling →</Link>
      </div>
    </div>
  );
}
