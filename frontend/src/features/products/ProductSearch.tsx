import { useState, type FormEvent } from 'react'

type ProductSearchProps = {
  onSearch: (search: string) => void
}

export default function ProductSearch({
  onSearch,
}: ProductSearchProps) {
  const [query, setQuery] = useState('')

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
          onChange={(event) => setQuery(event.target.value)}
        />

        <button type="submit" className="btn-primary">
          Buscar
        </button>
      </div>
    </form>
  )
}