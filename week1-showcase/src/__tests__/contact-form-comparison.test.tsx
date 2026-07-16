import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ContactForm } from '../components/ContactForm'
import { ContactFormMultiError } from '../components/ContactFormMultiError'

// Este test compara las dos formas de mostrar errores

describe('ContactForm (error unico)', () => {
  it('muestra solo UN error cuando nombre y email estan vacios', async () => {
    const user = userEvent.setup()
    render(<ContactForm onAdd={vi.fn()} />)

    await user.click(screen.getByText('Add contact'))

    // Solo muestra el primer error (name), NO el de email
    expect(screen.getByRole('alert')).toHaveTextContent('Name is required')
    expect(screen.queryByText('Valid email is required')).not.toBeInTheDocument()
  })

  it('muestra el error del email DESPUES de corregir el nombre', async () => {
    const user = userEvent.setup()
    render(<ContactForm onAdd={vi.fn()} />)

    // Primer intento: nombre vacio
    await user.click(screen.getByText('Add contact'))
    expect(screen.getByRole('alert')).toHaveTextContent('Name is required')

    // Corrijo el nombre, intento de nuevo
    await user.type(screen.getByLabelText('Name'), 'Ada')
    await user.click(screen.getByText('Add contact'))

    // Ahora SI muestra el error del email
    expect(screen.getByRole('alert')).toHaveTextContent('Valid email is required')
  })
})

describe('ContactFormMultiError (errores multiples)', () => {
  it('muestra TODOS los errores a la vez cuando nombre y email estan vacios', async () => {
    const user = userEvent.setup()
    render(<ContactFormMultiError onAdd={vi.fn()} />)

    await user.click(screen.getByText('Add contact'))

    // Muestra ambos errores al mismo tiempo
    expect(screen.getByText('Name is required')).toBeInTheDocument()
    expect(screen.getByText('Valid email is required')).toBeInTheDocument()
  })

  it('el usuario ve todo lo que tiene que corregir en un solo intento', async () => {
    const user = userEvent.setup()
    render(<ContactFormMultiError onAdd={vi.fn()} />)

    await user.click(screen.getByText('Add contact'))

    const alert = screen.getByRole('alert')
    // El alert contiene ambos mensajes
    expect(alert).toHaveTextContent('Name is required')
    expect(alert).toHaveTextContent('Valid email is required')
  })
})
