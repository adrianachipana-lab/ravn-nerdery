import { describe, it, expect } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TrainerForm } from '../components/trainer/TrainerForm'
import { renderWithProviders } from './test-utils'
import { useTrainers } from '../context/trainers-context'

function TrainerCount() {
  const { state } = useTrainers()
  return <p>Count: {state.trainers.length}</p>
}

describe('TrainersProvider integration', () => {
  it('adding a trainer via form updates the context state', async () => {
    const user = userEvent.setup()
    renderWithProviders(
      <>
        <TrainerForm />
        <TrainerCount />
      </>,
    )

    expect(screen.getByText('Count: 0')).toBeInTheDocument()

    await user.type(screen.getByLabelText(/new trainer name/i), 'Ash Ketchum')
    await user.click(screen.getByRole('button', { name: /create trainer/i }))

    expect(screen.getByText('Count: 1')).toBeInTheDocument()
  })

  it('adding multiple trainers updates count correctly', async () => {
    const user = userEvent.setup()
    renderWithProviders(
      <>
        <TrainerForm />
        <TrainerCount />
      </>,
    )

    const input = screen.getByLabelText(/new trainer name/i)
    const btn = screen.getByRole('button', { name: /create trainer/i })

    await user.type(input, 'Ash')
    await user.click(btn)
    await user.type(input, 'Misty')
    await user.click(btn)

    expect(screen.getByText('Count: 2')).toBeInTheDocument()
  })
})
