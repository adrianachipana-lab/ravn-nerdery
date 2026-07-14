import { useState } from 'react';
import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

/*
  LECCION 3.1: Composition Pattern
  La alternativa a prop drilling y componentes monoliticos
*/

// MAL: componente monolitico con muchas props
interface BadAlertProps {
  type: 'info' | 'success' | 'error';
  title: string;
  message: string;
  showIcon?: boolean;
  showClose?: boolean;
  onClose?: () => void;
  actions?: Array<{ label: string; onClick: () => void }>;
}

function BadAlert({ type, title, message, showIcon, showClose, onClose, actions }: BadAlertProps) {
  const colors = { info: '#61dafb', success: '#70b252', error: '#da584b' };
  return (
    <div style={{ padding: '16px', background: `${colors[type]}15`, borderLeft: `3px solid ${colors[type]}`, borderRadius: '0 8px 8px 0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          {showIcon && <span>{type === 'success' ? '✓' : type === 'error' ? '✕' : 'ℹ'}</span>}
          <strong style={{ fontSize: '14px' }}>{title}</strong>
        </div>
        {showClose && <button onClick={onClose} style={{ color: '#94979a', cursor: 'pointer', background: 'none', border: 'none' }}>✕</button>}
      </div>
      <p style={{ fontSize: '13px', color: '#94979a', marginTop: '4px' }}>{message}</p>
      {actions && <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>{actions.map((a, i) => <button key={i} className="btn btn-secondary" style={{ fontSize: '12px', padding: '4px 8px' }} onClick={a.onClick}>{a.label}</button>)}</div>}
    </div>
  );
}

// BIEN: composicion — cada parte es un componente separado
interface AlertRootProps { variant: 'info' | 'success' | 'error'; children: ReactNode }
function Alert({ variant, children }: AlertRootProps) {
  const colors = { info: '#61dafb', success: '#70b252', error: '#da584b' };
  return (
    <div style={{ padding: '16px', background: `${colors[variant]}15`, borderLeft: `3px solid ${colors[variant]}`, borderRadius: '0 8px 8px 0', display: 'flex', flexDirection: 'column', gap: '8px' }}>
      {children}
    </div>
  );
}

function AlertHeader({ children }: { children: ReactNode }) {
  return <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>{children}</div>;
}

function AlertTitle({ children }: { children: ReactNode }) {
  return <strong style={{ fontSize: '14px' }}>{children}</strong>;
}

function AlertBody({ children }: { children: ReactNode }) {
  return <p style={{ fontSize: '13px', color: '#94979a' }}>{children}</p>;
}

function AlertActions({ children }: { children: ReactNode }) {
  return <div style={{ display: 'flex', gap: '8px' }}>{children}</div>;
}

function AlertClose({ onClick }: { onClick: () => void }) {
  return <button onClick={onClick} style={{ color: '#94979a', cursor: 'pointer', background: 'none', border: 'none', fontSize: '16px' }}>✕</button>;
}

// Demo
function Demo() {
  const [show1, setShow1] = useState(true);
  const [show2, setShow2] = useState(true);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <p style={{ fontSize: '12px', fontWeight: 600, color: '#5a5e63', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Enfoque monolitico (muchas props):</p>
      <BadAlert type="info" title="Update Available" message="Version 2.0 is ready" showIcon showClose onClose={() => {}} actions={[{ label: 'Update', onClick: () => {} }, { label: 'Later', onClick: () => {} }]} />

      <p style={{ fontSize: '12px', fontWeight: 600, color: '#5a5e63', textTransform: 'uppercase', letterSpacing: '0.5px', marginTop: '8px' }}>Enfoque composicion (flexible):</p>
      {show1 && (
        <Alert variant="success">
          <AlertHeader>
            <AlertTitle>✓ Deploy Complete</AlertTitle>
            <AlertClose onClick={() => setShow1(false)} />
          </AlertHeader>
          <AlertBody>Your app has been deployed to production successfully.</AlertBody>
        </Alert>
      )}

      {show2 && (
        <Alert variant="error">
          <AlertHeader>
            <AlertTitle>Build Failed</AlertTitle>
            <AlertClose onClick={() => setShow2(false)} />
          </AlertHeader>
          <AlertBody>TypeScript error in src/App.tsx line 42.</AlertBody>
          <AlertActions>
            <button className="btn btn-secondary" style={{ fontSize: '12px', padding: '4px 8px' }} onClick={() => {}}>View Logs</button>
            <button className="btn btn-secondary" style={{ fontSize: '12px', padding: '4px 8px' }} onClick={() => {}}>Retry</button>
          </AlertActions>
        </Alert>
      )}

      {(!show1 || !show2) && (
        <button className="btn btn-secondary" onClick={() => { setShow1(true); setShow2(true); }}>
          Reset alerts
        </button>
      )}
    </div>
  );
}

export default function Lesson() {
  return (
    <div className="lesson">
      <h2>3.1 — Composition Pattern</h2>
      <p className="subtitle">
        En vez de componentes con 20 props, compone piezas pequenas.
        El consumidor decide que incluir y como.
      </p>

      <h3>El Problema: Prop Explosion</h3>
      <div className="code-block">{
`// Esto crece sin control:
<Alert
  type="error"
  title="Build Failed"
  message="Error in line 42"
  showIcon={true}
  showClose={true}
  onClose={handleClose}
  actions={[
    { label: 'Retry', onClick: retry },
    { label: 'View Logs', onClick: viewLogs },
  ]}
  actionAlignment="right"  // ¿y si necesitas esto?
  dismissAfter={5000}       // ¿y esto?
  customIcon={<ErrorIcon />} // ¿y esto?
  // ... cada feature nueva = prop nueva
/>`
      }</div>

      <h3>La Solucion: Composicion</h3>
      <div className="code-block">{
`// El consumidor compone exactamente lo que necesita:
<Alert variant="error">
  <AlertHeader>
    <AlertTitle>Build Failed</AlertTitle>
    <AlertClose onClick={handleClose} />
  </AlertHeader>
  <AlertBody>Error in src/App.tsx line 42</AlertBody>
  <AlertActions>
    <Button onClick={retry}>Retry</Button>
    <Button onClick={viewLogs}>View Logs</Button>
  </AlertActions>
</Alert>

// ¿Solo necesitas titulo y mensaje? Sin close ni actions:
<Alert variant="info">
  <AlertTitle>Tip of the day</AlertTitle>
  <AlertBody>Use Cmd+K to open the command palette.</AlertBody>
</Alert>

// Cada componente es simple, tiene pocas props, y se puede
// combinar de formas que el creador original no anticipo.`
      }</div>

      <div className="info-box">
        <strong>Inversion of Control:</strong> Con composicion, el CONSUMIDOR del
        componente tiene el control de que se renderiza. Con props, el CREADOR
        tiene que anticipar cada caso de uso. Composicion escala mejor.
      </div>

      <h3>Demo Interactiva</h3>
      <div className="demo">
        <p className="demo-label">Monolitico vs Composicion:</p>
        <Demo />
      </div>

      <div className="info-box warning">
        <strong>Pregunta del mentor:</strong> "¿Cual es la regla para decidir entre un componente con muchas props vs composicion?"
        <br /><br />
        <strong>Lo que deberias poder responder:</strong> Si el componente tiene mas de 5-7 props, o si las props son condicionales (showIcon, showClose, showActions), probablemente necesita composicion. Cada boolean prop duplica las variaciones posibles. Con 3 booleans tienes 8 combinaciones. Con composicion, el consumidor decide exactamente que incluir sin que el componente necesite anticipar todas las combinaciones.
      </div>

      <div className="info-box success">
        <strong>Concepto clave:</strong> Prefiere composicion sobre configuracion.
        En vez de agregar props para cada variacion, deja que el consumidor componga
        las piezas. Esto hace que tus componentes sean mas simples, mas flexibles,
        y mas faciles de mantener.
      </div>

      <div className="lesson-nav">
        <Link to="/week2/testing">← Testing</Link>
        <Link to="/week3/compound-components">Compound Components →</Link>
      </div>
    </div>
  );
}
