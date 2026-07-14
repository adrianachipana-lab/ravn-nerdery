import { Link } from 'react-router-dom';

// Este es un componente — una funcion que retorna lo que se ve en pantalla
function Greeting() {
  const name = 'RAVN Developer';
  const year = new Date().getFullYear();

  return (
    <div>
      <p>Hello, <strong>{name}</strong>!</p>
      <p>Current year: {year}</p>
      <p>2 + 2 = {2 + 2}</p>
    </div>
  );
}

export default function Lesson() {
  return (
    <div className="lesson">
      <h2>1.1 — JSX Basics</h2>
      <p className="subtitle">
        Antes de hacer cualquier cosa en React, necesitas entender JSX.
        Es lo que usas para decirle a React "quiero que se vea asi".
      </p>

      <h3>Primero: ¿Que es React?</h3>
      <p>
        React es una <strong>herramienta para construir lo que ves en una pagina web</strong>.
        Botones, listas, formularios, menus — todo eso se construye con React.
        En vez de escribir HTML directamente (como en una pagina estatica), React
        te permite crear piezas reutilizables de interfaz que se actualizan solas cuando
        los datos cambian.
      </p>
      <p>
        Piensa en React como un sistema de LEGO: creas piezas (componentes),
        y las combinas para construir la pagina completa.
      </p>

      <h3>¿Que es JSX?</h3>
      <p>
        JSX es la forma de escribir la interfaz dentro de JavaScript.
        Se <strong>parece a HTML</strong>, pero no es HTML — es JavaScript disfrazado.
      </p>
      <p>
        Imagina que estas escribiendo una carta. HTML es como escribir la carta
        a mano en papel. JSX es como dictarsela a una persona (React) que la
        escribe por ti, y ademas puede cambiar partes de la carta automaticamente
        cuando le das nueva informacion.
      </p>

      <div className="code-block">{
`// Esto es JSX — se parece a HTML pero esta DENTRO de JavaScript:
<h1>Hello World</h1>

// Cuando el compilador (el traductor) lo ve, lo convierte en:
React.createElement('h1', null, 'Hello World')

// Es decir: "crea un titulo h1 que diga Hello World"
// Tu no ves esta traduccion — sucede automaticamente.`
      }</div>

      <div className="info-box">
        <strong>Analogia:</strong> JSX es como un atajo. En vez de escribir una
        instruccion larga y complicada (<code>React.createElement(...)</code>),
        escribes algo que parece HTML y el compilador lo traduce por ti.
        Es como usar emojis en vez de escribir "cara sonriente" cada vez.
      </div>

      <h3>Meter datos dinamicos con llaves {'{}'}</h3>
      <p>
        La magia de JSX es que puedes meter <strong>datos que cambian</strong> dentro
        del "HTML". Para eso usas llaves <code>{'{}'}</code>. Todo lo que pongas
        dentro de las llaves se ejecuta como JavaScript.
      </p>

      <div className="code-block">{
`const name = 'RAVN';      // Una variable con un texto
const year = 2026;         // Una variable con un numero

return (
  <div>
    <p>Company: {name}</p>       {/* Muestra el VALOR de name → "RAVN" */}
    <p>Year: {year}</p>          {/* Muestra el VALOR de year → 2026 */}
    <p>2 + 2 = {2 + 2}</p>      {/* Hace la suma y muestra → 4 */}
    <p>{name.toUpperCase()}</p>  {/* Convierte a mayusculas → "RAVN" */}
  </div>
);

// Sin las llaves, "name" se mostraria como texto literal:
// <p>name</p>  → muestra "name" en la pantalla
// <p>{name}</p> → muestra "RAVN" en la pantalla`
      }</div>

      <h3>Demo — asi se ve en la pantalla</h3>
      <div className="demo">
        <p className="demo-label">Resultado del componente Greeting:</p>
        <Greeting />
      </div>
      <p>
        El componente <code>Greeting</code> usa una variable <code>name</code> y
        la funcion <code>new Date().getFullYear()</code> para mostrar datos dinamicos.
        Cada vez que recargues la pagina, el año se calcula de nuevo automaticamente.
      </p>

      <h3>Reglas basicas de JSX</h3>
      <p>JSX tiene algunas reglas que son diferentes a HTML normal:</p>
      <ul>
        <li><strong>Solo un elemento raiz:</strong> Todo debe estar dentro de UN contenedor. Es como un regalo — necesita UNA caja, no puedes dar cosas sueltas</li>
        <li><strong><code>className</code> en vez de <code>class</code>:</strong> En JavaScript, <code>class</code> ya significa otra cosa, asi que en JSX usamos <code>className</code></li>
        <li><strong>Cerrar todas las etiquetas:</strong> En HTML puedes escribir <code>{'<img>'}</code>, en JSX debes escribir <code>{'<img />'}</code> (con la barra al final)</li>
        <li><strong>camelCase:</strong> Los atributos se escriben en camelCase: <code>onClick</code> (no <code>onclick</code>), <code>tabIndex</code> (no <code>tabindex</code>)</li>
      </ul>

      <div className="code-block">{
`// MAL — dos elementos sueltos (React no sabe cual es el principal):
return (
  <h1>Title</h1>
  <p>Text</p>
)

// BIEN — todo dentro de un contenedor:
return (
  <div>         {/* Este div es la "caja" que envuelve todo */}
    <h1>Title</h1>
    <p>Text</p>
  </div>
)

// TAMBIEN BIEN — Fragment (<>) es un contenedor INVISIBLE:
return (
  <>            {/* No agrega nada al HTML, solo agrupa */}
    <h1>Title</h1>
    <p>Text</p>
  </>
)`
      }</div>

      <div className="info-box warning">
        <strong>Pregunta del mentor:</strong> "Explicame con tus palabras: ¿que es JSX
        y por que existe? ¿No seria mas facil escribir HTML directamente?"
        <br /><br />
        <strong>Lo que deberias poder responder:</strong> JSX es una forma de escribir
        la interfaz dentro de JavaScript. Existe porque React necesita saber QUE mostrar
        en la pantalla, y JSX es la forma mas natural de expresarlo — se parece a HTML
        asi que es facil de leer y escribir. La ventaja sobre HTML puro es que puedes
        meter datos dinamicos (variables, calculos) directamente con las llaves,
        y React se encarga de actualizar la pantalla cuando esos datos cambian.
        Con HTML puro, tendrias que manipular el DOM manualmente con JavaScript.
      </div>

      <div className="info-box warning">
        <strong>Pregunta del mentor:</strong> "¿Cual es la diferencia entre poner llaves
        y no poner llaves en JSX?"
        <br /><br />
        <strong>Lo que deberias poder responder:</strong> Sin llaves, todo se trata como
        texto literal — <code>{'<p>name</p>'}</code> muestra la palabra "name" en la pantalla.
        Con llaves, se EJECUTA como JavaScript — <code>{'<p>{name}</p>'}</code> muestra el
        VALOR de la variable name. Las llaves son como decirle a React "esto no es texto,
        es codigo, ejecutalo y muestrame el resultado".
      </div>

      <div className="info-box success">
        <strong>Para el code review:</strong> Si te preguntan "¿por que React usa JSX en
        vez de separar HTML y JavaScript en archivos diferentes?", responde que React
        sigue el principio de <strong>colocation</strong>: la interfaz y su logica viven
        juntas porque cambian juntas. Si cambias como se ve un boton, tambien cambias
        que hace al clickearlo — tiene sentido que esten en el mismo archivo.
      </div>

      <div className="lesson-nav">
        <Link to="/">← Inicio</Link>
        <Link to="/week1/components-props">Componentes y Props →</Link>
      </div>
    </div>
  );
}
