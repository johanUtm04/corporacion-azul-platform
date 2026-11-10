interface BranchSearchProps {
  value: string
  onChange: (value: string) => void
}

export default function BranchSearch({
  value,
  onChange,
}: BranchSearchProps) {
  return (
    <div className="branch-search">
      <label htmlFor="branch-search-input">
        Buscar sucursal
      </label>

      <input
        id="branch-search-input"
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Ej. Morelia, Guadalajara, Toluca..."
      />
    </div>
  )
}