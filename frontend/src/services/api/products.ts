import type {
  ProductListResponse,
  ProductFiltersResponse,
} from '../../types/product'
import { fetchApiJson} from './fetchApiJson'

interface ProductFilters {
  page?: number
  per_page?: number
  brand?: number
  category?: number
  search?: string
}

export async function getProducts(
  filters: ProductFilters = {}
): Promise<ProductListResponse> {
  const baseUrl = import.meta.env.VITE_API_BASE_URL

  if (!baseUrl) {
    throw new Error('Laravel API URL is not configured.')
  }

  const url = new URL('/api/v1/products', baseUrl)

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== '') {
      url.searchParams.set(key, String(value))
    }
  })

  return fetchApiJson<ProductListResponse>(url)
}

export async function getProductFilters(): Promise<ProductFiltersResponse> {
  const baseUrl = import.meta.env.VITE_API_BASE_URL

  if (!baseUrl) {
    throw new Error('Laravel API URL is not configured.')
  }

  const url = new URL('/api/v1/product-filters', baseUrl)

  return fetchApiJson<ProductFiltersResponse>(url)
}