import { useState, useOptimistic, useTransition, Suspense, use } from 'react';
import { Link } from 'react-router-dom';

/*
  LECCION 3.8: React 19 — Lo nuevo
  Features que el programa original no cubre
*/

// Demo: useOptimistic — actualizar la UI ANTES de que el server responda
interface Message { id: number; text: string; sending?: boolean }

function OptimisticDemo() {
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: 'Hello!' },
    { id: 2, text: 'How are you?' },
  ]);

  const [optimisticMessages, addOptimistic] = useOptimistic(
    messages,
    (state: Message[], newMsg: string) => [...state, { id: Date.now(), text: newMsg, sending: true }],
  );

  const [input, setInput] = useState('');

  const sendMessage = () => {
    if (!input.trim()) return;
    const text = input;
    setInput('');

    // Muestra el mensaje inmediatamente (optimistic)
    addOptimistic(text);

    // Simula enviar al server (1.5 segundos)
    setTimeout(() => {
      setMessages(prev => [...prev, { id: Date.now(), text }]);
    }, 1500);
  };

  return (
    <div>
      <div style={{ maxHeight: '160px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '8px' }}>
        {optimisticMessages.map(msg => (
          <div key={msg.id} style={{
            padding: '6px 12px', borderRadius: '6px', fontSize: '13px', alignSelf: 'flex-end', maxWidth: '70%',
            background: msg.sending ? '#393d41' : '#1a3a5c',
            color: msg.sending ? '#94979a' : '#61dafb',
            opacity: msg.sending ? 0.7 : 1,
          }}>
            {msg.text}
            {msg.sending && <span style={{ fontSize: '10px', marginLeft: '8px' }}>sending...</span>}
          </div>
        ))}
      </div>
      <form onSubmit={(e) => { e.preventDefault(); sendMessage(); }} style={{ display: 'flex', gap: '8px' }}>
        <input className="input" value={input} onChange={e => setInput(e.target.value)} placeholder="Type a message..." style={{ flex: 1 }} />
        <button className="btn btn-primary" type="submit">Send</button>
      </form>
    </div>
  );
}

// Demo: useTransition — marcar actualizaciones como no urgentes
function TransitionDemo() {
  const [tab, setTab] = useState('home');
  const [isPending, startTransition] = useTransition();

  const handleTabChange = (newTab: string) => {
    startTransition(() => {
      setTab(newTab);
    });
  };

  return (
    <div>
      <div style={{ display: 'flex', gap: '2px', background: '#2c2f33', borderRadius: '8px', padding: '3px', marginBottom: '12px' }}>
        {['home', 'posts', 'about'].map(t => (
          <button key={t} onClick={() => handleTabChange(t)} style={{
            padding: '8px 16px', borderRadius: '6px', fontSize: '13px', fontWeight: 500, flex: 1, border: 'none', cursor: 'pointer',
            background: tab === t ? '#393d41' : 'transparent',
            color: tab === t ? '#f0f0f0' : '#94979a',
          }}>{t}</button>
        ))}
      </div>
      <div style={{ opacity: isPending ? 0.5 : 1, transition: 'opacity 0.15s', padding: '12px', background: '#2c2f33', borderRadius: '8px', fontSize: '14px', color: '#94979a' }}>
        {tab === 'home' && <p>Welcome to the home tab. This is the main content area.</p>}
        {tab === 'posts' && <p>Here are your posts. This tab simulates heavy content loading.</p>}
        {tab === 'about' && <p>About page with information. Transitions keep the UI responsive.</p>}
      </div>
    </div>
  );
}

// Demo: use() hook — leer promises en render
const profileCache = new Map<string, Promise<{ login: string; avatar_url: string }>>();
function getProfile(username: string) {
  if (!profileCache.has(username)) {
    profileCache.set(username, fetch(`https://api.github.com/users/${username}`).then(r => r.json()));
  }
  return profileCache.get(username)!;
}

function ProfileCard({ username }: { username: string }) {
  const profile = use(getProfile(username));
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px', background: '#2c2f33', borderRadius: '8px' }}>
      <img src={profile.avatar_url} alt={profile.login} style={{ width: 36, height: 36, borderRadius: '50%' }} />
      <span style={{ fontSize: '14px', fontWeight: 500 }}>{profile.login}</span>
    </div>
  );
}

function UseHookDemo() {
  const [user, setUser] = useState('octocat');
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <div style={{ display: 'flex', gap: '4px' }}>
        {['octocat', 'torvalds', 'gaearon'].map(u => (
          <button key={u} className={`btn ${user === u ? 'btn-primary' : 'btn-secondary'}`} style={{ fontSize: '12px', padding: '4px 12px' }}
            onClick={() => { profileCache.delete(u); setUser(u); }}>{u}</button>
        ))}
      </div>
      <Suspense fallback={<div style={{ padding: '10px', fontSize: '13px', color: '#94979a' }}>Loading profile...</div>}>
        <ProfileCard username={user} />
      </Suspense>
    </div>
  );
}

