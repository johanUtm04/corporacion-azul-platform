import type { FormEvent } from 'react'

type ProductSearchProps = {
  query: string
  onQueryChange: (query: string) => void
  onSearch: (search: string) => void
}

export default function ProductSearch({
  query,
  onQueryChange,
  onSearch,
}: ProductSearchProps) {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    onSearch(query.trim())
  }

  return (
    <form className="product-search" onSubmit={handleSubmit}>
      <label htmlFor="product-search-input">
        Buscar productos
      </label>

      <div className="product-search-controls">
        <input
          id="product-search-input"
          type="search"
          placeholder="Ej. Cemento Cruz Azul"
          value={query}
          maxLength={100}
          onChange={(event) =>
            onQueryChange(event.target.value)
          }
        />

        <button type="submit" className="btn-primary">
          Buscar
        </button>
      </div>
    </form>
  )
}