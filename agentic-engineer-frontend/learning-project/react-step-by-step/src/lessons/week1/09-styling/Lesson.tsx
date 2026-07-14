import { useState } from 'react';
import { Link } from 'react-router-dom';

/*
  LECCION 8: Styling en React
  Diferentes formas de aplicar estilos y cual elegir
*/

// Demo: comparacion de metodos de styling
function InlineStyleDemo() {
  const [active, setActive] = useState(false);
  return (
    <button
      onClick={() => setActive(a => !a)}
      style={{
        padding: '10px 20px',
        borderRadius: '8px',
        background: active ? '#70b252' : '#2c2f33',
        color: active ? 'white' : '#94979a',
        border: '1px solid rgba(255,255,255,0.06)',
        fontSize: '14px',
        fontWeight: 500,
        transition: 'all 0.15s',
        cursor: 'pointer',
      }}
    >
      {active ? 'Active ✓' : 'Click me'}
    </button>
  );
}

function ClassNameDemo() {
  const [variant, setVariant] = useState<'primary' | 'danger' | 'secondary'>('primary');

  return (
    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
      <button className={`btn btn-${variant}`} onClick={() => setVariant('primary')}>Primary</button>
      <button className={`btn btn-${variant === 'danger' ? 'danger' : 'secondary'}`} onClick={() => setVariant('danger')}>Danger</button>
      <button className={`btn btn-${variant === 'secondary' ? 'secondary' : 'secondary'}`} onClick={() => setVariant('secondary')}>Secondary</button>
      <p style={{ width: '100%', fontSize: '13px', color: '#94979a', marginTop: '4px' }}>
        Current variant: <code>{variant}</code>
      </p>
    </div>
  );
}

function CSSVariablesDemo() {
  const [hue, setHue] = useState(200);
  return (
    <div>
      <input
        type="range"
        min="0"
        max="360"
        value={hue}
        onChange={e => setHue(Number(e.target.value))}
        style={{ width: '100%' }}
      />
      <div style={{
        marginTop: '12px',
        padding: '20px',
        borderRadius: '8px',
        background: `hsl(${hue}, 70%, 15%)`,
        border: `1px solid hsl(${hue}, 70%, 30%)`,
        color: `hsl(${hue}, 80%, 70%)`,
        fontSize: '14px',
        fontWeight: 600,
        textAlign: 'center',
        transition: 'all 0.15s',
      }}>
        Hue: {hue}° — Dynamic theming with CSS
      </div>
    </div>
  );
}

