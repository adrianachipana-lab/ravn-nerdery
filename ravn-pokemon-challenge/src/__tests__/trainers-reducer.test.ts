import { describe, it, expect } from 'vitest'
import {
  trainersReducer,
  initialTrainersState,
  type TrainersState,
} from '../context/trainers-reducer'

describe('trainersReducer', () => {
  it('ADD_TRAINER adds a trainer with an empty team', () => {
    const next = trainersReducer(initialTrainersState, {
      type: 'ADD_TRAINER',
      name: 'Ash',
    })
    expect(next.trainers).toHaveLength(1)
    expect(next.trainers[0].name).toBe('Ash')
    expect(next.trainers[0].team).toEqual([])
    expect(next.trainers[0].id).toBeTruthy()
  })

  it('REMOVE_TRAINER removes the trainer by id', () => {
    let state: TrainersState = initialTrainersState
    state = trainersReducer(state, { type: 'ADD_TRAINER', name: 'Ash' })
    state = trainersReducer(state, { type: 'ADD_TRAINER', name: 'Misty' })
    const ashId = state.trainers[0].id

    state = trainersReducer(state, { type: 'REMOVE_TRAINER', trainerId: ashId })
    expect(state.trainers).toHaveLength(1)
    expect(state.trainers[0].name).toBe('Misty')
  })

  it('ADD_TO_TEAM adds a pokemon to the trainer team', () => {
    let state: TrainersState = initialTrainersState
    state = trainersReducer(state, { type: 'ADD_TRAINER', name: 'Ash' })
    const trainerId = state.trainers[0].id

    state = trainersReducer(state, {
      type: 'ADD_TO_TEAM',
      trainerId,
      pokemon: { pokemonId: 25, pokemonName: 'pikachu', spriteUrl: '/pikachu.png' },
    })

    expect(state.trainers[0].team).toHaveLength(1)
    expect(state.trainers[0].team[0].pokemonName).toBe('pikachu')
  })

  it('ADD_TO_TEAM does not add duplicates', () => {
    let state: TrainersState = initialTrainersState
    state = trainersReducer(state, { type: 'ADD_TRAINER', name: 'Ash' })
    const trainerId = state.trainers[0].id
    const pikachu = { pokemonId: 25, pokemonName: 'pikachu', spriteUrl: '/pikachu.png' }

    state = trainersReducer(state, { type: 'ADD_TO_TEAM', trainerId, pokemon: pikachu })
    state = trainersReducer(state, { type: 'ADD_TO_TEAM', trainerId, pokemon: pikachu })

    expect(state.trainers[0].team).toHaveLength(1)
  })

  it('ADD_TO_TEAM respects max team size of 6', () => {
    let state: TrainersState = initialTrainersState
    state = trainersReducer(state, { type: 'ADD_TRAINER', name: 'Ash' })
    const trainerId = state.trainers[0].id

    for (let i = 1; i <= 7; i++) {
      state = trainersReducer(state, {
        type: 'ADD_TO_TEAM',
        trainerId,
        pokemon: { pokemonId: i, pokemonName: `pokemon-${i}`, spriteUrl: `/${i}.png` },
      })
    }

    expect(state.trainers[0].team).toHaveLength(6)
  })

  it('REMOVE_FROM_TEAM removes a pokemon from the team', () => {
    let state: TrainersState = initialTrainersState
    state = trainersReducer(state, { type: 'ADD_TRAINER', name: 'Ash' })
    const trainerId = state.trainers[0].id

    state = trainersReducer(state, {
      type: 'ADD_TO_TEAM',
      trainerId,
      pokemon: { pokemonId: 25, pokemonName: 'pikachu', spriteUrl: '/pikachu.png' },
    })
    state = trainersReducer(state, {
      type: 'REMOVE_FROM_TEAM',
      trainerId,
      pokemonId: 25,
    })

    expect(state.trainers[0].team).toHaveLength(0)
  })
})
