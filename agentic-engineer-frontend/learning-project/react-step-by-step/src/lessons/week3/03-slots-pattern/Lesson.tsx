import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

/*
  LECCION 3.3: Slots Pattern
  Pasar JSX a areas especificas de un componente
*/

// Pattern: Named Slots via Props
interface PageLayoutProps {
  sidebar: ReactNode;
  header: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
}

function PageLayout({ sidebar, header, children, footer }: PageLayoutProps) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '180px 1fr', gridTemplateRows: 'auto 1fr auto', gap: '1px', background: 'rgba(255,255,255,0.06)', borderRadius: '8px', overflow: 'hidden', height: '280px' }}>
      <div style={{ gridRow: '1 / -1', background: '#222528', padding: '12px', fontSize: '13px' }}>{sidebar}</div>
      <div style={{ background: '#2c2f33', padding: '12px', fontSize: '13px' }}>{header}</div>
      <div style={{ background: '#191b1f', padding: '16px', fontSize: '13px', overflow: 'auto' }}>{children}</div>
      {footer && <div style={{ background: '#2c2f33', padding: '8px 12px', fontSize: '12px', color: '#5a5e63' }}>{footer}</div>}
    </div>
  );
}

// Pattern: Render Props (funcion como children)
interface ListProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => ReactNode;
  renderEmpty?: () => ReactNode;
  header?: ReactNode;
}

function List<T>({ items, renderItem, renderEmpty, header }: ListProps<T>) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
      {header && <div style={{ fontSize: '12px', fontWeight: 600, color: '#5a5e63', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>{header}</div>}
      {items.length === 0
        ? (renderEmpty ? renderEmpty() : <p style={{ color: '#5a5e63', fontSize: '13px' }}>No items</p>)
        : items.map((item, i) => <div key={i}>{renderItem(item, i)}</div>)
      }
    </div>
  );
}

// Demo data
const navItems = ['Dashboard', 'Tasks', 'Team', 'Settings'];

interface Notification {
  id: number;
  text: string;
  type: 'info' | 'warning' | 'error';
}

const notifications: Notification[] = [
  { id: 1, text: 'Deploy completed', type: 'info' },
  { id: 2, text: 'Memory usage high', type: 'warning' },
  { id: 3, text: 'Build failed on main', type: 'error' },
];

const typeColors = { info: '#61dafb', warning: '#e5b454', error: '#da584b' };

