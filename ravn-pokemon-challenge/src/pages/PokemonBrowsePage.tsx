import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAllPokemonNames } from '../hooks/use-all-pokemon-names'
import { usePokemonByType } from '../hooks/use-pokemon-by-type'
import { useDebounce } from '../hooks/use-debounce'
import { PokemonGrid } from '../components/pokemon/PokemonGrid'
import { PokemonSearchBar } from '../components/pokemon/PokemonSearchBar'
import { Pagination } from '../components/ui/Pagination'
import { Spinner } from '../components/ui/Spinner'
import { AddToTeamModal } from '../components/trainer/AddToTeamModal'
import './Pages.css'

const PAGE_SIZE = 20

// pagina principal del pokedex, con busqueda, filtro por tipo y paginacion
export function PokemonBrowsePage() {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [selectedType, setSelectedType] = useState('')
  // cuando el usuario quiere agregar un pokemon a un equipo, guardo aca cual es para abrir el modal
  const [modalPokemon, setModalPokemon] = useState<{
    id: number
    name: string
    sprite: string
  } | null>(null)

  // espero 300ms despues de que el usuario deja de escribir para filtrar
  const debouncedSearch = useDebounce(search, 300)
  const navigate = useNavigate()

  const { data: allPokemon, isLoading: loadingAll } = useAllPokemonNames()
  const { data: typePokemon, isLoading: loadingType } = usePokemonByType(selectedType)

  // si hay tipo seleccionado uso esa lista, si no uso todos los pokemon
  const source = selectedType ? typePokemon : allPokemon

  // filtro por nombre con useMemo para que no recalcule en cada render
  const filtered = useMemo(() => {
    if (!source) return []
    if (!debouncedSearch) return source
    return source.filter((p) =>
      p.name.toLowerCase().includes(debouncedSearch.toLowerCase()),
    )
  }, [source, debouncedSearch])

  // paginacion manual: calculo cuantas paginas hay y corto el array
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const paginated = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  )

  const isLoading = loadingAll || (selectedType !== '' && loadingType)

  // reseteo a pagina 1 cuando cambia la busqueda o el tipo
  function handleSearchChange(query: string) {
    setSearch(query)
    setPage(1)
  }

  function handleTypeChange(type: string) {
    setSelectedType(type)
    setPage(1)
  }

  return (
    <div className="page">
      <div className="browse-hero">
        <h2 className="browse-hero__title">Pokedex</h2>
        <p className="browse-hero__subtitle">
          {filtered.length} Pokemon found
        </p>
      </div>

      <PokemonSearchBar
        onSearchChange={handleSearchChange}
        onTypeChange={handleTypeChange}
        selectedType={selectedType}
      />

      {isLoading ? (
        <Spinner />
      ) : (
        <>
          <PokemonGrid
            pokemon={paginated}
            onSelect={(name) => navigate(`/pokemon/${name}`)}
            onAddToTeam={(p) => setModalPokemon(p)}
          />
          <Pagination
            page={currentPage}
            totalPages={totalPages}
            onPrev={() => setPage((p) => Math.max(1, p - 1))}
            onNext={() => setPage((p) => Math.min(totalPages, p + 1))}
          />
        </>
      )}

      {modalPokemon && (
        <AddToTeamModal
          pokemon={modalPokemon}
          onClose={() => setModalPokemon(null)}
        />
      )}
    </div>
  )
}
