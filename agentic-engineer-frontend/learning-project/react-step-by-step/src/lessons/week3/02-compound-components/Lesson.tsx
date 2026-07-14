import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

/*
  LECCION 3.2: Compound Components
  Composicion + Context = componentes que comparten estado implicitamente
*/

// Compound Component: Tabs
interface TabsContextValue {
  activeTab: string;
  setActiveTab: (id: string) => void;
}

const TabsContext = createContext<TabsContextValue | null>(null);

function useTabs() {
  const ctx = useContext(TabsContext);
  if (!ctx) throw new Error('Tab components must be used within <Tabs>');
  return ctx;
}

function Tabs({ defaultTab, children }: { defaultTab: string; children: ReactNode }) {
  const [activeTab, setActiveTab] = useState(defaultTab);
  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div>{children}</div>
    </TabsContext.Provider>
  );
}

function TabList({ children }: { children: ReactNode }) {
  return (
    <div style={{ display: 'flex', gap: '2px', background: '#2c2f33', borderRadius: '8px', padding: '3px', marginBottom: '12px' }}>
      {children}
    </div>
  );
}

function Tab({ id, children }: { id: string; children: ReactNode }) {
  const { activeTab, setActiveTab } = useTabs();
  const isActive = activeTab === id;
  return (
    <button
      onClick={() => setActiveTab(id)}
      style={{
        padding: '8px 16px', borderRadius: '6px', fontSize: '13px', fontWeight: 500,
        background: isActive ? '#393d41' : 'transparent',
        color: isActive ? '#f0f0f0' : '#94979a',
        border: 'none', cursor: 'pointer', transition: 'all 0.15s', flex: 1,
      }}
    >
      {children}
    </button>
  );
}

function TabPanel({ id, children }: { id: string; children: ReactNode }) {
  const { activeTab } = useTabs();
  if (activeTab !== id) return null;
  return <div>{children}</div>;
}

// Compound Component: Accordion
interface AccordionContextValue {
  openId: string | null;
  toggle: (id: string) => void;
}

const AccordionContext = createContext<AccordionContextValue | null>(null);

function useAccordion() {
  const ctx = useContext(AccordionContext);
  if (!ctx) throw new Error('Accordion components must be used within <Accordion>');
  return ctx;
}

