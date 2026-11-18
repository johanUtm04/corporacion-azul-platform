import { lazy, Suspense } from 'react'
import { Route, Routes } from 'react-router'

import MainLayout from './components/layout/MainLayout'
import BrandedLoader from './components/ui/BrandedLoader/BrandedLoader'

// Lazy-loaded pages
const HomePage = lazy(() => import('./pages/Home/HomePage'))
const ProductsPage = lazy(() => import('./pages/Products/ProductsPage'))
const BrandsPage = lazy(() => import('./pages/Brands/BrandsPage'))
const BranchesPage = lazy(() => import('./pages/Branches/BranchesPage'))
const SuccessStoriesPage = lazy(
  () => import('./pages/SuccessStories/SuccessStoriesPage')
)
const AboutUsPage = lazy(() => import('./pages/AboutUs/AboutUsPage'))
const ContactPage = lazy(() => import('./pages/Contact/ContactPage'))

function App() {
  return (
    <Suspense fallback={<BrandedLoader />}>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/productos" element={<ProductsPage />} />
          <Route path="/marcas" element={<BrandsPage />} />
          <Route path="/sucursales" element={<BranchesPage />} />
          <Route path="/casos-de-exito" element={<SuccessStoriesPage />} />
          <Route path="/nosotros" element={<AboutUsPage />} />
          <Route path="/contacto" element={<ContactPage />} />
          <Route path="*" element={<h1>404 - Página no encontrada</h1>} />
        </Route>
      </Routes>
    </Suspense>
  )
}

export default App