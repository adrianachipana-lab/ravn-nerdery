import { useReducer } from 'react';
import { Link } from 'react-router-dom';

/*
  LECCION 2.3: useReducer
  Para estado complejo con multiples acciones
*/

// Ejemplo: Shopping cart con useReducer
interface CartItem {
  id: number;
  name: string;
  price: number;
  qty: number;
}

interface CartState {
  items: CartItem[];
  discount: number;
}

// Union type de todas las acciones posibles
type CartAction =
  | { type: 'ADD_ITEM'; payload: { id: number; name: string; price: number } }
  | { type: 'REMOVE_ITEM'; payload: { id: number } }
  | { type: 'UPDATE_QTY'; payload: { id: number; qty: number } }
  | { type: 'APPLY_DISCOUNT'; payload: { percent: number } }
  | { type: 'CLEAR_CART' };

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existing = state.items.find(i => i.id === action.payload.id);
      if (existing) {
        return { ...state, items: state.items.map(i => i.id === action.payload.id ? { ...i, qty: i.qty + 1 } : i) };
      }
      return { ...state, items: [...state.items, { ...action.payload, qty: 1 }] };
    }
    case 'REMOVE_ITEM':
      return { ...state, items: state.items.filter(i => i.id !== action.payload.id) };
    case 'UPDATE_QTY':
      return { ...state, items: state.items.map(i => i.id === action.payload.id ? { ...i, qty: Math.max(0, action.payload.qty) } : i).filter(i => i.qty > 0) };
    case 'APPLY_DISCOUNT':
      return { ...state, discount: action.payload.percent };
    case 'CLEAR_CART':
      return { items: [], discount: 0 };
  }
}

const PRODUCTS = [
  { id: 1, name: 'React Course', price: 49 },
  { id: 2, name: 'TypeScript Book', price: 29 },
  { id: 3, name: 'Vite License', price: 19 },
  { id: 4, name: 'Testing Suite', price: 39 },
];

