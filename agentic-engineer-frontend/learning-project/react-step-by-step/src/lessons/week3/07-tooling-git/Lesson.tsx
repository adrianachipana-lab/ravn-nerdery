import { Link } from 'react-router-dom';

/*
  LECCION 3.7: Tooling & Git Workflow
  Las herramientas del dia a dia de un dev profesional
*/

export default function Lesson() {
  return (
    <div className="lesson">
      <h2>3.7 — Tooling & Git</h2>
      <p className="subtitle">
        Saber React no es suficiente. En un equipo profesional, necesitas
        saber usar las herramientas que mantienen la calidad del codigo.
      </p>

      <h3>ESLint: encontrar problemas automaticamente</h3>
      <p>
        ESLint es como un corrector ortografico pero para codigo. Lee tu codigo
        y te avisa de problemas: variables no usadas, imports faltantes, reglas de
        hooks violadas, y muchos mas.
      </p>

      <div className="code-block">{
`// ESLint te avisa cosas como:

// "count is defined but never used"
const count = 5;

// "React Hook useEffect has a missing dependency: 'userId'"
useEffect(() => {
  fetchUser(userId);
}, []);  // ← falta userId en las dependencias

// "Do not use Array index in keys"
items.map((item, index) => <div key={index}>{item}</div>);

// Configuracion en el proyecto:
// package.json → "lint": "oxlint"  (linter moderno y rapido)
// Corre: npm run lint`
      }</div>

      <h3>Prettier: formatear codigo automaticamente</h3>
      <p>
        Prettier formatea tu codigo automaticamente: indentacion, comillas,
        punto y coma, largo de lineas. Asi todo el equipo escribe codigo que
        se VE igual, sin discusiones de estilo.
      </p>

      <div className="code-block">{
`// ANTES de Prettier (cada dev formatea diferente):
const x={name:"John",age:30,role:"dev"}
function   foo(  ){return   true}

// DESPUES de Prettier (todos igual):
const x = { name: 'John', age: 30, role: 'dev' };
function foo() {
  return true;
}

// Configuracion: .prettierrc
{
  "semi": true,          // punto y coma al final
  "singleQuote": true,   // comillas simples
  "trailingComma": "all", // coma al final de listas
  "printWidth": 100       // largo maximo de linea
}

// Corre: npm run format`
      }</div>

      <h3>Git: el flujo de trabajo profesional</h3>
      <p>
        Git no es solo "commit y push". En un equipo, sigues un flujo
        que permite que multiples personas trabajen sin pisarse.
      </p>

      <div className="code-block">{
`# 1. SIEMPRE empieza desde main actualizado
git checkout main
git pull origin main

# 2. Crea una branch para tu feature/fix
git checkout -b feature/add-search-filter
# Nombre descriptivo: feature/, fix/, refactor/, chore/

# 3. Haz commits PEQUEÑOS y frecuentes
git add src/components/SearchFilter/
git commit -m "feat: add SearchFilter component with name and status filters"

# 4. Push tu branch
git push -u origin feature/add-search-filter

# 5. Crea un Pull Request (PR) en GitHub
# - Titulo claro: "Add search and filter functionality"
# - Descripcion: que hiciste, por que, como probarlo
# - Screenshots si es UI

# 6. Code review: otro dev revisa tu codigo
# - Responde comentarios, haz cambios si aplica
# - No te lo tomes personal — es para mejorar el codigo

# 7. Merge cuando esta aprobado
# - Squash merge (un solo commit limpio en main)
# - Borra la branch despues`
      }</div>

      <h3>Commits: mensajes que cuentan una historia</h3>
      <div className="code-block">{
`# Conventional Commits — el estandar:
# tipo(scope): descripcion

feat: add task creation modal          # Nueva feature
fix: prevent crash when task has no assignee  # Bug fix
refactor: extract useTasks hook from Dashboard  # Mejora sin cambiar funcionalidad
style: fix button alignment in header  # Solo cambios visuales
test: add unit tests for date utils    # Solo tests
chore: update dependencies             # Mantenimiento
docs: add API documentation to README  # Documentacion

# MALOS commits:
"update"
"fix stuff"
"wip"
"asdfasdf"
"changes"`
      }</div>

      <h3>CI/CD: GitHub Actions</h3>
      <div className="code-block">{
`# .github/workflows/ci.yml
# Se ejecuta automaticamente en cada push/PR

name: CI
on: [push, pull_request]

jobs:
  check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20 }

      - run: npm install
      - run: npm run typecheck    # Verifica tipos
      - run: npm run lint         # Verifica reglas
      - run: npm run test:run     # Corre tests
      - run: npm run build        # Verifica que compila

# Si CUALQUIER step falla, el PR se marca como "failed"
# y no se puede mergear. Esto previene bugs en main.`
      }</div>

      <h3>Variables de entorno</h3>
      <div className="code-block">{
`# .env (local, NO se sube a git)
VITE_API_URL=https://api.example.com
VITE_API_TOKEN=secret-token-123

# .env.example (SI se sube a git, sin valores reales)
VITE_API_URL=
VITE_API_TOKEN=

# En el codigo:
const apiUrl = import.meta.env.VITE_API_URL;

# .gitignore
.env
.env.local
# NUNCA subas tokens, passwords, o API keys a git`
      }</div>

      <div className="info-box warning">
        <strong>Pregunta del mentor:</strong> "Describime el flujo completo desde que
        te asignan un ticket hasta que tu codigo esta en produccion."
        <br /><br />
        <strong>Lo que deberias poder responder:</strong> (1) Leo el ticket y entiendo
        los requisitos. Si algo no esta claro, pregunto. (2) Actualizo main con pull.
        (3) Creo una branch con nombre descriptivo. (4) Escribo el codigo con commits
        pequeños y descriptivos. (5) Corro lint, typecheck, y tests localmente.
        (6) Push y creo un PR con descripcion clara y screenshots. (7) Espero code review,
        respondo comentarios, hago cambios. (8) Cuando esta aprobado, squash merge a main.
        (9) CI/CD deploya automaticamente a staging/produccion. (10) Verifico que funciona
        en produccion.
      </div>

      <div className="info-box success">
        <strong>Para el code review:</strong> El reviewer va a mirar: ¿commits
        descriptivos? ¿PR con descripcion clara? ¿Lint y tests pasan? ¿No hay
        .env o secrets en el codigo? ¿El .gitignore es correcto? Estas cosas
        muestran profesionalismo.
      </div>

      <div className="lesson-nav">
        <Link to="/week3/performance">← Performance</Link>
        <Link to="/week3/react19">React 19 →</Link>
      </div>
    </div>
  );
}
