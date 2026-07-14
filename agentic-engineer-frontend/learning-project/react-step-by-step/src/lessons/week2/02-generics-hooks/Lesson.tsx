import { useState } from 'react';
import { Link } from 'react-router-dom';

/*
  LECCION 2.2: Generics en React + TypeScript
  Como hacer componentes y hooks type-safe y reutilizables
*/

// Hook generico: useLocalStorage<T>
function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((prev: T) => T)) => void] {
  const [stored, setStored] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) as T : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setValue = (value: T | ((prev: T) => T)) => {
    const valueToStore = value instanceof Function ? value(stored) : value;
    setStored(valueToStore);
    window.localStorage.setItem(key, JSON.stringify(valueToStore));
  };

  return [stored, setValue];
}

// Componente generico: Select<T>
interface SelectOption<T> {
  value: T;
  label: string;
}

interface SelectProps<T> {
  options: SelectOption<T>[];
  value: T;
  onChange: (value: T) => void;
  label?: string;
}

function Select<T extends string | number>({ options, value, onChange, label }: SelectProps<T>) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
      {label && <span style={{ fontSize: '12px', fontWeight: 600, color: '#5a5e63', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label}</span>}
      <select
        className="input"
        value={String(value)}
        onChange={(e) => {
          const selected = options.find(o => String(o.value) === e.target.value);
          if (selected) onChange(selected.value);
        }}
        style={{ appearance: 'none' }}
      >
        {options.map(opt => (
          <option key={String(opt.value)} value={String(opt.value)}>{opt.label}</option>
        ))}
      </select>
    </div>
  );
}

// Hook generico: useToggle
function useToggle(initial = false): [boolean, () => void, () => void, () => void] {
  const [value, setValue] = useState(initial);
  const toggle = () => setValue(v => !v);
  const setTrue = () => setValue(true);
  const setFalse = () => setValue(false);
  return [value, toggle, setTrue, setFalse];
}

// Demos
type Theme = 'dark' | 'light' | 'auto';
type FontSize = 12 | 14 | 16 | 18;

