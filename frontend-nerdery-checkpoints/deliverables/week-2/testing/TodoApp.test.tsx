import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TodoApp } from './src/TodoApp'

// tests para la app de todos
// uso testing-library que busca elementos como lo haria un usuario real (por rol, label, texto)
describe('TodoApp', () => {
  // test basico: verifico que el input existe al renderizar
  it('renders the new-todo input', () => {
    render(<TodoApp />)
    expect(screen.getByLabelText(/new todo/i)).toBeInTheDocument()
  })

  // test de agregar: escribo texto y hago click en add
  it('adds a non-empty todo to the list', async () => {
    const user = userEvent.setup()
    render(<TodoApp />)
    await user.type(screen.getByLabelText(/new todo/i), 'Buy milk')
    await user.click(screen.getByRole('button', { name: /add/i }))
    expect(screen.getByText('Buy milk')).toBeInTheDocument()
  })

  // verifico que no se agregan todos vacios o con solo espacios
  it('ignores empty / whitespace-only input', async () => {
    const user = userEvent.setup()
    render(<TodoApp />)
    await user.click(screen.getByRole('button', { name: /add/i }))
    expect(screen.queryAllByRole('listitem')).toHaveLength(0)

    await user.type(screen.getByLabelText(/new todo/i), '   ')
    await user.click(screen.getByRole('button', { name: /add/i }))
    expect(screen.queryAllByRole('listitem')).toHaveLength(0)
  })

  // despues de agregar un todo, el input tiene que quedar vacio
  it('clears the input after adding', async () => {
    const user = userEvent.setup()
    render(<TodoApp />)
    const input = screen.getByLabelText(/new todo/i)
    await user.type(input, 'Buy milk')
    await user.click(screen.getByRole('button', { name: /add/i }))
    expect(input).toHaveValue('')
  })

  // pruebo que el checkbox alterna entre completado y no completado
  it('toggles a todo completed via its checkbox', async () => {
    const user = userEvent.setup()
    render(<TodoApp />)
    await user.type(screen.getByLabelText(/new todo/i), 'Buy milk')
    await user.click(screen.getByRole('button', { name: /add/i }))

    const checkbox = screen.getByRole('checkbox', { name: 'Buy milk' })
    expect(checkbox).not.toBeChecked()
    await user.click(checkbox)
    expect(checkbox).toBeChecked()
    // lo clickeo de nuevo y tiene que volver a no estar checked
    await user.click(checkbox)
    expect(checkbox).not.toBeChecked()
  })

  // pruebo que el boton delete elimina el todo de la lista
  it('deletes a todo via its Delete button', async () => {
    const user = userEvent.setup()
    render(<TodoApp />)
    await user.type(screen.getByLabelText(/new todo/i), 'Buy milk')
    await user.click(screen.getByRole('button', { name: /add/i }))
    expect(screen.getByText('Buy milk')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /delete buy milk/i }))
    // queryByText retorna null si no lo encuentra, en vez de tirar error
    expect(screen.queryByText('Buy milk')).not.toBeInTheDocument()
  })

  // filtro "Active" solo muestra los que no estan completados
  it('Active filter shows only not-completed todos', async () => {
    const user = userEvent.setup()
    render(<TodoApp />)
    const input = screen.getByLabelText(/new todo/i)

    await user.type(input, 'Task A')
    await user.click(screen.getByRole('button', { name: /add/i }))
    await user.type(input, 'Task B')
    await user.click(screen.getByRole('button', { name: /add/i }))

    // marco Task A como completada y filtro por Active
    await user.click(screen.getByRole('checkbox', { name: 'Task A' }))
    await user.click(screen.getByRole('button', { name: 'Active' }))

    expect(screen.queryByText('Task A')).not.toBeInTheDocument()
    expect(screen.getByText('Task B')).toBeInTheDocument()
  })

  // filtro "Completed" solo muestra los completados
  it('Completed filter shows only completed todos', async () => {
    const user = userEvent.setup()
    render(<TodoApp />)
    const input = screen.getByLabelText(/new todo/i)

    await user.type(input, 'Task A')
    await user.click(screen.getByRole('button', { name: /add/i }))
    await user.type(input, 'Task B')
    await user.click(screen.getByRole('button', { name: /add/i }))

    await user.click(screen.getByRole('checkbox', { name: 'Task A' }))
    await user.click(screen.getByRole('button', { name: 'Completed' }))

    expect(screen.getByText('Task A')).toBeInTheDocument()
    expect(screen.queryByText('Task B')).not.toBeInTheDocument()
  })

  // filtro "All" vuelve a mostrar todos, sin importar si estan completados
  it('All filter shows every todo again', async () => {
    const user = userEvent.setup()
    render(<TodoApp />)
    const input = screen.getByLabelText(/new todo/i)

    await user.type(input, 'Task A')
    await user.click(screen.getByRole('button', { name: /add/i }))
    await user.type(input, 'Task B')
    await user.click(screen.getByRole('button', { name: /add/i }))

    await user.click(screen.getByRole('checkbox', { name: 'Task A' }))
    await user.click(screen.getByRole('button', { name: 'Completed' }))
    await user.click(screen.getByRole('button', { name: 'All' }))

    expect(screen.getByText('Task A')).toBeInTheDocument()
    expect(screen.getByText('Task B')).toBeInTheDocument()
  })

  // verifico que el contador de todos activos se actualiza correctamente
  it('shows the count of active todos as "{n} left"', async () => {
    const user = userEvent.setup()
    render(<TodoApp />)
    // al inicio no hay ninguno
    expect(screen.getByText('0 left')).toBeInTheDocument()

    const input = screen.getByLabelText(/new todo/i)
    await user.type(input, 'Task A')
    await user.click(screen.getByRole('button', { name: /add/i }))
    await user.type(input, 'Task B')
    await user.click(screen.getByRole('button', { name: /add/i }))
    expect(screen.getByText('2 left')).toBeInTheDocument()

    // completo uno y tiene que bajar a 1
    await user.click(screen.getByRole('checkbox', { name: 'Task A' }))
    expect(screen.getByText('1 left')).toBeInTheDocument()
  })
})