export default function Lesson() {
  return (
    <div className="lesson">
      <h2>1.8 — Styling en React</h2>
      <p className="subtitle">
        Hay varias formas de aplicar estilos en React. Cada una tiene ventajas.
        Lo importante es elegir una y ser consistente.
      </p>

      <h3>1. Inline Styles</h3>
      <p>
        Pasas un objeto JavaScript al prop <code>style</code>. Las propiedades usan camelCase.
        Util para estilos dinamicos, pero no soporta pseudo-clases ni media queries.
      </p>

      <div className="code-block">{
`// Inline styles: objeto JS con camelCase
<div style={{
  backgroundColor: '#222',    // background-color
  fontSize: '14px',           // font-size
  padding: '10px 20px',
  borderRadius: '8px',        // border-radius
}}>

// Dinamico con estado:
<div style={{
  background: isActive ? 'green' : 'gray',
  transform: \`translateX(\${offset}px)\`,
}}>`
      }</div>

      <div className="demo">
        <p className="demo-label">Inline style con toggle dinamico:</p>
        <InlineStyleDemo />
      </div>

      <h3>2. CSS Classes (className)</h3>
      <p>
        El metodo clasico: CSS en archivos separados, aplicados via <code>className</code>.
        Soporta todo CSS. Se pueden combinar condicionalmente.
      </p>

      <div className="code-block">{
`// CSS clasico
<div className="card">
<div className="card active">   // Multiples clases

// Condicional con template literal
<div className={\`card \${isActive ? 'active' : ''}\`}>

// Condicional con array.join
<div className={['card', isActive && 'active'].filter(Boolean).join(' ')}>`
      }</div>

      <div className="demo">
        <p className="demo-label">Clases dinamicas:</p>
        <ClassNameDemo />
      </div>

      <h3>3. CSS Modules (recomendado para proyectos)</h3>
      <p>
        CSS Modules genera clases unicas por componente. <strong>Cero colisiones de nombres</strong>.
        Es lo que usamos en el challenge project.
      </p>

      <div className="code-block">{
`// TaskCard.module.css
.card {
  background: var(--color-bg-card);
  border-radius: 8px;
}
.active {
  border-color: blue;
}

// TaskCard.tsx
import styles from './TaskCard.module.css';

// styles.card = "TaskCard_card_x7k2z" (nombre unico generado)
<div className={styles.card}>
<div className={\`\${styles.card} \${isActive ? styles.active : ''}\`}>`
      }</div>

      <div className="info-box">
        <strong>Ventaja principal:</strong> Con CSS Modules, nunca te preocupas por
        colisiones de nombres. Puedes tener <code>.card</code> en 10 componentes
        diferentes y cada uno tendra su propia clase unica.
      </div>

      <h3>4. CSS Variables (Custom Properties)</h3>
      <p>
        Variables CSS permiten centralizar valores (colores, spacing) y crear temas
        dinamicos. Se definen en <code>:root</code> y se usan con <code>var()</code>.
      </p>

      <div className="code-block">{
`/* variables.css */
:root {
  --color-primary: #da584b;
  --spacing-md: 16px;
  --radius-md: 8px;
}

/* Cualquier componente puede usarlas */
.card {
  background: var(--color-primary);
  padding: var(--spacing-md);
  border-radius: var(--radius-md);
}`
      }</div>

      <div className="demo">
        <p className="demo-label">CSS variables dinamicas (mueve el slider):</p>
        <CSSVariablesDemo />
      </div>

      <h3>¿Cual elegir?</h3>
      <ul>
        <li><strong>CSS Modules</strong> — Para componentes. Scoping automatico, zero config con Vite</li>
        <li><strong>CSS Variables</strong> — Para design tokens (colores, spacing). Globales y tematizables</li>
        <li><strong>Inline styles</strong> — Solo para valores verdaderamente dinamicos (calculados en JS)</li>
        <li><strong>CSS clasico</strong> — Para estilos globales (reset, layout base)</li>
      </ul>

      <div className="info-box warning">
        <strong>Pregunta del mentor:</strong> "En un proyecto de equipo, ¿por que CSS Modules es mejor que CSS global o inline styles?"
        <br /><br />
        <strong>Respuesta esperada:</strong> CSS global tiene colisiones de nombres — si dos devs crean una clase `.card`, se sobreescriben. CSS Modules genera nombres unicos automaticamente, asi que cada componente tiene sus propios estilos encapsulados. Inline styles no soportan pseudo-clases (:hover, :focus), media queries, ni animations. CSS Modules te da todo el poder de CSS con el scoping de los estilos inline. Es el punto medio optimo.
      </div>

      <div className="info-box warning">
        <strong>Pregunta del mentor:</strong> "¿Que son los design tokens (CSS variables) y por que deberias usarlos?"
        <br /><br />
        <strong>Respuesta esperada:</strong> Son valores centralizados (colores, spacing, fonts) definidos en un solo lugar con CSS custom properties (--color-primary, --spacing-md). En vez de hardcodear "#da584b" en 50 archivos, usas var(--color-primary). Si el disenador cambia el color, lo cambias en UN lugar y se actualiza en toda la app. Tambien facilitan theming (dark/light mode) y mantienen consistencia visual en el equipo.
      </div>

      <div className="info-box success">
        <strong>Concepto clave:</strong> En RAVN se usa CSS Modules + Variables CSS. Es la combinacion
        mas limpia: estilos scoped por componente con un design system global via variables.
        El challenge project sigue exactamente esta estrategia.
      </div>

      <div className="lesson-nav">
        <Link to="/week1/useRef">← useRef</Link>
        <Link to="/">Inicio →</Link>
      </div>
    </div>
  );
}