function Accordion({ children }: { children: ReactNode }) {
  const [openId, setOpenId] = useState<string | null>(null);
  const toggle = (id: string) => setOpenId(prev => prev === id ? null : id);
  return (
    <AccordionContext.Provider value={{ openId, toggle }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>{children}</div>
    </AccordionContext.Provider>
  );
}

function AccordionItem({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  const { openId, toggle } = useAccordion();
  const isOpen = openId === id;
  return (
    <div style={{ background: '#2c2f33', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)', overflow: 'hidden' }}>
      <button
        onClick={() => toggle(id)}
        style={{
          width: '100%', padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          background: 'none', border: 'none', cursor: 'pointer', color: '#f0f0f0', fontSize: '14px', fontWeight: 500,
        }}
      >
        {title}
        <span style={{ transform: isOpen ? 'rotate(90deg)' : 'rotate(0)', transition: 'transform 0.2s', color: '#94979a' }}>→</span>
      </button>
      {isOpen && (
        <div style={{ padding: '0 16px 12px', fontSize: '13px', color: '#94979a', lineHeight: '1.6' }}>
          {children}
        </div>
      )}
    </div>
  );
}

export default function Lesson() {
  return (
    <div className="lesson">
      <h2>3.2 — Compound Components</h2>
      <p className="subtitle">
        Compound components son componentes que trabajan juntos compartiendo
        estado implicitamente via Context. El usuario compone las piezas
        sin pasar estado manualmente.
      </p>

      <h3>¿Que son?</h3>
      <p>
        Piensa en <code>{'<select>'}</code> y <code>{'<option>'}</code> de HTML:
        trabajan juntos, <code>{'<option>'}</code> sabe cual esta seleccionado sin que
        tu pases props. Compound components replican este patron en React.
      </p>

      <div className="code-block">{
`// API limpia para el consumidor:
<Tabs defaultTab="code">
  <TabList>
    <Tab id="code">Code</Tab>
    <Tab id="preview">Preview</Tab>
    <Tab id="tests">Tests</Tab>
  </TabList>

  <TabPanel id="code">Editor here...</TabPanel>
  <TabPanel id="preview">Preview here...</TabPanel>
  <TabPanel id="tests">Tests here...</TabPanel>
</Tabs>

// Tab y TabPanel NO reciben "activeTab" como prop.
// Lo obtienen del Context que Tabs provee.`
      }</div>

      <h3>Como funciona por dentro</h3>
      <div className="code-block">{
`// 1. Context privado
const TabsContext = createContext<TabsContextValue | null>(null);

// 2. Hook privado con validacion
function useTabs() {
  const ctx = useContext(TabsContext);
  if (!ctx) throw new Error('Must be within <Tabs>');
  return ctx;
}

// 3. Root component provee el Context
function Tabs({ defaultTab, children }) {
  const [activeTab, setActiveTab] = useState(defaultTab);
  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      {children}
    </TabsContext.Provider>
  );
}

// 4. Los hijos consumen el Context
function Tab({ id, children }) {
  const { activeTab, setActiveTab } = useTabs();
  return (
    <button
      onClick={() => setActiveTab(id)}
      className={activeTab === id ? 'active' : ''}
    >{children}</button>
  );
}

function TabPanel({ id, children }) {
  const { activeTab } = useTabs();
  if (activeTab !== id) return null;
  return <div>{children}</div>;
}`
      }</div>

      <h3>Demo: Tabs</h3>
      <div className="demo">
        <p className="demo-label">Compound Tabs component:</p>
        <Tabs defaultTab="react">
          <TabList>
            <Tab id="react">React</Tab>
            <Tab id="typescript">TypeScript</Tab>
            <Tab id="testing">Testing</Tab>
          </TabList>
          <TabPanel id="react">
            <p style={{ fontSize: '14px', color: '#94979a', lineHeight: '1.6' }}>
              React es una libreria de UI basada en componentes. Usa JSX, hooks, y un modelo de datos unidireccional para construir interfaces interactivas.
            </p>
          </TabPanel>
          <TabPanel id="typescript">
            <p style={{ fontSize: '14px', color: '#94979a', lineHeight: '1.6' }}>
              TypeScript agrega tipos estaticos a JavaScript. En React, se usa para tipar props, estado, context, y event handlers.
            </p>
          </TabPanel>
          <TabPanel id="testing">
            <p style={{ fontSize: '14px', color: '#94979a', lineHeight: '1.6' }}>
              Testing Library testea comportamiento del usuario, no implementacion. Busca elementos por texto, labels, y roles.
            </p>
          </TabPanel>
        </Tabs>
      </div>

      <h3>Demo: Accordion</h3>
      <div className="demo">
        <p className="demo-label">Compound Accordion (solo uno abierto a la vez):</p>
        <Accordion>
          <AccordionItem id="1" title="¿Que es un compound component?">
            Son componentes que comparten estado via Context sin que el consumidor tenga que pasar props entre ellos. El estado es implicito.
          </AccordionItem>
          <AccordionItem id="2" title="¿Cuando usarlos?">
            Cuando tienes un grupo de componentes que siempre trabajan juntos y necesitan compartir estado (Tabs, Accordion, Select, Menu, etc).
          </AccordionItem>
          <AccordionItem id="3" title="¿Son lo mismo que composicion?">
            Composicion es mas general (children, piezas combinables). Compound components es composicion + estado compartido via Context.
          </AccordionItem>
        </Accordion>
      </div>

      <div className="info-box warning">
        <strong>Pregunta del mentor:</strong> "¿Cual es la ventaja de que Tab y TabPanel obtengan el estado de Context en vez de recibirlo como prop?"
        <br /><br />
        <strong>Lo que deberias poder responder:</strong> El consumidor no necesita manejar el estado ni pasarlo manualmente. Con props, necesitas pasar active y onClick a cada Tab manualmente. Con compound components, solo escribes <code>{'<Tab id="code">Code</Tab>'}</code> y el Context se encarga del resto. Menos codigo, menos posibilidad de error, API mas limpia.
      </div>

      <div className="info-box success">
        <strong>Concepto clave:</strong> Compound components son el patron mas
        elegante para APIs de componentes complejos. Separan la estructura
        (el consumidor decide que renderizar) del comportamiento (el Context
        maneja el estado). Librerias como Radix UI y Headless UI usan este patron.
      </div>

      <div className="lesson-nav">
        <Link to="/week3/composition">← Composition</Link>
        <Link to="/week3/slots">Slots Pattern →</Link>
      </div>
    </div>
  );
}
