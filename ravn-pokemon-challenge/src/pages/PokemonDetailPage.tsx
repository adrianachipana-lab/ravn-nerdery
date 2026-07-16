import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { PokemonDetail } from '../components/pokemon/PokemonDetail'
import { AddToTeamModal } from '../components/trainer/AddToTeamModal'
import './Pages.css'

export function PokemonDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [modalPokemon, setModalPokemon] = useState<{
    id: number
    name: string
    sprite: string
  } | null>(null)

  if (!id) return null

  return (
    <div className="page">
      <button type="button" className="page__back" onClick={() => navigate(-1)}>
        &larr; Back
      </button>
      <PokemonDetail
        id={id}
        onAddToTeam={(p) => setModalPokemon(p)}
      />
      {modalPokemon && (
        <AddToTeamModal
          pokemon={modalPokemon}
          onClose={() => setModalPokemon(null)}
        />
      )}
    </div>
  )
}
