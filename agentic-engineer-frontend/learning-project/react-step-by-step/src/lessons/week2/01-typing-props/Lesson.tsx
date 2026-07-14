import { useState } from 'react';
import { Link } from 'react-router-dom';

/*
  LECCION 2.1: Typing Props con TypeScript
  Como tipar componentes de React correctamente
*/

// Ejemplo 1: Props basicas
interface ButtonProps {
  label: string;
  variant?: 'primary' | 'danger' | 'ghost'; // Union type = solo estos valores
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  onClick: () => void; // Funcion sin argumentos ni retorno
}

function Button({ label, variant = 'primary', size = 'md', disabled = false, onClick }: ButtonProps) {
  const sizes = { sm: '8px 12px', md: '10px 18px', lg: '14px 24px' };
  const colors = {
    primary: { bg: '#61dafb', text: '#000' },
    danger: { bg: '#da584b', text: '#fff' },
    ghost: { bg: 'transparent', text: '#94979a' },
  };
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        padding: sizes[size],
        background: colors[variant].bg,
        color: colors[variant].text,
        border: variant === 'ghost' ? '1px solid #5a5e63' : 'none',
        borderRadius: '6px', fontSize: '14px', fontWeight: 500,
        opacity: disabled ? 0.5 : 1, cursor: disabled ? 'not-allowed' : 'pointer',
        transition: 'transform 0.1s',
      }}
    >
      {label}
    </button>
  );
}

// Ejemplo 2: Children tipado
interface CardProps {
  title: string;
  children: React.ReactNode; // Acepta cualquier JSX valido
  footer?: React.ReactNode;  // Footer opcional
}

function Card({ title, children, footer }: CardProps) {
  return (
    <div style={{ background: '#2c2f33', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)', overflow: 'hidden' }}>
      <div style={{ padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)', fontWeight: 600, fontSize: '14px' }}>{title}</div>
      <div style={{ padding: '16px' }}>{children}</div>
      {footer && <div style={{ padding: '12px 16px', borderTop: '1px solid rgba(255,255,255,0.06)', fontSize: '13px', color: '#94979a' }}>{footer}</div>}
    </div>
  );
}

// Ejemplo 3: Event handlers tipados
interface SearchInputProps {
  value: string;
  onChange: (value: string) => void; // Callback con el valor string, no el evento
  onSubmit: (value: string) => void;
  placeholder?: string;
}

function SearchInput({ value, onChange, onSubmit, placeholder = 'Search...' }: SearchInputProps) {
  return (
    <form onSubmit={(e: React.FormEvent<HTMLFormElement>) => { e.preventDefault(); onSubmit(value); }}>
      <input
        className="input"
        value={value}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
        placeholder={placeholder}
      />
    </form>
  );
}

function Demo() {
  const [log, setLog] = useState<string[]>([]);
  const [search, setSearch] = useState('');

  const addLog = (msg: string) => setLog(prev => [`${new Date().toLocaleTimeString()} — ${msg}`, ...prev].slice(0, 5));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        <Button label="Primary" onClick={() => addLog('Primary clicked')} />
        <Button label="Danger" variant="danger" onClick={() => addLog('Danger clicked')} />
        <Button label="Ghost" variant="ghost" onClick={() => addLog('Ghost clicked')} />
        <Button label="Small" size="sm" onClick={() => addLog('Small clicked')} />
        <Button label="Disabled" disabled onClick={() => {}} />
      </div>

      <Card title="Search Card" footer={<span>Results will appear in the log</span>}>
        <SearchInput value={search} onChange={setSearch} onSubmit={(v) => addLog(`Searched: "${v}"`)} placeholder="Type and press Enter..." />
      </Card>

      {log.length > 0 && (
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: '#94979a' }}>
          {log.map((entry, i) => <div key={i}>{entry}</div>)}
        </div>
      )}
    </div>
  );
}

