// el reducer tiene que ser puro, nunca muto el state directamente
// siempre retorno un objeto nuevo con spread
import type { TrainerWithTeam, TeamSlot } from '../types/trainer'

// maximo 6 pokemon por equipo, como en los juegos
const MAX_TEAM_SIZE = 6

export interface TrainersState {
  trainers: TrainerWithTeam[]
}

// discriminated union: cada accion tiene un type distinto y typescript sabe los campos de cada una
export type TrainersAction =
  | { type: 'ADD_TRAINER'; name: string }
  | { type: 'REMOVE_TRAINER'; trainerId: string }
  | { type: 'ADD_TO_TEAM'; trainerId: string; pokemon: TeamSlot }
  | { type: 'REMOVE_FROM_TEAM'; trainerId: string; pokemonId: number }

export const initialTrainersState: TrainersState = { trainers: [] }

export function trainersReducer(
  state: TrainersState,
  action: TrainersAction,
): TrainersState {
  switch (action.type) {
    // creo un trainer nuevo con un id unico usando crypto.randomUUID
    case 'ADD_TRAINER':
      return {
        ...state,
        trainers: [
          ...state.trainers,
          { id: crypto.randomUUID(), name: action.name, team: [] },
        ],
      }

    // filtro para sacar al trainer de la lista
    case 'REMOVE_TRAINER':
      return {
        ...state,
        trainers: state.trainers.filter((t) => t.id !== action.trainerId),
      }

    // valido que el equipo no este lleno y que el pokemon no este repetido antes de agregar
    case 'ADD_TO_TEAM':
      return {
        ...state,
        trainers: state.trainers.map((t) => {
          if (t.id !== action.trainerId) return t
          if (t.team.length >= MAX_TEAM_SIZE) return t
          if (t.team.some((s) => s.pokemonId === action.pokemon.pokemonId)) return t
          return { ...t, team: [...t.team, action.pokemon] }
        }),
      }

    // saco un pokemon del equipo filtrando por id
    case 'REMOVE_FROM_TEAM':
      return {
        ...state,
        trainers: state.trainers.map((t) => {
          if (t.id !== action.trainerId) return t
          return {
            ...t,
            team: t.team.filter((s) => s.pokemonId !== action.pokemonId),
          }
        }),
      }
  }
}
