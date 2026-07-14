import { createContext, useContext, useReducer } from 'react';
import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

/*
  LECCION 2.5: Context API
  Compartir estado global sin prop drilling
*/

// 1. Definir el estado y acciones
interface ThemeState {
  mode: 'dark' | 'light';
  accent: string;
  fontSize: number;
}

type ThemeAction =
  | { type: 'TOGGLE_MODE' }
  | { type: 'SET_ACCENT'; payload: string }
  | { type: 'SET_FONT_SIZE'; payload: number };

function themeReducer(state: ThemeState, action: ThemeAction): ThemeState {
  switch (action.type) {
    case 'TOGGLE_MODE':
      return { ...state, mode: state.mode === 'dark' ? 'light' : 'dark' };
    case 'SET_ACCENT':
      return { ...state, accent: action.payload };
    case 'SET_FONT_SIZE':
      return { ...state, fontSize: action.payload };
  }
}

// 2. Crear el Context
interface ThemeContextValue {
  state: ThemeState;
  dispatch: React.Dispatch<ThemeAction>;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

// 3. Custom hook para consumir (con error handling)
function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

// 4. Provider component
function ThemeProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(themeReducer, {
    mode: 'dark',
    accent: '#61dafb',
    fontSize: 14,
  });

  return (
    <ThemeContext.Provider value={{ state, dispatch }}>
      {children}
    </ThemeContext.Provider>
  );
}

