import { Link } from 'react-router-dom';

/*
  LECCION 2.6: Testing en React
  Que testear, como testear, y por que
*/

export default function Lesson() {
  return (
    <div className="lesson">
      <h2>2.6 — Testing en React</h2>
      <p className="subtitle">
        Testing no es opcional en codigo profesional. Aprende que testear,
        como escribir tests, y las herramientas del ecosistema.
      </p>

      <h3>¿Por que testear?</h3>
      <ul>
        <li>Detectar bugs ANTES de que lleguen a produccion</li>
        <li>Documentar el comportamiento esperado del codigo</li>
        <li>Refactorizar con confianza (si los tests pasan, no rompiste nada)</li>
        <li>Es un requisito en equipos profesionales (RAVN lo exige)</li>
      </ul>

      <h3>Stack de Testing en React</h3>
      <div className="code-block">{
`// Instalar:
npm install -D vitest @testing-library/react @testing-library/jest-dom jsdom

// vitest          → Test runner (alternativa moderna a Jest)
// @testing-library/react → Renderizar componentes en tests
// @testing-library/jest-dom → Matchers como toBeInTheDocument()
// jsdom           → Simula el DOM del browser en Node.js`
      }</div>

      <h3>Anatomia de un Test</h3>
      <div className="code-block">{
`// Button.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Button } from './Button';

describe('Button', () => {
  it('renders the label', () => {
    render(<Button label="Click me" onClick={() => {}} />);

    // screen.getByText busca texto visible en el DOM
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const handleClick = vi.fn(); // mock function
    render(<Button label="Click me" onClick={handleClick} />);

    fireEvent.click(screen.getByText('Click me'));

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('is disabled when disabled prop is true', () => {
    render(<Button label="Nope" onClick={() => {}} disabled />);

    expect(screen.getByText('Nope')).toBeDisabled();
  });
});`
      }</div>

      <h3>Testing Library: Filosofia</h3>
      <div className="info-box">
        <strong>"The more your tests resemble the way your software is used,
        the more confidence they can give you."</strong> — Kent C. Dodds
        <br /><br />
        Testing Library te obliga a testear desde la perspectiva del USUARIO,
        no de la implementacion. Buscas por texto visible, labels, roles —
        no por class names, IDs internos, o estado.
      </div>

      <h3>Queries: como encontrar elementos</h3>
      <div className="code-block">{
`// Por texto visible
screen.getByText('Submit')

// Por label (accesible)
screen.getByLabelText('Email')

// Por role (semantico)
screen.getByRole('button', { name: 'Submit' })

// Por placeholder
screen.getByPlaceholderText('Search...')

// Por test ID (ultimo recurso)
screen.getByTestId('custom-element')

// Query vs Get:
// getBy  → falla si no encuentra (assert que existe)
// queryBy → retorna null si no encuentra (assert que NO existe)
// findBy  → espera async (retorna Promise)`
      }</div>

      <h3>Testing Custom Hooks</h3>
      <div className="code-block">{
`import { renderHook, act } from '@testing-library/react';
import { useCounter } from './useCounter';

describe('useCounter', () => {
  it('starts with initial value', () => {
    const { result } = renderHook(() => useCounter(5));
    expect(result.current.count).toBe(5);
  });

  it('increments', () => {
    const { result } = renderHook(() => useCounter(0));

    // act() wrappea cambios de estado
    act(() => { result.current.increment(); });

    expect(result.current.count).toBe(1);
  });

  it('respects max limit', () => {
    const { result } = renderHook(() => useCounter(9, { max: 10 }));

    act(() => { result.current.increment(); }); // 10
    act(() => { result.current.increment(); }); // todavia 10

    expect(result.current.count).toBe(10);
  });
});`
      }</div>

      <h3>¿Que testear?</h3>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', margin: '16px 0' }}>
        <div style={{ padding: '16px', background: 'rgba(112,178,82,0.06)', borderRadius: '8px', borderLeft: '3px solid #70b252' }}>
          <p style={{ fontWeight: 600, fontSize: '14px', color: '#70b252', marginBottom: '8px' }}>SI testear</p>
          <ul>
            <li>Comportamiento visible del usuario</li>
            <li>Renderizado condicional</li>
            <li>Form validation y submit</li>
            <li>Callbacks (onClick, onSubmit)</li>
            <li>Custom hooks (logica de negocio)</li>
            <li>Error states y edge cases</li>
          </ul>
        </div>
        <div style={{ padding: '16px', background: 'rgba(218,88,75,0.06)', borderRadius: '8px', borderLeft: '3px solid #da584b' }}>
          <p style={{ fontWeight: 600, fontSize: '14px', color: '#da584b', marginBottom: '8px' }}>NO testear</p>
          <ul>
            <li>Detalles de implementacion</li>
            <li>Estilos CSS (color, padding)</li>
            <li>Librerias de terceros</li>
            <li>Constantes estaticas</li>
            <li>State interno (valores de useState)</li>
            <li>Console.logs</li>
          </ul>
        </div>
      </div>

      <h3>Test de integracion: Form completo</h3>
      <div className="code-block">{
`describe('ContactForm', () => {
  it('submits with valid data', async () => {
    const onSubmit = vi.fn();
    render(<ContactForm onSubmit={onSubmit} />);

    // Simular usuario llenando el form
    await userEvent.type(screen.getByLabelText('Name'), 'John');
    await userEvent.type(screen.getByLabelText('Email'), 'john@test.com');
    await userEvent.click(screen.getByRole('button', { name: 'Submit' }));

    // Verificar que se llamo con los datos correctos
    expect(onSubmit).toHaveBeenCalledWith({
      name: 'John',
      email: 'john@test.com',
    });
  });

  it('shows error for invalid email', async () => {
    render(<ContactForm onSubmit={() => {}} />);

    await userEvent.type(screen.getByLabelText('Email'), 'invalid');
    await userEvent.click(screen.getByRole('button', { name: 'Submit' }));

    expect(screen.getByText('Please enter a valid email')).toBeInTheDocument();
  });
});`
      }</div>

      <div className="info-box warning">
        <strong>Pregunta del mentor:</strong> "¿Por que Testing Library busca elementos por texto y roles en vez de por class names o IDs?"
        <br /><br />
        <strong>Lo que deberias poder responder:</strong> Porque los usuarios no ven class names ni IDs — ven texto, botones, inputs. Si tu test busca por `.btn-primary` y un dia cambias el nombre de la clase, el test falla aunque el boton sigue funcionando perfectamente para el usuario. Si buscas por texto "Submit" o por role "button", el test solo falla si el usuario ya no puede encontrar el boton — que es lo que realmente importa.
      </div>

      <div className="info-box success">
        <strong>Concepto clave:</strong> Empieza con tests simples (renderiza? el texto
        aparece? el click funciona?). No intentes 100% coverage desde el dia 1.
        Tests que dan confianza al refactorizar valen mas que tests que verifican
        detalles de implementacion.
      </div>

      <div className="lesson-nav">
        <Link to="/week2/context">← Context API</Link>
        <Link to="/week3/composition">Composition Pattern →</Link>
      </div>
    </div>
  );
}
