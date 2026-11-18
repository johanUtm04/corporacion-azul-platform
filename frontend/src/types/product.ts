export interface Product {
  id: number
  name: string
  slug: string
  brand: string | null
  categories: string[]
}

export interface ProductPagination {
  page: number
  per_page: number
  total: number
  total_pages: number
}

export interface ProductListResponse {
  data: Product[]
  pagination: ProductPagination
}

export interface ProductFilterOption {
  id: number
  name: string
  slug: string
  logo_url?: string | null
}

export interface ProductFiltersResponse {
  brands: ProductFilterOption[]
  categories: ProductFilterOption[]
}