export default function Lesson() {
  return (
    <div className="lesson">
      <h2>2.1 — Typing Props</h2>
      <p className="subtitle">
        TypeScript en React no es solo poner tipos. Es disenar interfaces que hacen
        que tus componentes sean imposibles de usar mal.
      </p>

      <h3>Interface para Props</h3>
      <div className="code-block">{
`interface ButtonProps {
  label: string;                         // Requerido
  variant?: 'primary' | 'danger' | 'ghost'; // Opcional + union type
  size?: 'sm' | 'md' | 'lg';              // Solo estos 3 valores
  disabled?: boolean;                      // Default false
  onClick: () => void;                    // Callback requerido
}

// El ? hace el prop OPCIONAL. Usas defaults en destructuring:
function Button({ variant = 'primary', size = 'md' }: ButtonProps) {}`
      }</div>

      <div className="info-box">
        <strong>Union types</strong> como <code>'primary' | 'danger' | 'ghost'</code> son
        poderosos: el autocompletado te muestra solo las opciones validas, y TypeScript
        te avisa si pasas un valor invalido.
      </div>

      <h3>Tipando children</h3>
      <div className="code-block">{
`interface CardProps {
  title: string;
  children: React.ReactNode;   // Acepta CUALQUIER JSX valido
  footer?: React.ReactNode;    // Opcional
}

// React.ReactNode incluye:
// string, number, boolean, null, undefined, JSX.Element,
// arrays de cualquiera de estos, y fragments`
      }</div>

      <h3>Tipando event handlers</h3>
      <div className="code-block">{
`// Opcion 1: Tipar el evento directamente
onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
  console.log(e.target.value);
}}

// Opcion 2: Exponer solo el valor (mejor API para el consumidor)
interface SearchInputProps {
  onChange: (value: string) => void;  // Solo el string, no el evento
}

// El componente extrae el valor internamente:
<input onChange={(e) => onChange(e.target.value)} />`
      }</div>

      <div className="info-box warning">
        <strong>Pregunta del mentor:</strong> "¿Por que usamos una interface para las props en vez de pasar los datos sin tipo?"
        <br /><br />
        <strong>Lo que deberias poder responder:</strong> Porque la interface actua como un CONTRATO entre el componente y quien lo usa. Si la interface dice que "name" es string obligatorio, TypeScript te avisa ANTES de ejecutar si te olvidaste de pasarlo o si pasaste un numero. Sin tipos, el error aparece en el browser en runtime cuando el usuario ya esta usando la app. Con tipos, el error aparece en tu editor mientras escribes. Es como un formulario que te avisa "este campo es obligatorio" antes de que lo envies.
      </div>

      <div className="info-box warning">
        <strong>Pregunta del mentor:</strong> "¿Cual es la diferencia entre usar `type` y `interface` para las props?"
        <br /><br />
        <strong>Lo que deberias poder responder:</strong> Para props de componentes, son practicamente iguales. La convencion en React es usar `interface` porque se pueden extender (heredar) mas facilmente, y porque el error message de TypeScript es mas claro. Pero si necesitas un union type o un tipo mas complejo, usas `type`. En RAVN la convencion es `interface` para props.
      </div>

      <div className="info-box success">
        <strong>Best practice:</strong> Cuando diseñas la interface de un componente,
        piensa en quien lo VA A USAR. <code>onChange: (value: string) =&gt; void</code> es
        mejor API que <code>onChange: (e: React.ChangeEvent) =&gt; void</code> porque
        el consumidor no necesita saber sobre el evento.
      </div>

      <h3>Demo Interactiva</h3>
      <div className="demo">
        <p className="demo-label">Button variants + Card + SearchInput tipados:</p>
        <Demo />
      </div>

      <div className="lesson-nav">
        <Link to="/week1/styling">← Styling</Link>
        <Link to="/week2/generics">Generics →</Link>
      </div>
    </div>
  );
}
