import { useState } from 'react';
import { Link } from 'react-router-dom';

/*
  LECCION 5: useState
  El hook fundamental de React para manejar estado
*/

// Demo 1: Contador simple
function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
      <button className="btn btn-secondary" onClick={() => setCount(c => c - 1)}>−</button>
      <span style={{ fontSize: '24px', fontWeight: 700, minWidth: '40px', textAlign: 'center' }}>{count}</span>
      <button className="btn btn-primary" onClick={() => setCount(c => c + 1)}>+</button>
      <button className="btn btn-secondary" onClick={() => setCount(0)} style={{ marginLeft: '8px' }}>Reset</button>
    </div>
  );
}

// Demo 2: Toggle
function ToggleDemo() {
  const [isOn, setIsOn] = useState(false);

  return (
    <button
      onClick={() => setIsOn(prev => !prev)}
      style={{
        width: '52px', height: '28px', borderRadius: '999px',
        background: isOn ? '#70b252' : '#5a5e63',
        position: 'relative', transition: 'background 0.2s',
      }}
    >
      <div style={{
        width: '22px', height: '22px', borderRadius: '50%',
        background: 'white', position: 'absolute', top: '3px',
        left: isOn ? '27px' : '3px', transition: 'left 0.2s',
      }} />
    </button>
  );
}

// Demo 3: Estado con objetos
interface Profile {
  name: string;
  bio: string;
}

function ProfileEditor() {
  const [profile, setProfile] = useState<Profile>({ name: 'John Doe', bio: 'Frontend Developer' });
  const [saved, setSaved] = useState(false);

  const handleChange = (field: keyof Profile, value: string) => {
    setProfile(prev => ({ ...prev, [field]: value }));
    setSaved(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <input
        className="input"
        value={profile.name}
        onChange={(e) => handleChange('name', e.target.value)}
        placeholder="Name"
      />
      <input
        className="input"
        value={profile.bio}
        onChange={(e) => handleChange('bio', e.target.value)}
        placeholder="Bio"
      />
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <button className="btn btn-primary" onClick={() => setSaved(true)}>
          Save
        </button>
        {saved && <span style={{ color: '#70b252', fontSize: '13px' }}>Saved!</span>}
      </div>
      <p style={{ fontSize: '13px', color: '#94979a', marginTop: '4px' }}>
        Preview: <strong style={{ color: '#f0f0f0' }}>{profile.name}</strong> — {profile.bio}
      </p>
    </div>
  );
}

export default function Lesson() {
  return (
    <div className="lesson">
      <h2>1.5 — useState</h2>
      <p className="subtitle">
        <code>useState</code> es el hook mas basico y usado de React.
        Permite agregar estado (datos que cambian) a un componente.
      </p>

      <h3>Sintaxis basica</h3>
      <div className="code-block">{
`// useState retorna un array con 2 elementos:
// [1] El valor actual del estado
// [2] Una funcion para actualizarlo
const [count, setCount] = useState(0);
//     ↑          ↑               ↑
//   valor     setter      valor inicial

// Para actualizar:
setCount(5);           // Valor directo
setCount(prev => prev + 1);  // Funcion (basado en valor previo)`
      }</div>

      <div className="demo">
        <p className="demo-label">Contador con useState:</p>
        <Counter />
      </div>

      <h3>Updater function (funcion de actualizacion)</h3>
      <p>
        Cuando el nuevo valor depende del anterior, <strong>siempre usa la updater function</strong>.
        Esto evita bugs con batching (React agrupa multiples setState en un solo render).
      </p>

      <div className="code-block">{
`// MAL: puede perder actualizaciones con batching
setCount(count + 1);
setCount(count + 1); // ambos leen el mismo "count"

// BIEN: cada update lee el valor mas reciente
setCount(prev => prev + 1);
setCount(prev => prev + 1); // funciona correctamente`
      }</div>

      <h3>Estado booleano (Toggle)</h3>
      <div className="code-block">{
`const [isOn, setIsOn] = useState(false);

// Toggle: invierte el valor actual
setIsOn(prev => !prev);`
      }</div>

      <div className="demo">
        <p className="demo-label">Toggle switch:</p>
        <ToggleDemo />
      </div>

      <h3>Estado con objetos</h3>
      <p>
        Cuando el estado es un objeto, <strong>nunca lo mutes directamente</strong>.
        Siempre crea un nuevo objeto con el spread operator (<code>...</code>).
      </p>

      <div className="code-block">{
`const [profile, setProfile] = useState({ name: 'John', bio: 'Dev' });

// MAL: mutacion directa (React no detecta el cambio)
profile.name = 'Jane';  // ❌ React no re-renderiza

// BIEN: nuevo objeto con spread
setProfile(prev => ({ ...prev, name: 'Jane' }));
// Crea un nuevo objeto, copia todo lo anterior, sobreescribe name`
      }</div>

      <div className="demo">
        <p className="demo-label">Profile editor con objeto de estado:</p>
        <ProfileEditor />
      </div>

      <h3>El ciclo: interaccion → estado → render</h3>
      <div className="info-box">
        <strong>El ciclo fundamental de React:</strong><br />
        1. El usuario interactua (click, input, etc.)<br />
        2. Se llama al setter (<code>setState</code>)<br />
        3. React marca el componente como "dirty"<br />
        4. React re-ejecuta la funcion del componente<br />
        5. React compara el JSX anterior con el nuevo (diffing)<br />
        6. React actualiza solo lo que cambio en el DOM real
      </div>

      <div className="info-box warning">
        <strong>Pregunta del mentor:</strong> "Si useState es tan simple, ¿por que necesitamos useReducer? ¿Cuando useState deja de ser suficiente?"
        <br /><br />
        <strong>Respuesta esperada:</strong> useState es perfecto para valores simples (boolean, string, number) o estado con pocas transiciones. Pero cuando tienes un estado con multiples sub-valores que cambian juntos (como un formulario con 10 campos) o cuando la logica de actualizacion es compleja (multiples acciones como add/remove/update/filter), useReducer centraliza esa logica en un solo lugar y hace las transiciones explicitas. Tambien facilita testing porque el reducer es una funcion pura.
      </div>

      <div className="info-box warning">
        <strong>Pregunta del mentor:</strong> "¿Por que la updater function <code>{'setCount(prev => prev + 1)'}</code> es mas segura que <code>{'setCount(count + 1)'}</code>?"
        <br /><br />
        <strong>Respuesta esperada:</strong> Por el batching de React. React agrupa multiples setState en un solo render por performance. Si llamas <code>{'setCount(count + 1)'}</code> dos veces seguidas, ambas leen el mismo valor de count (el del render actual), asi que el resultado es count + 1, no count + 2. Con la updater function, cada llamada recibe el valor MAS RECIENTE como argumento, asi que funciona correctamente incluso con batching.
      </div>

      <div className="info-box success">
        <strong>Concepto clave:</strong> useState es un hook — solo puedes llamarlo
        en el nivel superior de un componente (no dentro de ifs, loops, o funciones
        anidadas). Esto es porque React depende del orden en que se llaman los hooks.
      </div>

      <div className="lesson-nav">
        <Link to="/week1/forms">← Forms</Link>
        <Link to="/week1/useEffect">useEffect →</Link>
      </div>
    </div>
  );
}
