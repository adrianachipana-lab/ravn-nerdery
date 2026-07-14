import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';

/*
  LECCION 2.8: Accesibilidad (a11y)
  Hacer que tu app funcione para TODOS los usuarios
*/

// Demo: boton inaccesible vs accesible
function BadButton() {
  return (
    <div onClick={() => alert('clicked')} style={{ padding: '8px 16px', background: '#61dafb', color: '#000', borderRadius: '6px', cursor: 'pointer', display: 'inline-block', fontSize: '14px' }}>
      Click me (div)
    </div>
  );
}

function GoodButton() {
  return (
    <button onClick={() => alert('clicked')} className="btn btn-primary">
      Click me (button)
    </button>
  );
}

// Demo: focus trap en modal
function FocusTrapDemo() {
  const [open, setOpen] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (open) closeRef.current?.focus();
  }, [open]);

  return (
    <div>
      <button className="btn btn-primary" onClick={() => setOpen(true)}>Open accessible modal</button>
      {open && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}
          role="dialog" aria-modal="true" aria-label="Example dialog"
          onKeyDown={(e) => { if (e.key === 'Escape') setOpen(false); }}
        >
          <div style={{ background: '#222528', borderRadius: '12px', padding: '24px', maxWidth: '360px', width: '90%' }}>
            <h3 style={{ fontSize: '16px', marginBottom: '8px' }}>Accessible Modal</h3>
            <p style={{ fontSize: '13px', color: '#94979a', marginBottom: '16px' }}>
              Press <kbd style={{ background: '#393d41', padding: '2px 6px', borderRadius: '4px', fontSize: '12px' }}>Escape</kbd> to close.
              Press <kbd style={{ background: '#393d41', padding: '2px 6px', borderRadius: '4px', fontSize: '12px' }}>Tab</kbd> to move between buttons.
            </p>
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
              <button ref={closeRef} className="btn btn-secondary" onClick={() => setOpen(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={() => setOpen(false)}>Confirm</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Demo: color contrast
function ContrastDemo() {
  return (
    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
      <div style={{ padding: '12px 16px', background: '#222', borderRadius: '6px' }}>
        <p style={{ color: '#444', fontSize: '14px' }}>Bad contrast (2.1:1)</p>
      </div>
      <div style={{ padding: '12px 16px', background: '#222', borderRadius: '6px' }}>
        <p style={{ color: '#999', fontSize: '14px' }}>OK contrast (4.5:1)</p>
      </div>
      <div style={{ padding: '12px 16px', background: '#222', borderRadius: '6px' }}>
        <p style={{ color: '#eee', fontSize: '14px' }}>Good contrast (13:1)</p>
      </div>
    </div>
  );
}

export default function Lesson() {
  return (
    <div className="lesson">
      <h2>2.8 — Accesibilidad (a11y)</h2>
      <p className="subtitle">
        Accesibilidad significa que tu app funciona para TODAS las personas,
        incluyendo las que usan teclado, screen readers, o tienen vision reducida.
        En USA/Europa es requisito legal (ADA, WCAG).
      </p>

      <h3>¿Por que importa?</h3>
      <p>
        El 15% de la poblacion mundial tiene alguna discapacidad. Pero accesibilidad
        no es solo para personas con discapacidad — tambien beneficia a usuarios que:
      </p>
      <ul>
        <li>Navegan con teclado (power users, devs)</li>
        <li>Usan la app en el celular con una mano</li>
        <li>Estan en un lugar con mucha luz y no ven bien la pantalla</li>
        <li>Tienen internet lento y las imagenes no cargan</li>
      </ul>

      <h3>Regla 1: Usa los elementos HTML correctos</h3>
      <p>
        Un <code>{'<div>'}</code> con onClick NO es un boton. No se puede activar con
        teclado, los screen readers no lo anuncian como boton, y no tiene focus visible.
      </p>

      <div className="demo">
        <p className="demo-label">Intenta navegar con Tab entre estos dos:</p>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <BadButton />
          <span style={{ color: '#5a5e63', fontSize: '12px' }}>← no puedes llegar con Tab</span>
        </div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginTop: '8px' }}>
          <GoodButton />
          <span style={{ color: '#5a5e63', fontSize: '12px' }}>← puedes llegar con Tab y activar con Enter</span>
        </div>
      </div>

      <div className="code-block">{
`// MAL — div disfrazado de boton
<div onClick={handleClick} className="button">Click</div>
// No tiene focus, no responde a Enter/Space, screen reader lo ignora

// BIEN — boton real
<button onClick={handleClick}>Click</button>
// Focus automatico, Enter/Space lo activan, screen reader dice "boton"

// Otros elementos semanticos que DEBES usar:
<nav>       en vez de  <div className="nav">
<header>    en vez de  <div className="header">
<main>      en vez de  <div className="content">
<aside>     en vez de  <div className="sidebar">
<article>   en vez de  <div className="card">
<form>      en vez de  <div className="form">`
      }</div>

      <h3>Regla 2: Labels en todos los inputs</h3>
      <div className="code-block">{
`// MAL — input sin label
<input placeholder="Email" />
// El screen reader dice "input" pero no sabe PARA QUE es

// BIEN — label conectada con htmlFor
<label htmlFor="email">Email</label>
<input id="email" type="email" />
// El screen reader dice "Email, input de texto"
// Ademas, clickear el label enfoca el input (UX bonus)

// Si no quieres label visible, usa aria-label:
<input aria-label="Search tasks" placeholder="Search..." />
// El screen reader anuncia "Search tasks"`
      }</div>

      <h3>Regla 3: aria-* para componentes custom</h3>
      <div className="code-block">{
`// Modal
<div role="dialog" aria-modal="true" aria-label="Create Task">

// Menu desplegable
<button aria-expanded={isOpen} aria-haspopup="true">
  Options
</button>

// Toast / notificaciones
<div aria-live="polite">
  {/* Screen reader anuncia cambios automaticamente */}
</div>

// Tabs
<div role="tablist">
  <button role="tab" aria-selected={isActive}>Tab 1</button>
</div>
<div role="tabpanel">Content</div>`
      }</div>

      <h3>Regla 4: Manejo de focus</h3>
      <p>
        Cuando abres un modal, el focus debe moverse DENTRO del modal.
        Cuando lo cierras, debe volver al boton que lo abrio.
      </p>

      <div className="demo">
        <p className="demo-label">Modal con focus management (usa Tab y Escape):</p>
        <FocusTrapDemo />
      </div>

      <h3>Regla 5: Color contrast</h3>
      <p>
        El texto debe tener suficiente contraste con el fondo. WCAG requiere
        un ratio minimo de <strong>4.5:1</strong> para texto normal y <strong>3:1</strong> para texto grande.
      </p>

      <div className="demo">
        <p className="demo-label">Comparacion de contraste:</p>
        <ContrastDemo />
      </div>

      <div className="info-box warning">
        <strong>Pregunta del mentor:</strong> "¿Como verificarias la accesibilidad de tu app?"
        <br /><br />
        <strong>Lo que deberias poder responder:</strong> (1) Navego TODA la app solo con
        teclado (Tab, Enter, Escape) — si no puedo hacer algo, hay un problema.
        (2) Instalo la extension <strong>axe DevTools</strong> en Chrome — escanea la pagina
        y reporta problemas de accesibilidad. (3) Activo VoiceOver (Mac) o NVDA (Windows)
        y escucho como suena mi app. (4) Verifico contraste con Chrome DevTools (inspect
        element, mira el ratio de contraste). (5) Paso el Lighthouse accessibility audit.
      </div>

      <div className="info-box success">
        <strong>Para el code review:</strong> Un reviewer va a buscar: semantic HTML (no
        divs para todo), labels en inputs, aria-label en icon buttons, role="dialog"
        en modales, manejo de focus, y contraste adecuado. Clientes de USA/Europa lo
        requieren legalmente (ADA compliance).
      </div>

      <div className="lesson-nav">
        <Link to="/week2/react-query">← Data Fetching</Link>
        <Link to="/week3/composition">Composition →</Link>
      </div>
    </div>
  );
}