export default function Lesson() {
  return (
    <div className="lesson">
      <h2>3.3 — Slots Pattern</h2>
      <p className="subtitle">
        El slots pattern permite al consumidor pasar JSX a areas especificas
        de un componente via props con nombre.
      </p>

      <h3>Named Slots via Props</h3>
      <p>
        En vez de solo <code>children</code>, defines multiples props que aceptan
        <code>ReactNode</code>. Cada una es un "slot" donde el consumidor inyecta contenido.
      </p>

      <div className="code-block">{
`interface PageLayoutProps {
  sidebar: ReactNode;    // Slot izquierdo
  header: ReactNode;     // Slot superior
  children: ReactNode;   // Contenido principal
  footer?: ReactNode;    // Slot inferior (opcional)
}

function PageLayout({ sidebar, header, children, footer }: PageLayoutProps) {
  return (
    <div className="grid">
      <aside>{sidebar}</aside>
      <header>{header}</header>
      <main>{children}</main>
      {footer && <footer>{footer}</footer>}
    </div>
  );
}

// Uso — el consumidor decide que va en cada slot:
<PageLayout
  sidebar={<Nav items={['Home', 'Tasks']} />}
  header={<h1>Dashboard</h1>}
  footer={<p>v1.0.0</p>}
>
  <DashboardContent />
</PageLayout>`
      }</div>

      <div className="demo">
        <p className="demo-label">PageLayout con 4 slots:</p>
        <PageLayout
          sidebar={
            <div>
              <p style={{ fontWeight: 600, color: '#61dafb', marginBottom: '8px' }}>Menu</p>
              {navItems.map(item => (
                <p key={item} style={{ padding: '4px 0', color: '#94979a', cursor: 'pointer' }}>{item}</p>
              ))}
            </div>
          }
          header={<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><strong>Dashboard</strong><span style={{ color: '#5a5e63' }}>user@ravn.co</span></div>}
          footer="© 2026 RAVN — Built with React"
        >
          <p style={{ color: '#94979a' }}>Main content area. Anything goes here.</p>
          <p style={{ color: '#5a5e63', marginTop: '8px' }}>Each area of this layout is a slot that the consumer controls.</p>
        </PageLayout>
      </div>

      <h3>Render Props: funciones como slots</h3>
      <p>
        A veces necesitas pasar datos AL slot. Para eso, en vez de <code>ReactNode</code>,
        usas una funcion que recibe datos y retorna JSX.
      </p>

      <div className="code-block">{
`interface ListProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => ReactNode;  // Funcion!
  renderEmpty?: () => ReactNode;
}

function List<T>({ items, renderItem, renderEmpty }: ListProps<T>) {
  if (items.length === 0) return renderEmpty?.() ?? null;
  return <>{items.map((item, i) => renderItem(item, i))}</>;
}

// Uso — el consumidor DECIDE como renderizar cada item:
<List
  items={notifications}
  renderItem={(notif) => (
    <div style={{ color: typeColors[notif.type] }}>
      {notif.text}
    </div>
  )}
  renderEmpty={() => <p>No notifications</p>}
/>`
      }</div>

      <div className="demo">
        <p className="demo-label">List generico con renderItem slot:</p>
        <List<Notification>
          items={notifications}
          header="Notifications"
          renderItem={(notif) => (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', background: '#2c2f33', borderRadius: '6px' }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: typeColors[notif.type], flexShrink: 0 }} />
              <span style={{ fontSize: '13px' }}>{notif.text}</span>
              <span style={{ fontSize: '11px', color: typeColors[notif.type], marginLeft: 'auto' }}>{notif.type}</span>
            </div>
          )}
        />
      </div>

      <h3>¿Slots vs Compound Components?</h3>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', margin: '16px 0' }}>
        <div style={{ padding: '16px', background: '#2c2f33', borderRadius: '8px' }}>
          <p style={{ fontWeight: 600, fontSize: '14px', color: '#61dafb', marginBottom: '8px' }}>Slots</p>
          <ul>
            <li>Cada slot es una prop</li>
            <li>No necesita Context</li>
            <li>Mas simple de implementar</li>
            <li>Ideal para layouts y templates</li>
          </ul>
        </div>
        <div style={{ padding: '16px', background: '#2c2f33', borderRadius: '8px' }}>
          <p style={{ fontWeight: 600, fontSize: '14px', color: '#e5b454', marginBottom: '8px' }}>Compound Components</p>
          <ul>
            <li>Estado compartido via Context</li>
            <li>Los hijos se comunican entre si</li>
            <li>Mas complejo pero mas poderoso</li>
            <li>Ideal para Tabs, Accordion, Select</li>
          </ul>
        </div>
      </div>

      <div className="info-box warning">
        <strong>Pregunta del mentor:</strong> "¿Cuando usarias slots (props ReactNode) vs children vs render props?"
        <br /><br />
        <strong>Lo que deberias poder responder:</strong> Children es para UN slot de contenido principal. Slots con nombre (sidebar, header, footer como props) son para MULTIPLES areas fijas de un layout. Render props (funciones que reciben datos) son para cuando el SLOT necesita datos del componente — por ejemplo, una lista donde cada item se renderiza diferente pero necesita el dato del item.
      </div>

      <div className="info-box success">
        <strong>Concepto clave:</strong> Slots son la forma mas simple de hacer
        componentes flexibles. Si no necesitas estado compartido, slots es suficiente.
        Si los hijos necesitan comunicarse, usa compound components.
      </div>

      <div className="lesson-nav">
        <Link to="/week3/compound-components">← Compound Components</Link>
        <Link to="/week3/suspense">Suspense →</Link>
      </div>
    </div>
  );
}
