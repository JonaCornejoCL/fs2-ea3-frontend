import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { agregarItemAlCarrito } from '../data/database'
import api from '../api/client'

function DetalleProducto() {
  const { id } = useParams()
  const [cantidad, setCantidad] = useState(1)
  const [mensaje, setMensaje] = useState('')
  const [producto, setProducto] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    api.obtenerProducto(id)
      .then(setProducto)
      .catch((e) => setError(e.message))
      .finally(() => setCargando(false))
  }, [id])

  if (cargando) {
    return <main className="container my-5 text-center">Cargando producto...</main>
  }

  if (error || !producto) {
    return (
      <main className="container my-5 text-center">
        <h2>Producto no encontrado (ID: {id})</h2>
        {error && <p className="text-muted">{error}</p>}
        <Link to="/productos" className="btn btn-tipum mt-3">Volver al menú</Link>
      </main>
    )
  }

  const handleAgregar = () => {
    agregarItemAlCarrito(producto, cantidad)
    setMensaje(`¡${cantidad}x ${producto.nombre} añadido(s) al carrito!`)
  }

  return (
    <main className="container my-5">
      <nav aria-label="breadcrumb" className="mb-4">
        <ol className="breadcrumb">
          <li className="breadcrumb-item"><Link to="/" className="text-decoration-none text-muted">Inicio</Link></li>
          <li className="breadcrumb-item"><Link to="/productos" className="text-decoration-none text-muted">Productos</Link></li>
          <li className="breadcrumb-item active fw-bold">{producto.nombre}</li>
        </ol>
      </nav>

      <section className="bg-white p-4 rounded shadow-sm border">
        <div className="row align-items-center">
          <div className="col-md-6 mb-4 mb-md-0 text-center">
            <img
              src={producto.imagen}
              alt={producto.nombre}
              className="img-fluid rounded shadow-sm"
              style={{ maxHeight: '380px', objectFit: 'cover' }}
            />
          </div>
          <div className="col-md-6 px-lg-5">
            <span className="badge bg-secondary mb-2">Producto seleccionado: {id}</span>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h2 className="fw-bold mb-0" style={{ color: '#3E2723' }}>{producto.nombre}</h2>
              <h3 className="fw-bold text-danger mb-0">${producto.precio?.toLocaleString('es-CL')}</h3>
            </div>
            <p className="text-muted mb-4 fs-5">{producto.descripcion}</p>

            {producto.enOferta && (
              <p className="text-success fw-bold">🎉 En oferta: ${producto.precioOferta?.toLocaleString('es-CL')}</p>
            )}

            <div className="d-flex align-items-center gap-3 mb-4">
              <label htmlFor="cantidadDetalle" className="fw-bold fs-5">Cantidad:</label>
              <select
                id="cantidadDetalle"
                className="form-select w-auto fw-bold"
                value={cantidad}
                onChange={(e) => setCantidad(Number(e.target.value))}
              >
                {[1, 2, 3, 4, 5].map((num) => (
                  <option key={num} value={num}>{num}</option>
                ))}
              </select>
            </div>

            <button onClick={handleAgregar} className="btn btn-tipum w-100 py-3 fs-5 text-uppercase">
              Añadir al carrito
            </button>

            {mensaje && <div className="alert alert-success mt-3 text-center fw-bold">{mensaje}</div>}
          </div>
        </div>
      </section>
    </main>
  )
}

export default DetalleProducto
