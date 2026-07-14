import { Link } from 'react-router-dom';

interface UserCardProps {
  name: string;
  role: string;
  avatar: string;
  isOnline?: boolean;
}

function UserCard({ name, role, avatar, isOnline = false }: UserCardProps) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', background: '#2c2f33', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)' }}>
      <div style={{ position: 'relative' }}>
        <img src={avatar} alt={name} style={{ width: 40, height: 40, borderRadius: '50%' }} />
        {isOnline && <div style={{ position: 'absolute', bottom: 0, right: 0, width: 10, height: 10, borderRadius: '50%', background: '#70b252', border: '2px solid #2c2f33' }} />}
      </div>
      <div>
        <p style={{ fontWeight: 600, fontSize: '14px' }}>{name}</p>
        <p style={{ color: '#94979a', fontSize: '12px' }}>{role}</p>
      </div>
    </div>
  );
}

function TeamList() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <UserCard name="John Doe" role="Frontend Dev" avatar="https://i.pravatar.cc/80?u=1" isOnline />
      <UserCard name="Jane Smith" role="Backend Dev" avatar="https://i.pravatar.cc/80?u=2" />
      <UserCard name="Carlos R." role="Designer" avatar="https://i.pravatar.cc/80?u=3" isOnline />
    </div>
  );
}