function SettingsDemo() {
  const [theme, setTheme] = useLocalStorage<Theme>('demo-theme', 'dark');
  const [fontSize, setFontSize] = useLocalStorage<FontSize>('demo-font-size', 14);
  const [notifications, toggleNotifs] = useToggle(true);

  const themeOptions: SelectOption<Theme>[] = [
    { value: 'dark', label: 'Dark Mode' },
    { value: 'light', label: 'Light Mode' },
    { value: 'auto', label: 'System Default' },
  ];

  const fontOptions: SelectOption<FontSize>[] = [
    { value: 12, label: '12px - Small' },
    { value: 14, label: '14px - Medium' },
    { value: 16, label: '16px - Large' },
    { value: 18, label: '18px - Extra Large' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <Select<Theme> options={themeOptions} value={theme} onChange={setTheme} label="Theme" />
      <Select<FontSize> options={fontOptions} value={fontSize} onChange={setFontSize} label="Font Size" />

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <button onClick={toggleNotifs} style={{
          width: '44px', height: '24px', borderRadius: '999px', position: 'relative',
          background: notifications ? '#70b252' : '#5a5e63', transition: 'background 0.2s', cursor: 'pointer', border: 'none',
        }}>
          <div style={{ width: '18px', height: '18px', borderRadius: '50%', background: 'white', position: 'absolute', top: '3px', left: notifications ? '23px' : '3px', transition: 'left 0.2s' }} />
        </button>
        <span style={{ fontSize: '14px' }}>Notifications {notifications ? 'ON' : 'OFF'}</span>
      </div>

      <div style={{ padding: '12px', background: '#191b1f', borderRadius: '6px', fontFamily: 'var(--font-mono)', fontSize: '12px', color: '#94979a' }}>
        State: {JSON.stringify({ theme, fontSize, notifications }, null, 2)}
      </div>
    </div>
  );
}

export default function Lesson() {
  return (
    <div className="lesson">
      <h2>2.2 — Generics en Hooks y Componentes</h2>
      <p className="subtitle">
        Los generics de TypeScript permiten crear componentes y hooks que son
        type-safe Y reutilizables al mismo tiempo.
      </p>

      <h3>Hook Generico: useLocalStorage{'<T>'}</h3>
      <div className="code-block">{
`// T es un "tipo parametro" — se define al usar el hook
function useLocalStorage<T>(key: string, initialValue: T) {
  const [stored, setStored] = useState<T>(initialValue);
  // ...
  return [stored, setValue] as const;
}

// Al usarlo, T se infiere automaticamente:
const [theme, setTheme] = useLocalStorage('theme', 'dark');
// TypeScript sabe que theme es string y setTheme acepta string

// O puedes ser explicito:
const [count, setCount] = useLocalStorage<number>('count', 0);
// Ahora setCount solo acepta number`
      }</div>

      <h3>Componente Generico: Select{'<T>'}</h3>
      <div className="code-block">{
`interface SelectOption<T> {
  value: T;       // El valor puede ser de cualquier tipo
  label: string;  // Lo que se muestra al usuario
}

interface SelectProps<T> {
  options: SelectOption<T>[];
  value: T;
  onChange: (value: T) => void;  // Retorna el tipo correcto
}

// T extends string | number = T debe ser string o number
function Select<T extends string | number>({ options, value, onChange }: SelectProps<T>) {
  // ...
}

// Uso tipado:
<Select<Theme> options={themeOptions} value={theme} onChange={setTheme} />
// onChange solo acepta Theme, no cualquier string`
      }</div>

      <div className="info-box">
        <strong>¿Por que generics?</strong> Sin generics, tu Select tendria
        <code>onChange: (value: string) =&gt; void</code> y perdería la información
        del tipo. Con generics, si las opciones son de tipo <code>Theme</code>,
        el onChange recibe exactamente <code>Theme</code>.
      </div>

      <h3>Hook Helper: useToggle</h3>
      <div className="code-block">{
`function useToggle(initial = false) {
  const [value, setValue] = useState(initial);
  const toggle = () => setValue(v => !v);
  const setTrue = () => setValue(true);
  const setFalse = () => setValue(false);
  return [value, toggle, setTrue, setFalse] as const;
}

// Uso:
const [isOpen, toggle, open, close] = useToggle();`
      }</div>

      <h3>Demo Interactiva</h3>
      <p>Los valores se guardan en localStorage (persisten al recargar):</p>
      <div className="demo">
        <p className="demo-label">Settings con generics (Select{'<Theme>'}, useLocalStorage{'<FontSize>'}):</p>
        <SettingsDemo />
      </div>

      <div className="info-box warning">
        <strong>Pregunta del mentor:</strong> "Explicame con una analogia sencilla que es un generic en TypeScript."
        <br /><br />
        <strong>Lo que deberias poder responder:</strong> Un generic es como un contenedor que se adapta a lo que le pongas. Imagina una caja de regalo — la caja siempre tiene la misma forma, pero lo que hay adentro cambia. Cuando dices useLocalStorage&lt;number&gt;, le dices "esta caja guarda numeros". Cuando dices useLocalStorage&lt;string&gt;, le dices "esta caja guarda textos". La caja (el hook) funciona igual para ambos, pero TypeScript sabe exactamente que tipo de cosa hay adentro y te avisa si intentas meter algo incorrecto.
      </div>

      <div className="info-box success">
        <strong>Concepto clave:</strong> Los generics hacen que TypeScript trabaje PARA ti.
        En vez de usar <code>any</code> para hacer algo reutilizable, usas generics y
        mantienes la type safety. El autocompletado y los errores de compilacion te ayudan.
      </div>

      <div className="lesson-nav">
        <Link to="/week2/typing-props">← Typing Props</Link>
        <Link to="/week2/useReducer">useReducer →</Link>
      </div>
    </div>
  );
}
