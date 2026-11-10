
import { Route, Routes } from 'react-router'
import MainLayout from './components/layout/MainLayout'

import HomePage from './pages/Home/HomePage'
import ProductsPage from './pages/Products/ProductsPage'
import BrandsPage from './pages/Brands/BrandsPage'
import BranchesPage from './pages/Branches/BranchesPage'
import SuccessStoriesPage from './pages/SuccessStories/SuccessStoriesPage'
import AboutUsPage from './pages/AboutUs/AboutUsPage'
import ContactPage from './pages/Contact/ContactPage'

function App() {
  return (
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
  )
}

export default App