export default function Lesson() {
  return (
    <div className="lesson">
      <h2>1.2 — Components y Props</h2>
      <p className="subtitle">
        Los componentes son las piezas con las que construyes la pagina.
        Las props son la informacion que les das para que sepan que mostrar.
      </p>

      <h3>¿Que es un componente?</h3>
      <p>
        Imagina que estas armando una pagina web como si fuera un mueble de IKEA.
        Cada pieza del mueble es un <strong>componente</strong>: un boton es una pieza,
        un menu es otra pieza, una tarjeta de usuario es otra pieza.
      </p>
      <p>
        En codigo, un componente es simplemente una <strong>funcion que retorna lo
        que se ve en pantalla</strong> (JSX). Nada mas.
      </p>

      <div className="code-block">{
`// Esto es un componente — una funcion que retorna JSX:
function UserCard() {
  return (
    <div>
      <p>John Doe</p>
      <p>Frontend Developer</p>
    </div>
  );
}

// Lo usas como si fuera una etiqueta HTML personalizada:
<UserCard />`
      }</div>

      <div className="info-box">
        <strong>Analogia:</strong> Un componente es como un <strong>molde de galletas</strong>.
        Defines la forma UNA vez (la funcion), y luego puedes hacer todas las galletas
        que quieras (usarla multiples veces). Cada galleta puede tener decoracion diferente
        (props diferentes).
      </div>

      <h3>¿Que son las Props?</h3>
      <p>
        Las props (abreviatura de "properties" = propiedades) son los <strong>datos que
        le pasas a un componente</strong> para que sepa que mostrar. Son como llenar un
        formulario: le das el nombre, el email, la foto, y el componente muestra esa info.
      </p>

      <div className="code-block">{
`// Definimos QUE datos acepta el componente (como un formulario):
interface UserCardProps {
  name: string;        // Texto obligatorio — el nombre
  role: string;        // Texto obligatorio — el puesto
  avatar: string;      // Texto obligatorio — URL de la foto
  isOnline?: boolean;  // Verdadero/falso OPCIONAL — ¿esta conectado?
}

// El componente RECIBE esos datos y los USA:
function UserCard({ name, role, avatar, isOnline = false }: UserCardProps) {
  return (
    <div>
      <img src={avatar} alt={name} />   {/* Usa la foto */}
      <p>{name}</p>                      {/* Usa el nombre */}
      <p>{role}</p>                      {/* Usa el puesto */}
      {isOnline && <span>En linea</span>} {/* Si esta online, muestra esto */}
    </div>
  );
}

// Al usarlo, le pasas los datos como atributos:
<UserCard name="John" role="Frontend Dev" avatar="foto.jpg" isOnline />
<UserCard name="Jane" role="Backend Dev" avatar="foto2.jpg" />
// Cada UserCard recibe datos DIFERENTES y muestra cosas DIFERENTES`
      }</div>

      <div className="info-box warning">
        <strong>Pregunta del mentor:</strong> "Explicame que es un componente y que
        son las props, usando una analogia del mundo real."
        <br /><br />
        <strong>Lo que deberias poder responder:</strong> Un componente es como una
        <strong> plantilla de documento</strong> — por ejemplo, un modelo de factura.
        La plantilla define DONDE va el nombre del cliente, el total, la fecha, etc.
        Las props son los DATOS que llenas en esa plantilla: "Cliente: Juan, Total: $100".
        La plantilla es la misma, pero los datos cambian. Asi, puedes generar 100 facturas
        diferentes usando la misma plantilla.
      </div>

      <h3>Composicion: piezas dentro de piezas</h3>
      <p>
        La magia de los componentes es que puedes <strong>meter unos dentro de otros</strong>,
        como cajas dentro de cajas. Un componente "grande" (TeamList) puede usar varios
        componentes "pequeños" (UserCard).
      </p>

      <div className="code-block">{
`// TeamList usa 3 UserCards — cada una con datos diferentes
function TeamList() {
  return (
    <div>
      <UserCard name="John" role="Frontend" avatar="..." isOnline />
      <UserCard name="Jane" role="Backend" avatar="..." />
      <UserCard name="Carlos" role="Designer" avatar="..." isOnline />
    </div>
  );
}

// TeamList no sabe COMO se ve un UserCard (eso lo maneja UserCard).
// Solo sabe QUE datos pasarle.`
      }</div>

      <div className="demo">
        <p className="demo-label">Resultado — TeamList con 3 UserCards:</p>
        <TeamList />
      </div>

      <h3>Regla importante: las props NO se pueden cambiar</h3>
      <p>
        Cuando un componente recibe props, <strong>no puede modificarlas</strong>.
        Son de "solo lectura". Es como recibir un documento impreso — puedes leerlo,
        pero no puedes editar lo que ya esta impreso.
      </p>
      <p>
        ¿Por que? Porque los datos fluyen en <strong>una sola direccion</strong>:
        del componente padre (el que usa) al componente hijo (el que muestra).
        Si el hijo pudiera cambiar las props, seria un caos — el padre no sabria
        que cambio y la app se volveria impredecible.
      </p>

      <div className="info-box warning">
        <strong>Pregunta del mentor:</strong> "¿Por que separar la pagina en componentes
        pequenos en vez de hacer todo en uno solo? ¿No es mas trabajo?"
        <br /><br />
        <strong>Lo que deberias poder responder:</strong> Separar en componentes tiene
        varias ventajas: (1) <strong>Reutilizacion</strong> — si necesito la misma tarjeta
        en otra pagina, ya la tengo. (2) <strong>Mantenimiento</strong> — si algo cambia en
        el diseño de la tarjeta, solo edito UN archivo, no busco en toda la pagina.
        (3) <strong>Trabajo en equipo</strong> — un dev puede trabajar en UserCard mientras
        otro trabaja en TeamList sin pisarse. (4) <strong>Testing</strong> — puedo probar
        UserCard sola sin necesitar toda la pagina.
      </div>

      <div className="info-box warning">
        <strong>Pregunta del mentor:</strong> "¿Como decides cuando algo deberia ser
        un componente separado y cuando dejarlo en el mismo archivo?"
        <br /><br />
        <strong>Lo que deberias poder responder:</strong> Creo un componente separado
        cuando: (1) Se repite en mas de un lugar. (2) Es suficientemente complejo para
        tener su propia logica. (3) El componente padre se vuelve dificil de leer
        (mas de 50 lineas de JSX). No separo prematuramente — si algo solo se usa
        una vez y es simple, puede quedarse inline.
      </div>

      <div className="info-box success">
        <strong>Para el code review:</strong> Cuando te muestren un componente gigante
        de 300 lineas y pregunten "¿que harias?", la respuesta es: identificar las
        partes que se repiten o que tienen logica independiente, y extraerlas en
        componentes mas pequeños. Cada componente deberia hacer UNA cosa bien.
      </div>

      <div className="lesson-nav">
        <Link to="/week1/jsx-basics">← JSX Basics</Link>
        <Link to="/week1/rendering-lists">Rendering Lists →</Link>
      </div>
    </div>
  );
}
