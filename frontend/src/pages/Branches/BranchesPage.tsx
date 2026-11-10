import { useMemo, useState } from 'react'

import BranchMap from '../../features/branches/BranchMap'
import BranchSearch from '../../features/branches/BranchSearch'
import BranchFilters from '../../features/branches/BranchFilters'
import BranchList from '../../features/branches/BranchList'

import {
  branches,
  type Branch,
} from '../../features/branches/branches'

interface Coordinates {
  lat: number
  lng: number
}

const states = [...new Set(branches.map((branch) => branch.state))]
  .sort((a, b) => a.localeCompare(b, 'es'))

function normalize(text: string) {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
}

// Distancia aproximada en línea recta (Haversine).
function distanceKm(
  origin: Coordinates,
  branch: Branch
): number {
  const toRadians = (value: number) =>
    (value * Math.PI) / 180

  const latDifference = toRadians(branch.lat - origin.lat)
  const lngDifference = toRadians(branch.lng - origin.lng)

  const a =
    Math.sin(latDifference / 2) ** 2 +
    Math.cos(toRadians(origin.lat)) *
      Math.cos(toRadians(branch.lat)) *
      Math.sin(lngDifference / 2) ** 2

  return (
    6371 *
    2 *
    Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  )
}

export default function BranchesPage() {
  const [search, setSearch] = useState('')
  const [selectedState, setSelectedState] = useState('')
  const [selectedBranch, setSelectedBranch] =
    useState<Branch | null>(null)

  const [userLocation, setUserLocation] =
    useState<Coordinates | null>(null)

  const [locating, setLocating] = useState(false)
  const [locationError, setLocationError] =
    useState<string | null>(null)

  const filteredBranches = useMemo(() => {
    const query = normalize(search.trim())

    const matches = branches.filter((branch) => {
      const matchesSearch = normalize(
        `${branch.name} ${branch.state} ${branch.location}`
      ).includes(query)

      const matchesState =
        selectedState === '' ||
        branch.state === selectedState

      return matchesSearch && matchesState
    })

    if (!userLocation) return matches

    // Mostrar únicamente las 5 más cercanas.
    return [...matches]
      .sort(
        (a, b) =>
          distanceKm(userLocation, a) -
          distanceKm(userLocation, b)
      )
      .slice(0, 5)
  }, [search, selectedState, userLocation])

  function handleSearch(value: string) {
    setSearch(value)
    setUserLocation(null)
    setSelectedBranch(null)
  }

  function handleStateChange(value: string) {
    setSelectedState(value)
    setUserLocation(null)
    setSelectedBranch(null)
  }

  function handleNearbySearch() {
    if (!navigator.geolocation) {
      setLocationError(
        'Tu navegador no admite geolocalización.'
      )
      return
    }

    setLocating(true)
    setLocationError(null)

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        })

        setSearch('')
        setSelectedState('')
        setSelectedBranch(null)
        setLocating(false)
      },
      (error) => {
        setLocating(false)

        setLocationError(
          error.code === 1
            ? 'Necesitamos tu permiso para consultar tu ubicación.'
            : 'No pudimos obtener tu ubicación. Intenta nuevamente.'
        )
      },
      {
        enableHighAccuracy: false,
        timeout: 10000,
        maximumAge: 60000,
      }
    )
  }

  function handleClearNearby() {
    setUserLocation(null)
    setSelectedBranch(null)
    setLocationError(null)
  }

  return (
    <section
      className="catalog-page"
      aria-labelledby="branches-title"
    >
      <span className="catalog-eyebrow">
        NUESTRA COBERTURA
      </span>

      <h1 id="branches-title">Sucursales</h1>

      <p className="catalog-description">
        Encuentra tu sucursal de Corporación Azul
        y conoce nuestras ubicaciones.
      </p>

      <BranchSearch
        value={search}
        onChange={handleSearch}
      />

      <BranchFilters
        states={states}
        selectedState={selectedState}
        onStateChange={handleStateChange}
      />

      <div className="branch-nearby">
        <button
          type="button"
          onClick={handleNearbySearch}
          disabled={locating}
        >
          {locating
            ? 'Obteniendo ubicación...'
            : ' Buscar cerca de mí'}
        </button>

        {userLocation && (
          <button
            type="button"
            className="branch-nearby-clear"
            onClick={handleClearNearby}
          >
            Mostrar todas
          </button>
        )}
      </div>

      {locationError && (
        <p role="alert">{locationError}</p>
      )}

      <p role="status">
        {userLocation
          ? `Mostrando las ${filteredBranches.length} sucursales más cercanas`
          : `${filteredBranches.length} ${
              filteredBranches.length === 1
                ? 'sucursal encontrada'
                : 'sucursales encontradas'
            }`}
      </p>

      <div className="branch-locator-layout">
        <BranchMap
          branches={filteredBranches}
          selectedBranch={selectedBranch}
        />

      <BranchList
        branches={filteredBranches}
        onSelect={setSelectedBranch}
        getDistanceKm={
          userLocation
            ? (branch: Branch) => distanceKm(userLocation, branch)
            : undefined
        }
      />

      </div>
    </section>
  )
}