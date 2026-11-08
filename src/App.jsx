import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import RutaProtegida from './components/RutaProtegida'
import Inicio from './pages/Inicio'
import Productos from './pages/Productos'
import DetalleProducto from './pages/DetalleProducto'
import Categorias from './pages/Categorias'
import Ofertas from './pages/Ofertas'
import Nosotros from './pages/Nosotros'
import Blogs from './pages/Blogs'
import Contacto from './pages/Contacto'
import Login from './pages/Login'
import Registro from './pages/Registro'
import Carrito from './pages/Carrito'
import Checkout from './pages/Checkout'
import MisPedidos from './pages/MisPedidos'
import PanelVendedor from './pages/PanelVendedor'
import AdminPanel from './pages/AdminPanel'

function App() {
  return (
    <BrowserRouter>
      <div className="d-flex flex-column min-vh-100">
        <Navbar />
        <Routes>
          {/* Tienda (acceso público) */}
          <Route path="/" element={<Inicio />} />
          <Route path="/productos" element={<Productos />} />
          <Route path="/producto/:id" element={<DetalleProducto />} />
          <Route path="/categorias" element={<Categorias />} />
          <Route path="/ofertas" element={<Ofertas />} />
          <Route path="/nosotros" element={<Nosotros />} />
          <Route path="/blogs" element={<Blogs />} />
          <Route path="/contacto" element={<Contacto />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Registro />} />
          <Route path="/carrito" element={<Carrito />} />
          <Route path="/checkout" element={<Checkout />} />

          {/* Rutas protegidas por rol */}
          <Route
            path="/mis-pedidos"
            element={
              <RutaProtegida roles={['CLIENTE', 'ADMIN']}>
                <MisPedidos />
              </RutaProtegida>
            }
          />
          <Route
            path="/vendedor"
            element={
              <RutaProtegida roles={['VENDEDOR']}>
                <PanelVendedor />
              </RutaProtegida>
            }
          />
          <Route
            path="/admin"
            element={
              <RutaProtegida roles={['ADMIN']}>
                <AdminPanel />
              </RutaProtegida>
            }
          />
        </Routes>
        <Footer />
      </div>
    </BrowserRouter>
  )
}

export default App
