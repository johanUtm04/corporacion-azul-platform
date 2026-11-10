interface BranchFiltersProps {
  states: string[]
  selectedState: string
  onStateChange: (state: string) => void
}

export default function BranchFilters({
  states,
  selectedState,
  onStateChange,
}: BranchFiltersProps) {
  return (
    <div className="branch-filter">
      <label htmlFor="branch-state">
        Filtrar por estado
      </label>

      <select
        id="branch-state"
        value={selectedState}
        onChange={(event) =>
          onStateChange(event.target.value)
        }
      >
        <option value="">Todos los estados</option>

        {states.map((state) => (
          <option key={state} value={state}>
            {state}
          </option>
        ))}
      </select>
    </div>
  )
}