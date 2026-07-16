import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  type ReactNode,
} from 'react'
import type { TrainerWithTeam, TeamSlot } from '../types/trainer'
import {
  trainersReducer,
  initialTrainersState,
  type TrainersState,
} from './trainers-reducer'

const STORAGE_KEY = 'ravn-pokemon-trainers'

// cargo el estado inicial desde localStorage para que los trainers persistan entre recargas
// si no hay valor en localStorage, uso el initialState
function loadState(): TrainersState {
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored) {
    try {
      return JSON.parse(stored) as TrainersState
    } catch {
      return initialTrainersState
    }
  }
  return initialTrainersState
}

// esta interfaz define todas las acciones que se pueden hacer con trainers
interface TrainersApi {
  state: TrainersState
  addTrainer: (name: string) => void
  removeTrainer: (trainerId: string) => void
  addToTeam: (trainerId: string, pokemon: TeamSlot) => void
  removeFromTeam: (trainerId: string, pokemonId: number) => void
  getTrainer: (trainerId: string) => TrainerWithTeam | undefined
}

const TrainersContext = createContext<TrainersApi | null>(null)

export function TrainersProvider({ children }: { children: ReactNode }) {
  // useReducer con lazy init: el tercer argumento es la funcion que calcula el estado inicial
  const [state, dispatch] = useReducer(trainersReducer, null, loadState)

  // cada vez que cambia el state, lo guardo en localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  }, [state])

  // el api wrappea los dispatch para que los componentes no tengan que saber de actions
  const api: TrainersApi = {
    state,
    addTrainer: (name) => dispatch({ type: 'ADD_TRAINER', name }),
    removeTrainer: (trainerId) => dispatch({ type: 'REMOVE_TRAINER', trainerId }),
    addToTeam: (trainerId, pokemon) =>
      dispatch({ type: 'ADD_TO_TEAM', trainerId, pokemon }),
    removeFromTeam: (trainerId, pokemonId) =>
      dispatch({ type: 'REMOVE_FROM_TEAM', trainerId, pokemonId }),
    getTrainer: (trainerId) =>
      state.trainers.find((t) => t.id === trainerId),
  }

  return (
    <TrainersContext.Provider value={api}>
      {children}
    </TrainersContext.Provider>
  )
}

// si el context es null significa que no hay provider arriba, tiro error
export function useTrainers(): TrainersApi {
  const ctx = useContext(TrainersContext)
  if (!ctx) {
    throw new Error('useTrainers must be used within a TrainersProvider')
  }
  return ctx
}
