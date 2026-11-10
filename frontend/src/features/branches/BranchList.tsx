import type { Branch } from './branches'

interface BranchListProps {
  branches: Branch[]
  onSelect: (branch: Branch) => void
}

interface BranchListProps {
  branches: Branch[]
  onSelect: (branch: Branch) => void
  getDistanceKm?: (branch: Branch) => number
}

export default function BranchList({
  branches,
  onSelect,
  getDistanceKm,
}: BranchListProps) {
  if (branches.length === 0) {
    return (
      <p className="branch-list-empty">
        No encontramos sucursales con esos filtros.
      </p>
    )
  }

  return (
    <div className="branch-list">
      <h2>Sucursales disponibles</h2>

      {branches.map((branch) => (
        <article
          key={branch.id}
          className="branch-list-item"
        >
          <div>
            <h3>{branch.name}</h3>
            <p>{branch.location}</p>
            {getDistanceKm && (
            <p className="branch-list-distance">
                A {getDistanceKm(branch).toFixed(1)} km de ti
            </p>
            )}
            <span>{branch.state}</span>
          </div>

          <div className="branch-list-actions">
            <button
              type="button"
              onClick={() => onSelect(branch)}
            >
              Ver en mapa
            </button>

            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${branch.lat},${branch.lng}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              Cómo llegar ↗
            </a>
          </div>
        </article>
      ))}
    </div>
  )
}