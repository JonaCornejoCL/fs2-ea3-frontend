import { useState, useEffect } from 'react'
import { useLocation, Link } from 'react-router-dom'
import Producto from '../components/Producto'
import api from '../api/client'

function Productos() {
  const [busqueda, setBusqueda] = useState('')
  const [productos, setProductos] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')
  const location = useLocation()
  const parametros = new URLSearchParams(location.search)
  const categoria = parametros.get('categoria')

  useEffect(() => {
    api.listarProductos()
      .then(setProductos)
      .catch((e) => setError(e.message))
      .finally(() => setCargando(false))
  }, [])

  const productosFiltrados = productos.filter((prod) => {
    const coincideCategoria = categoria ? prod.categoria === categoria : true
    const coincideBusqueda = prod.nombre.toLowerCase().includes(busqueda.toLowerCase())
    return coincideCategoria && coincideBusqueda
  })

  return (
    <main className="container my-5">
      <h1 className="text-center fw-bold mb-2" style={{ color: '#3E2723' }}>Nuestro Menú</h1>
      <p className="text-center text-muted mb-4">Conoce nuestras especialidades hechas con amor.</p>

      {categoria && (
        <div className="alert alert-warning d-flex justify-content-between align-items-center">
          <span>Categoría seleccionada: <strong>{categoria}</strong></span>
          <Link to="/productos" className="btn btn-sm btn-outline-dark">Ver todos</Link>
        </div>
      )}

      <div className="row justify-content-center mb-4">
        <div className="col-12 col-md-6">
          <input
            type="text"
            className="form-control"
            placeholder="🔍 Buscar producto en Cafeta TiPum..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>
      </div>

      {cargando && <div className="text-center text-muted my-4">Cargando productos...</div>}
      {error && <div className="alert alert-danger">Error al cargar productos: {error}</div>}

      <div className="row g-4">
        {productosFiltrados.map((prod) => (
          <div className="col-12 col-md-6 col-lg-4" key={prod.id}>
            <Producto
              id={prod.id}
              nombre={prod.nombre}
              precio={prod.precio}
              imagen={prod.imagen}
              stockInicial={prod.stock}
              enOferta={prod.enOferta}
              precioOferta={prod.precioOferta}
            />
          </div>
        ))}
      </div>
    </main>
  )
}

export default Productos
