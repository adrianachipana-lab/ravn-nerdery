import { BrowserRouter, Routes, Route, NavLink, Link } from 'react-router-dom';
import './styles.css';

// Week 1
import JsxBasics from './lessons/week1/01-jsx-basics/Lesson';
import ComponentsProps from './lessons/week1/02-components-props/Lesson';
import RenderingLists from './lessons/week1/03-rendering-lists/Lesson';
import Forms from './lessons/week1/04-forms/Lesson';
import ErrorBoundaries from './lessons/week1/05-error-boundaries/Lesson';
import UseStatePage from './lessons/week1/06-useState/Lesson';
import UseEffectPage from './lessons/week1/07-useEffect/Lesson';
import UseRefPage from './lessons/week1/08-useRef/Lesson';
import StylingPage from './lessons/week1/09-styling/Lesson';

// Week 2
import TypingProps from './lessons/week2/01-typing-props/Lesson';
import Generics from './lessons/week2/02-generics-hooks/Lesson';
import UseReducerPage from './lessons/week2/03-useReducer/Lesson';
import CustomHooks from './lessons/week2/04-custom-hooks/Lesson';
import ContextPage from './lessons/week2/05-context/Lesson';
import TestingPage from './lessons/week2/06-testing-intro/Lesson';
import ReactQueryPage from './lessons/week2/07-react-query/Lesson';
import AccessibilityPage from './lessons/week2/08-accessibility/Lesson';

// Week 3
import Composition from './lessons/week3/01-composition-pattern/Lesson';
import CompoundComponents from './lessons/week3/02-compound-components/Lesson';
import SlotsPattern from './lessons/week3/03-slots-pattern/Lesson';
import SuspensePage from './lessons/week3/04-suspense/Lesson';
import StateManagement from './lessons/week3/05-state-management/Lesson';
import PerformancePage from './lessons/week3/06-performance/Lesson';
import ToolingPage from './lessons/week3/07-tooling-git/Lesson';
import React19Page from './lessons/week3/08-react19/Lesson';

function Home() {
  return (
    <div className="home">
      <h2>React Step by Step</h2>
      <p className="intro">
        Programa de aprendizaje interactivo — 25 lecciones con explicaciones basicas,
        demos interactivas, y preguntas de mentor para prepararte para el code review.
      </p>

      <div className="week-card">
        <span className="badge badge-w1">WEEK 1 — 9 LESSONS</span>
        <h3>React Foundation</h3>
        <p>JSX, Components, Props, Lists, Forms, Error Boundaries, useState, useEffect, useRef, Styling</p>
      </div>

      <div className="week-card">
        <span className="badge badge-w2">WEEK 2 — 8 LESSONS</span>
        <h3>TypeScript + Advanced APIs</h3>
        <p>Typing Props, Generics, useReducer, Custom Hooks, Context, Testing, Data Fetching, Accessibility</p>
      </div>

      <div className="week-card">
        <span className="badge badge-w3">WEEK 3 — 8 LESSONS</span>
        <h3>Patterns + Professional Skills</h3>
        <p>Composition, Compound Components, Slots, Suspense, State Management, Performance, Tooling, React 19</p>
      </div>

      <div style={{ marginTop: '24px' }}>
        <Link to="/week1/jsx-basics" className="btn btn-primary" style={{ textDecoration: 'none' }}>
          Start Week 1 →
        </Link>
      </div>
    </div>
  );
}

const WEEK1 = [
  { path: 'jsx-basics', label: 'JSX Basics', num: '1.1' },
  { path: 'components-props', label: 'Components & Props', num: '1.2' },
  { path: 'rendering-lists', label: 'Rendering Lists', num: '1.3' },
  { path: 'forms', label: 'Forms', num: '1.4' },
  { path: 'error-boundaries', label: 'Error Boundaries', num: '1.5' },
  { path: 'useState', label: 'useState', num: '1.6' },
  { path: 'useEffect', label: 'useEffect', num: '1.7' },
  { path: 'useRef', label: 'useRef', num: '1.8' },
  { path: 'styling', label: 'Styling', num: '1.9' },
];

