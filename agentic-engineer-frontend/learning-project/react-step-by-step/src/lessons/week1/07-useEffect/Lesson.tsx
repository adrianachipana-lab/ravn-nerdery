import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

/*
  LECCION 6: useEffect
  Side effects, cleanup, y el array de dependencias
*/

// Demo 1: Document title
function TitleChanger() {
  const [title, setTitle] = useState('React Learning');

  useEffect(() => {
    document.title = title;
    // No necesita cleanup
  }, [title]); // Solo se ejecuta cuando "title" cambia

  return (
    <div>
      <input
        className="input"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Type to change the page title..."
      />
      <p style={{ fontSize: '13px', color: '#94979a', marginTop: '8px' }}>
        Check the browser tab title ↑
      </p>
    </div>
  );
}

// Demo 2: Timer with cleanup
function Timer() {
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    if (!running) return; // No hace nada si no esta corriendo

    const interval = setInterval(() => {
      setSeconds(prev => prev + 1);
    }, 1000);

    // Cleanup: se ejecuta cuando running cambia o al desmontar
    return () => clearInterval(interval);
  }, [running]);

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
      <span style={{
        fontSize: '32px', fontWeight: 700, fontFamily: 'var(--font-mono)',
        minWidth: '80px',
      }}>
        {String(Math.floor(seconds / 60)).padStart(2, '0')}:
        {String(seconds % 60).padStart(2, '0')}
      </span>
      <button className="btn btn-primary" onClick={() => setRunning(r => !r)}>
        {running ? 'Pause' : 'Start'}
      </button>
      <button className="btn btn-secondary" onClick={() => { setRunning(false); setSeconds(0); }}>
        Reset
      </button>
    </div>
  );
}

// Demo 3: Window resize listener
function WindowSize() {
  const [size, setSize] = useState({ w: window.innerWidth, h: window.innerHeight });

  useEffect(() => {
    const handleResize = () => {
      setSize({ w: window.innerWidth, h: window.innerHeight });
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []); // [] = solo al montar/desmontar

  return (
    <p style={{ fontFamily: 'var(--font-mono)', fontSize: '14px' }}>
      Window: <span style={{ color: '#61dafb' }}>{size.w}</span> x <span style={{ color: '#61dafb' }}>{size.h}</span>px
      <span style={{ color: '#5a5e63', marginLeft: '8px' }}>(resize the window to see it update)</span>
    </p>
  );
}

export default function Lesson() {
  return (
    <div className="lesson">
      <h2>1.6 — useEffect</h2>
      <p className="subtitle">
        <code>useEffect</code> permite ejecutar codigo que interactua con el mundo
        exterior (DOM, APIs, timers, event listeners). Son los "side effects" de React.
      </p>

      <h3>¿Que es un side effect?</h3>
      <p>
        Un componente React debe ser una <strong>funcion pura</strong>: dado las mismas
        props/estado, retorna el mismo JSX. Pero a veces necesitas hacer cosas que estan
        "fuera" de React:
      </p>
      <ul>
        <li>Cambiar el titulo del document</li>
        <li>Hacer fetch a una API</li>
        <li>Agregar/remover event listeners</li>
        <li>Setear timers (setInterval, setTimeout)</li>
        <li>Interactuar con el DOM directamente</li>
      </ul>

      <h3>Sintaxis y dependencias</h3>
      <div className="code-block">{
`useEffect(() => {
  // Este codigo se ejecuta DESPUES del render
  document.title = title;

  // Cleanup (opcional): se ejecuta antes del proximo efecto
  return () => {
    // Limpiar el efecto anterior
  };
}, [title]);
//  ↑ Array de dependencias:
//  - [title]  → se ejecuta cuando "title" cambia
//  - []       → solo al montar (componentDidMount)
//  - omitido  → en CADA render (casi nunca lo quieres)`
      }</div>

      <div className="info-box warning">
        <strong>Regla:</strong> Si tu efecto usa una variable (state o prop), esa variable
        debe estar en el array de dependencias. Si no, el efecto leera un valor viejo (stale closure).
        ESLint te avisa de esto con la regla <code>react-hooks/exhaustive-deps</code>.
      </div>

      <div className="demo">
        <p className="demo-label">Cambiar el titulo del tab del browser:</p>
        <TitleChanger />
      </div>

      <h3>Cleanup: limpiar efectos</h3>
      <p>
        Si tu efecto crea algo (timer, listener, subscription), <strong>necesitas limpiarlo</strong>
        para evitar memory leaks. La funcion de return es el cleanup.
      </p>

      <div className="code-block">{
`useEffect(() => {
  // Crear: al montar o cuando cambia la dependencia
  const interval = setInterval(() => {
    setSeconds(prev => prev + 1);
  }, 1000);

  // Cleanup: al desmontar o ANTES del proximo efecto
  return () => clearInterval(interval);
}, [running]);

// El flujo es:
// 1. Componente se monta → efecto se ejecuta
// 2. "running" cambia → cleanup del efecto anterior → nuevo efecto
// 3. Componente se desmonta → cleanup final`
      }</div>

      <div className="demo">
        <p className="demo-label">Timer con start/pause/reset:</p>
        <Timer />
      </div>

      <h3>Event listeners del window</h3>
      <div className="code-block">{
`useEffect(() => {
  const handleResize = () => {
    setSize({ w: window.innerWidth, h: window.innerHeight });
  };

  window.addEventListener('resize', handleResize);

  // SIEMPRE remover el listener al desmontar
  return () => window.removeEventListener('resize', handleResize);
}, []); // [] = solo una vez al montar`
      }</div>

      <div className="demo">
        <p className="demo-label">Window resize listener:</p>
        <WindowSize />
      </div>

      <div className="info-box warning">
        <strong>Pregunta del mentor:</strong> "Un error comun es poner `[]` como dependencias cuando el effect usa variables del scope. ¿Que bug causa esto y como lo evitas?"
        <br /><br />
        <strong>Respuesta esperada:</strong> Causa un stale closure — el effect captura el valor de la variable al momento del primer render y nunca se actualiza. Ejemplo: si tienes un timer que usa `count` pero las dependencias son `[]`, el timer siempre vera `count = 0`. La solucion es incluir todas las variables usadas en el array de dependencias. ESLint con la regla `react-hooks/exhaustive-deps` te avisa automaticamente.
      </div>

      <div className="info-box warning">
        <strong>Pregunta del mentor:</strong> "¿Es cierto que 'useEffect es el componentDidMount de funciones'? ¿Que tiene de diferente?"
        <br /><br />
        <strong>Respuesta esperada:</strong> No exactamente. componentDidMount se ejecuta UNA vez despues del primer render. useEffect con [] es similar pero con una diferencia clave: useEffect piensa en SINCRONIZACION, no en lifecycle. La pregunta no es "cuando se ejecuta" sino "que efecto externo necesito sincronizar con este estado". Ademas useEffect tiene cleanup integrado (return function), que componentDidMount no tiene — necesitabas componentWillUnmount separado.
      </div>

      <div className="info-box success">
        <strong>Concepto clave:</strong> useEffect sincroniza tu componente con sistemas
        externos. No es un "lifecycle hook" (como componentDidMount). Pensalo como:
        "cuando X cambia, sincroniza Y". Si no necesitas sincronizar con nada externo,
        probablemente no necesitas useEffect.
      </div>

      <div className="lesson-nav">
        <Link to="/week1/useState">← useState</Link>
        <Link to="/week1/useRef">useRef →</Link>
      </div>
    </div>
  );
}