function ShoppingCart() {
  const [cart, dispatch] = useReducer(cartReducer, { items: [], discount: 0 });

  const subtotal = cart.items.reduce((sum, i) => sum + i.price * i.qty, 0);
  const discountAmount = subtotal * (cart.discount / 100);
  const total = subtotal - discountAmount;

  return (
    <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
      {/* Products */}
      <div style={{ flex: 1, minWidth: '200px' }}>
        <p style={{ fontSize: '12px', fontWeight: 600, color: '#5a5e63', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>Products</p>
        {PRODUCTS.map(p => (
          <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', background: '#2c2f33', borderRadius: '6px', marginBottom: '4px', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div>
              <span style={{ fontSize: '14px' }}>{p.name}</span>
              <span style={{ fontSize: '12px', color: '#70b252', marginLeft: '8px' }}>${p.price}</span>
            </div>
            <button className="btn btn-primary" style={{ padding: '4px 12px', fontSize: '12px' }} onClick={() => dispatch({ type: 'ADD_ITEM', payload: p })}>Add</button>
          </div>
        ))}
        <div style={{ marginTop: '8px', display: 'flex', gap: '4px' }}>
          <button className="btn btn-secondary" style={{ fontSize: '12px', padding: '4px 8px' }} onClick={() => dispatch({ type: 'APPLY_DISCOUNT', payload: { percent: 10 } })}>10% off</button>
          <button className="btn btn-secondary" style={{ fontSize: '12px', padding: '4px 8px' }} onClick={() => dispatch({ type: 'APPLY_DISCOUNT', payload: { percent: 25 } })}>25% off</button>
          <button className="btn btn-secondary" style={{ fontSize: '12px', padding: '4px 8px' }} onClick={() => dispatch({ type: 'CLEAR_CART' })}>Clear</button>
        </div>
      </div>

      {/* Cart */}
      <div style={{ flex: 1, minWidth: '200px' }}>
        <p style={{ fontSize: '12px', fontWeight: 600, color: '#5a5e63', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>Cart ({cart.items.length})</p>
        {cart.items.length === 0 ? (
          <p style={{ color: '#5a5e63', fontSize: '13px' }}>Empty cart</p>
        ) : (
          <>
            {cart.items.map(item => (
              <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', background: '#222528', borderRadius: '6px', marginBottom: '4px' }}>
                <span style={{ fontSize: '13px' }}>{item.name} × {item.qty}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontSize: '13px', color: '#61dafb' }}>${item.price * item.qty}</span>
                  <button style={{ fontSize: '12px', color: '#94979a', cursor: 'pointer', background: 'none', border: 'none' }} onClick={() => dispatch({ type: 'UPDATE_QTY', payload: { id: item.id, qty: item.qty - 1 } })}>−</button>
                  <button style={{ fontSize: '12px', color: '#94979a', cursor: 'pointer', background: 'none', border: 'none' }} onClick={() => dispatch({ type: 'UPDATE_QTY', payload: { id: item.id, qty: item.qty + 1 } })}>+</button>
                  <button style={{ fontSize: '12px', color: '#da584b', cursor: 'pointer', background: 'none', border: 'none' }} onClick={() => dispatch({ type: 'REMOVE_ITEM', payload: { id: item.id } })}>✕</button>
                </div>
              </div>
            ))}
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '8px', marginTop: '8px', fontSize: '13px', color: '#94979a' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Subtotal</span><span>${subtotal.toFixed(2)}</span>
              </div>
              {cart.discount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#70b252' }}>
                  <span>Discount ({cart.discount}%)</span><span>-${discountAmount.toFixed(2)}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: '15px', color: '#f0f0f0', marginTop: '4px' }}>
                <span>Total</span><span>${total.toFixed(2)}</span>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function Lesson() {
  return (
    <div className="lesson">
      <h2>2.3 — useReducer</h2>
      <p className="subtitle">
        Cuando el estado tiene multiples acciones o transiciones complejas,
        <code>useReducer</code> es mas claro que multiples <code>useState</code>.
      </p>

      <h3>¿Cuando usar useReducer vs useState?</h3>
      <ul>
        <li><strong>useState</strong>: estado simple (boolean, string, number)</li>
        <li><strong>useReducer</strong>: estado con multiples acciones (add, remove, update, clear)</li>
        <li><strong>useReducer</strong>: cuando el proximo estado depende del anterior</li>
        <li><strong>useReducer</strong>: cuando hay logica de negocio compleja</li>
      </ul>

      <h3>Anatomia de un Reducer</h3>
      <div className="code-block">{
`// 1. Definir el estado
interface CartState {
  items: CartItem[];
  discount: number;
}

// 2. Definir las acciones como union type
type CartAction =
  | { type: 'ADD_ITEM'; payload: { id: number; name: string; price: number } }
  | { type: 'REMOVE_ITEM'; payload: { id: number } }
  | { type: 'CLEAR_CART' };

// 3. Crear el reducer (funcion pura: state + action = nuevo state)
function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM':
      return { ...state, items: [...state.items, action.payload] };
    case 'REMOVE_ITEM':
      return { ...state, items: state.items.filter(i => i.id !== action.payload.id) };
    case 'CLEAR_CART':
      return { items: [], discount: 0 };
  }
}

// 4. Usar en el componente
const [cart, dispatch] = useReducer(cartReducer, { items: [], discount: 0 });

// dispatch envia acciones al reducer
dispatch({ type: 'ADD_ITEM', payload: { id: 1, name: 'Book', price: 29 } });
dispatch({ type: 'CLEAR_CART' });`
      }</div>

      <div className="info-box">
        <strong>TypeScript magic:</strong> Porque las acciones son un union type,
        TypeScript sabe exactamente que <code>payload</code> tiene cada accion.
        Dentro del <code>case 'ADD_ITEM'</code>, <code>action.payload</code> tiene
        <code>name</code> y <code>price</code>. En <code>'REMOVE_ITEM'</code>, solo
        tiene <code>id</code>. Esto se llama <strong>discriminated union</strong>.
      </div>

      <h3>Demo Interactiva</h3>
      <div className="demo">
        <p className="demo-label">Shopping Cart con useReducer:</p>
        <ShoppingCart />
      </div>

      <div className="info-box warning">
        <strong>Pregunta del mentor:</strong> "¿Por que un reducer es una funcion pura y por que eso importa?"
        <br /><br />
        <strong>Lo que deberias poder responder:</strong> Una funcion pura siempre retorna el mismo resultado dados los mismos inputs, y no tiene efectos secundarios (no hace API calls, no modifica variables externas). Esto importa porque: (1) Es predecible — si paso el mismo estado y la misma accion, siempre obtengo el mismo resultado. (2) Es testeable — no necesito mockear nada externo. (3) Es debuggeable — puedo "replaying" acciones para reproducir bugs. (4) React depende de esto para saber cuando re-renderizar.
      </div>

      <div className="info-box warning">
        <strong>Pregunta del mentor:</strong> "¿Que es un discriminated union y por que las acciones del reducer lo usan?"
        <br /><br />
        <strong>Lo que deberias poder responder:</strong> Es un union type donde cada miembro tiene una propiedad comun (como "type") con un valor literal diferente. Cuando haces switch(action.type), TypeScript sabe EXACTAMENTE que propiedades tiene el payload en cada caso. Si el type es 'ADD_ITEM', sabe que payload tiene name y price. Si es 'REMOVE_ITEM', sabe que payload solo tiene id. Esto previene bugs como acceder a action.payload.name en un caso donde no existe.
      </div>

      <div className="info-box success">
        <strong>Concepto clave:</strong> Un reducer es una <strong>funcion pura</strong>:
        dado el mismo state y la misma action, siempre retorna el mismo resultado.
        No hace side effects, no muta el estado, no hace API calls. Solo calcula
        el nuevo estado. Esto lo hace predecible, testeable, y facil de debuggear.
      </div>

      <div className="lesson-nav">
        <Link to="/week2/generics">← Generics</Link>
        <Link to="/week2/custom-hooks">Custom Hooks →</Link>
      </div>
    </div>
  );
}
