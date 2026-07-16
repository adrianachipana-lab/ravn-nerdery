import { useState, useId, useRef, useEffect } from 'react'
import { useDebouncedValue } from '../hooks/useDebouncedValue'
import { useLocalStorageState } from '../hooks/useLocalStorageState'

export function InteractivityView() {
  const [query, setQuery] = useState('')
  const debounced = useDebouncedValue(query, 300)
  const id = useId()
  const inputRef = useRef<HTMLInputElement>(null)

  const [savedNote, setSavedNote] = useLocalStorageState('showcase-note', '')

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  return (
    <>
      <div className="main__header">
        <div>
          <h1 className="main__title">Interactivity</h1>
          <p className="main__subtitle">Hooks & Effects in action</p>
        </div>
      </div>

      <div className="grid grid--2">
        <div className="card">
          <h2 className="card__title">Debounced Search</h2>
          <div className="form">
            <div className="form__group">
              <label className="form__label" htmlFor={id}>Search</label>
              <input
                className="form__input"
                id={id}
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Type something..."
              />
            </div>
            <div className="debounce-output">
              Debounced value: <span className="debounce-output__value">{debounced || '...'}</span>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>
              The value updates 300ms after you stop typing.
            </p>
          </div>
        </div>

        <div className="card">
          <h2 className="card__title">LocalStorage State</h2>
          <div className="form">
            <div className="form__group">
              <label className="form__label" htmlFor="note-input">Persistent Note</label>
              <input
                className="form__input"
                id="note-input"
                value={savedNote}
                onChange={(e) => setSavedNote(e.target.value)}
                placeholder="This persists on reload..."
              />
            </div>
            <div className="debounce-output">
              Saved in localStorage: <span className="debounce-output__value">{savedNote || '(empty)'}</span>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>
              Reload the page — the note stays.
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
