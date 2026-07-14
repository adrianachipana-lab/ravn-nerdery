import { useState } from 'react';
import { Link } from 'react-router-dom';

/*
  LECCION 4: Forms
  Formularios controlados, validacion, y accesibilidad
*/

function ContactForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // Evita que el browser recargue la pagina
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  const isValid = name.trim() !== '' && email.includes('@') && message.trim() !== '';

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <div>
        <label htmlFor="name" style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#5a5e63', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>
          Name
        </label>
        <input
          id="name"
          className="input"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name"
        />
      </div>

      <div>
        <label htmlFor="email" style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#5a5e63', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>
          Email
        </label>
        <input
          id="email"
          className="input"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
        />
        {email && !email.includes('@') && (
          <p style={{ color: '#da584b', fontSize: '12px', marginTop: '4px' }}>
            Please enter a valid email
          </p>
        )}
      </div>

      <div>
        <label htmlFor="msg" style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#5a5e63', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>
          Message
        </label>
        <textarea
          id="msg"
          className="input"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Write something..."
          rows={3}
          style={{ resize: 'vertical' }}
        />
      </div>

      <button className="btn btn-primary" type="submit" disabled={!isValid} style={{ opacity: isValid ? 1 : 0.5, alignSelf: 'flex-start' }}>
        Send Message
      </button>

      {submitted && (
        <p style={{ color: '#70b252', fontSize: '14px' }}>
          Sent! Name: {name}, Email: {email}
        </p>
      )}
    </form>
  );
}

export default function Lesson() {
  return (
    <div className="lesson">
      <h2>1.4 — Forms</h2>
      <p className="subtitle">
        En React, los formularios son "controlados": React es la fuente de verdad
        del valor de cada input, no el DOM.
      </p>

      <h3>Controlled vs Uncontrolled</h3>
      <p>
        En HTML vanilla, el browser maneja el valor del input. En React, nosotros
        controlamos el valor via estado. Esto se llama <strong>controlled component</strong>.
      </p>

      <div className="code-block">{
`// CONTROLLED: React controla el valor
const [name, setName] = useState('');

<input
  value={name}                          // React dice que mostrar
  onChange={(e) => setName(e.target.value)}  // Actualiza en cada keystroke
/>

// El flujo es:
// 1. Usuario escribe "A"
// 2. onChange se dispara con e.target.value = "A"
// 3. setName("A") actualiza el estado
// 4. React re-renderiza, input muestra "A"`
      }</div>

      <h3>preventDefault en submit</h3>
      <p>
        Por default, un <code>{'<form>'}</code> recarga la pagina al hacer submit.
        En una SPA no queremos eso. Usamos <code>e.preventDefault()</code> para
        manejar el submit con JavaScript.
      </p>

      <div className="code-block">{
`const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();  // ← Esto evita la recarga
  // Aqui mandas los datos a la API, etc.
  console.log({ name, email, message });
};

<form onSubmit={handleSubmit}>
  {/* ...inputs... */}
  <button type="submit">Send</button>
</form>`
      }</div>

      <h3>Accesibilidad: label + htmlFor</h3>
      <p>
        Siempre conecta cada <code>{'<label>'}</code> con su input usando <code>htmlFor</code>
        (equivalente a <code>for</code> en HTML). Esto permite clickear el label para
        enfocar el input, y los screen readers lo leen correctamente.
      </p>

      <div className="code-block">{
`// htmlFor del label debe matchear el id del input
<label htmlFor="email">Email</label>
<input id="email" type="email" value={email} onChange={...} />`
      }</div>

      <h3>Validacion inline</h3>
      <p>
        Puedes validar en tiempo real mostrando mensajes de error condicionalmente.
        Tambien puedes deshabilitar el boton si el form no es valido.
      </p>

      <div className="code-block">{
`// Validacion simple
const isValid = name.trim() !== '' && email.includes('@');

// Mostrar error inline
{email && !email.includes('@') && (
  <p className="error">Please enter a valid email</p>
)}

// Deshabilitar boton
<button type="submit" disabled={!isValid}>Send</button>`
      }</div>

      <h3>Demo Interactiva</h3>
      <p>Llena el formulario. El boton se habilita cuando todo es valido:</p>

      <div className="demo">
        <p className="demo-label">Formulario controlado con validacion:</p>
        <ContactForm />
      </div>

      <div className="info-box warning">
        <strong>Pregunta del mentor:</strong> "¿Por que React usa controlled components en vez de dejar que el DOM maneje el valor del input como en HTML vanilla?"
        <br /><br />
        <strong>Respuesta esperada:</strong> Porque React necesita ser la "fuente unica de verdad" (single source of truth). Si el DOM maneja el valor, React no sabe que hay en el input hasta que lo lee del DOM. Con controlled components, React SIEMPRE sabe el valor actual porque esta en el estado. Esto hace que validacion, formateo, y submit sean predecibles. Ademas permite features como "undo" o "reset" facilmente — solo seteas el estado al valor anterior.
      </div>

      <div className="info-box success">
        <strong>Concepto clave:</strong> Los controlled inputs hacen que React sea la
        "fuente unica de verdad" (single source of truth) del formulario. Esto facilita
        validacion, formateo, y submit — porque siempre sabes exactamente que datos tiene el form.
      </div>

      <div className="info-box warning">
        <strong>Pregunta del mentor:</strong> "¿Cuando usarias un uncontrolled component (useRef) en vez de controlled (useState)?"
        <br /><br />
        <strong>Respuesta esperada:</strong> Cuando el valor del input no necesita causar re-renders — por ejemplo, un campo de upload de archivo, o un input cuyo valor solo necesitas al momento del submit (no en cada keystroke). En ese caso, useRef es mas performante porque no re-renderiza en cada tecla. Pero para la mayoria de formularios, controlled es preferible porque te da mas control.
      </div>

      <div className="lesson-nav">
        <Link to="/week1/rendering-lists">← Rendering Lists</Link>
        <Link to="/week1/useState">useState →</Link>
      </div>
    </div>
  );
}