export default function Lesson() {
  return (
    <div className="lesson">
      <h2>3.8 — React 19: Lo Nuevo</h2>
      <p className="subtitle">
        React 19 trajo features que cambian como escribimos apps.
        El programa original no las cubre — pero en produccion ya se usan.
      </p>

      <h3>use() — leer Promises directamente</h3>
      <p>
        Antes de React 19, para leer datos async necesitabas useEffect + useState.
        Ahora, <code>use()</code> puede leer una Promise directamente en el render.
        Si la Promise no se resolvio, React "suspende" y muestra el fallback de Suspense.
      </p>

      <div className="code-block">{
`// ANTES (React 18): useEffect + useState manual
function Profile({ userId }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetchUser(userId).then(setUser).finally(() => setLoading(false));
  }, [userId]);
  if (loading) return <Spinner />;
  return <p>{user.name}</p>;
}

// AHORA (React 19): use() + Suspense
function Profile({ userId }) {
  const user = use(fetchUser(userId)); // Lee la Promise directamente
  return <p>{user.name}</p>; // Solo el happy path
}
// El loading lo maneja Suspense arriba en el arbol`
      }</div>

      <div className="demo">
        <p className="demo-label">use() + Suspense — clickea para cambiar usuario:</p>
        <UseHookDemo />
      </div>

      <h3>useOptimistic — UI optimista</h3>
      <p>
        Cuando mandas un mensaje en WhatsApp, aparece INMEDIATAMENTE en el chat
        (con un relojito) antes de que el server confirme que lo recibio.
        Eso es <strong>optimistic UI</strong>. <code>useOptimistic</code> lo hace facil.
      </p>

      <div className="code-block">{
`const [optimisticMessages, addOptimistic] = useOptimistic(
  messages,  // Estado real (del server)
  (state, newMsg) => [...state, { text: newMsg, sending: true }]
  // Funcion que calcula el estado optimista
);

// Al enviar:
addOptimistic('Hello!');  // Aparece inmediato con "sending..."
await sendToServer('Hello!');  // Cuando el server responde,
setMessages(serverMessages);   // el estado real reemplaza al optimista`
      }</div>

      <div className="demo">
        <p className="demo-label">Envia un mensaje — aparece inmediato (optimistic), luego confirma:</p>
        <OptimisticDemo />
      </div>

      <h3>useTransition — actualizaciones no urgentes</h3>
      <p>
        Algunas actualizaciones son urgentes (un input que el usuario escribe)
        y otras no (filtrar una lista grande). <code>useTransition</code> le dice
        a React: "esta actualizacion puede esperar si hay algo mas urgente".
      </p>

      <div className="code-block">{
`const [isPending, startTransition] = useTransition();

// Cambiar de tab no es urgente — puede esperar
const handleTabChange = (newTab) => {
  startTransition(() => {
    setTab(newTab);  // React puede interrumpir esto si hay algo urgente
  });
};

// isPending es true mientras la transicion esta en curso
<div style={{ opacity: isPending ? 0.5 : 1 }}>
  {/* El contenido se atenua mientras cambia */}
</div>`
      }</div>

      <div className="demo">
        <p className="demo-label">useTransition — cambia de tab (nota la opacidad durante el cambio):</p>
        <TransitionDemo />
      </div>

      <div className="info-box warning">
        <strong>Pregunta del mentor:</strong> "¿Cual es la diferencia entre useTransition
        y useDeferredValue? ¿Cuando usas cada uno?"
        <br /><br />
        <strong>Lo que deberias poder responder:</strong> <code>useTransition</code> envuelve
        una ACCION (setState) y la marca como no urgente — TU controlas cuando se dispara.
        <code>useDeferredValue</code> envuelve un VALOR y lo retrasa automaticamente cuando
        React esta ocupado. Uso useTransition para acciones del usuario (click tab, submit form).
        Uso useDeferredValue para valores que cambian rapidamente (texto de input que filtra una lista).
      </div>

      <div className="info-box success">
        <strong>Para el code review:</strong> Saber React 19 features te pone adelante.
        La mayoria de trainees no conocen use(), useOptimistic, ni useTransition.
        Si los usas en tu challenge, demuestras que vas mas alla del programa.
      </div>

      <div className="lesson-nav">
        <Link to="/week3/tooling">← Tooling</Link>
        <Link to="/">Inicio →</Link>
      </div>
    </div>
  );
}
