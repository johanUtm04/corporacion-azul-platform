type ProductPaginationProps = {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}
import './ProductPagination.css'

export default function ProductPagination({
  currentPage,
  totalPages,
  onPageChange,
}: ProductPaginationProps) {
  if (totalPages <= 1) return null

  return (
    <nav
      className="product-pagination"
      aria-label="Paginación de productos"
    >
      <button
        type="button"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        ← Anterior
      </button>

      <span>
        Página {currentPage} de {totalPages}
      </span>

      <button
        type="button"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      >
        Siguiente →
      </button>
    </nav>
  )
}