// Componentes que CONSUMEN el context (sin prop drilling)
function ThemeControls() {
  const { state, dispatch } = useTheme();
  const accents = ['#61dafb', '#70b252', '#da584b', '#e5b454', '#9382e3'];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', padding: '16px', background: state.mode === 'dark' ? '#2c2f33' : '#f0f0f0', borderRadius: '8px', border: '1px solid rgba(128,128,128,0.2)', transition: 'all 0.2s' }}>
      <p style={{ fontSize: '12px', fontWeight: 600, color: state.mode === 'dark' ? '#5a5e63' : '#666', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Theme Controls</p>

      <button className="btn btn-secondary" onClick={() => dispatch({ type: 'TOGGLE_MODE' })}>
        Mode: {state.mode}
      </button>

      <div style={{ display: 'flex', gap: '6px' }}>
        {accents.map(color => (
          <button
            key={color}
            onClick={() => dispatch({ type: 'SET_ACCENT', payload: color })}
            style={{
              width: 28, height: 28, borderRadius: '50%', background: color, border: state.accent === color ? '2px solid white' : '2px solid transparent',
              cursor: 'pointer', transition: 'transform 0.1s',
            }}
          />
        ))}
      </div>

      <input
        type="range" min="12" max="20" value={state.fontSize}
        onChange={e => dispatch({ type: 'SET_FONT_SIZE', payload: Number(e.target.value) })}
        style={{ width: '100%' }}
      />
      <span style={{ fontSize: '12px', color: state.mode === 'dark' ? '#94979a' : '#666' }}>Font: {state.fontSize}px</span>
    </div>
  );
}

function ThemePreview() {
  const { state } = useTheme();
  const bg = state.mode === 'dark' ? '#191b1f' : '#ffffff';
  const text = state.mode === 'dark' ? '#f0f0f0' : '#222';
  const secondary = state.mode === 'dark' ? '#94979a' : '#666';

  return (
    <div style={{ padding: '20px', background: bg, borderRadius: '8px', border: '1px solid rgba(128,128,128,0.2)', fontSize: `${state.fontSize}px`, color: text, transition: 'all 0.2s' }}>
      <h3 style={{ color: state.accent, marginBottom: '8px', fontSize: `${state.fontSize + 4}px` }}>Preview</h3>
      <p style={{ marginBottom: '8px' }}>This text uses the theme from Context.</p>
      <p style={{ color: secondary, fontSize: `${state.fontSize - 2}px` }}>
        Mode: {state.mode} · Accent: {state.accent} · Size: {state.fontSize}px
      </p>
      <button style={{ marginTop: '8px', padding: '6px 14px', background: state.accent, color: '#000', border: 'none', borderRadius: '6px', fontWeight: 500, cursor: 'pointer' }}>
        Themed Button
      </button>
    </div>
  );
}

function StatusBar() {
  const { state } = useTheme();
  return (
    <div style={{ padding: '8px 12px', background: state.accent, color: '#000', borderRadius: '6px', fontSize: '12px', fontWeight: 600, textAlign: 'center', transition: 'background 0.2s' }}>
      {state.mode.toUpperCase()} MODE · {state.fontSize}px · {state.accent}
    </div>
  );
}

// App que usa todos los componentes — NINGUN prop drilling
function ThemedApp() {
  return (
    <ThemeProvider>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <StatusBar />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <ThemeControls />
          <ThemePreview />
        </div>
      </div>
    </ThemeProvider>
  );
}

export default function Lesson() {
  return (
    <div className="lesson">
      <h2>2.5 — Context API</h2>
      <p className="subtitle">
        Context permite compartir datos entre componentes sin pasar props
        manualmente en cada nivel (prop drilling).
      </p>

      <h3>El Problema: Prop Drilling</h3>
      <div className="code-block">{
`// Sin Context: theme pasa por CADA nivel
<App theme={theme}>                    // Nivel 0
  <Layout theme={theme}>               // Nivel 1 (no lo usa)
    <Sidebar theme={theme}>             // Nivel 2 (no lo usa)
      <NavItem theme={theme} />         // Nivel 3 (lo usa!)
    </Sidebar>
  </Layout>
</App>

// Con Context: solo el componente que lo necesita lo consume
<ThemeProvider>
  <App>
    <Layout>
      <Sidebar>
        <NavItem />   {/* useTheme() accede directo */}
      </Sidebar>
    </Layout>
  </App>
</ThemeProvider>`
      }</div>

      <h3>Patron Completo: Context + Reducer + Hook</h3>
      <div className="code-block">{
`// 1. Crear el Context con tipo null (para error handling)
const ThemeContext = createContext<ThemeContextValue | null>(null);

// 2. Custom hook que valida que estamos dentro del Provider
function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

// 3. Provider que wrappea a los hijos
function ThemeProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(themeReducer, initialState);
  return (
    <ThemeContext.Provider value={{ state, dispatch }}>
      {children}
    </ThemeContext.Provider>
  );
}

// 4. Consumir en CUALQUIER componente hijo
function NavItem() {
  const { state } = useTheme(); // Acceso directo, sin props
  return <div style={{ color: state.accent }}>...</div>;
}`
      }</div>

      <div className="info-box warning">
        <strong>El error de null:</strong> Inicializamos el context con <code>null</code>
        y validamos en el hook. Asi, si alguien usa <code>useTheme()</code> fuera del
        Provider, obtiene un error claro en vez de <code>undefined</code> misterioso.
      </div>

      <h3>Demo Interactiva</h3>
      <p>3 componentes independientes comparten el mismo theme via Context:</p>
      <div className="demo">
        <p className="demo-label">ThemeProvider + useTheme (cero prop drilling):</p>
        <ThemedApp />
      </div>

      <div className="info-box warning">
        <strong>Pregunta del mentor:</strong> "¿Por que inicializamos el Context con null y validamos en el hook, en vez de poner un valor default?"
        <br /><br />
        <strong>Lo que deberias poder responder:</strong> Porque si ponemos un valor default funcional, el componente funcionaria FUERA del Provider sin dar error — pero con datos incorrectos o vacios. Inicializando con null y validando en useTheme(), si alguien usa el hook fuera del Provider, obtiene un error claro y explicito que dice exactamente que salio mal. Es mejor fallar rapido y claro que fallar silenciosamente con datos vacios.
      </div>

      <div className="info-box warning">
        <strong>Pregunta del mentor:</strong> "¿Cual es el problema de performance mas comun con Context y como lo evitarias?"
        <br /><br />
        <strong>Lo que deberias poder responder:</strong> Context re-renderiza TODOS los componentes que lo consumen cada vez que el valor cambia. Si pones TODO el estado de la app en un solo Context, un cambio en el tema re-renderiza componentes que solo necesitan datos del usuario. La solucion es separar en multiples contexts (ThemeContext, AuthContext, etc.) para que cada componente solo se re-renderice cuando cambia lo que le importa.
      </div>

      <div className="info-box success">
        <strong>Concepto clave:</strong> Context es ideal para datos que muchos
        componentes necesitan (theme, auth, locale). Pero NO reemplaza todas las
        props — si solo 1-2 componentes necesitan el dato, props es mejor.
        Context re-renderiza TODOS los consumidores cuando el valor cambia.
      </div>

      <div className="lesson-nav">
        <Link to="/week2/custom-hooks">← Custom Hooks</Link>
        <Link to="/week2/testing">Testing →</Link>
      </div>
    </div>
  );
}
