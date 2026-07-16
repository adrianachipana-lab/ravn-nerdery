export interface TeamSlot {
  pokemonId: number
  pokemonName: string
  spriteUrl: string
}

export interface Trainer {
  id: string
  name: string
}

export interface TrainerWithTeam extends Trainer {
  team: TeamSlot[]
}