const WEEK2 = [
  { path: 'typing-props', label: 'Typing Props', num: '2.1' },
  { path: 'generics', label: 'Generics & Hooks', num: '2.2' },
  { path: 'useReducer', label: 'useReducer', num: '2.3' },
  { path: 'custom-hooks', label: 'Custom Hooks', num: '2.4' },
  { path: 'context', label: 'Context API', num: '2.5' },
  { path: 'testing', label: 'Testing', num: '2.6' },
  { path: 'react-query', label: 'Data Fetching', num: '2.7' },
  { path: 'accessibility', label: 'Accessibility', num: '2.8' },
];

const WEEK3 = [
  { path: 'composition', label: 'Composition', num: '3.1' },
  { path: 'compound-components', label: 'Compound Components', num: '3.2' },
  { path: 'slots', label: 'Slots Pattern', num: '3.3' },
  { path: 'suspense', label: 'Suspense', num: '3.4' },
  { path: 'state-management', label: 'State Management', num: '3.5' },
  { path: 'performance', label: 'Performance', num: '3.6' },
  { path: 'tooling', label: 'Tooling & Git', num: '3.7' },
  { path: 'react19', label: 'React 19', num: '3.8' },
];

export default function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <aside className="sidebar">
          <div className="sidebar-header">
            <h1>React Step by Step</h1>
            <p>RAVN Frontend Program</p>
          </div>

          <nav>
            <div className="sidebar-section">
              <h2>Week 1 — Foundation</h2>
              {WEEK1.map(l => (
                <NavLink key={l.path} to={`/week1/${l.path}`}
                  className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
                  <span className="num">{l.num}</span> {l.label}
                </NavLink>
              ))}
            </div>

            <div className="sidebar-section">
              <h2>Week 2 — TypeScript + APIs</h2>
              {WEEK2.map(l => (
                <NavLink key={l.path} to={`/week2/${l.path}`}
                  className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
                  <span className="num">{l.num}</span> {l.label}
                </NavLink>
              ))}
            </div>

            <div className="sidebar-section">
              <h2>Week 3 — Patterns + Pro</h2>
              {WEEK3.map(l => (
                <NavLink key={l.path} to={`/week3/${l.path}`}
                  className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
                  <span className="num">{l.num}</span> {l.label}
                </NavLink>
              ))}
            </div>
          </nav>
        </aside>

        <main className="main">
          <Routes>
            <Route path="/" element={<Home />} />

            <Route path="/week1/jsx-basics" element={<JsxBasics />} />
            <Route path="/week1/components-props" element={<ComponentsProps />} />
            <Route path="/week1/rendering-lists" element={<RenderingLists />} />
            <Route path="/week1/forms" element={<Forms />} />
            <Route path="/week1/error-boundaries" element={<ErrorBoundaries />} />
            <Route path="/week1/useState" element={<UseStatePage />} />
            <Route path="/week1/useEffect" element={<UseEffectPage />} />
            <Route path="/week1/useRef" element={<UseRefPage />} />
            <Route path="/week1/styling" element={<StylingPage />} />

            <Route path="/week2/typing-props" element={<TypingProps />} />
            <Route path="/week2/generics" element={<Generics />} />
            <Route path="/week2/useReducer" element={<UseReducerPage />} />
            <Route path="/week2/custom-hooks" element={<CustomHooks />} />
            <Route path="/week2/context" element={<ContextPage />} />
            <Route path="/week2/testing" element={<TestingPage />} />
            <Route path="/week2/react-query" element={<ReactQueryPage />} />
            <Route path="/week2/accessibility" element={<AccessibilityPage />} />

            <Route path="/week3/composition" element={<Composition />} />
            <Route path="/week3/compound-components" element={<CompoundComponents />} />
            <Route path="/week3/slots" element={<SlotsPattern />} />
            <Route path="/week3/suspense" element={<SuspensePage />} />
            <Route path="/week3/state-management" element={<StateManagement />} />
            <Route path="/week3/performance" element={<PerformancePage />} />
            <Route path="/week3/tooling" element={<ToolingPage />} />
            <Route path="/week3/react19" element={<React19Page />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
