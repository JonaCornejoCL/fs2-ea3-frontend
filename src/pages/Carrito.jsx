import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { obtenerCarrito, guardarCarrito } from '../data/database'

function Carrito() {
  const [carrito, setCarrito] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    setCarrito(obtenerCarrito())
  }, [])

  const cambiarCantidad = (id, delta) => {
    const actualizado = carrito
      .map((item) => (item.id === id ? { ...item, cantidad: item.cantidad + delta } : item))
      .filter((item) => item.cantidad > 0)
    setCarrito(actualizado)
    guardarCarrito(actualizado)
  }

  const eliminarItem = (id) => {
    const actualizado = carrito.filter((item) => item.id !== id)
    setCarrito(actualizado)
    guardarCarrito(actualizado)
  }

  const vaciarCarrito = () => {
    setCarrito([])
    guardarCarrito([])
  }

  const total = carrito.reduce((acc, item) => acc + item.precio * item.cantidad, 0)

  return (
    <main className="container my-5">
      <h2 className="fw-bold mb-4" style={{ color: '#3E2723' }}>Tu Carrito de Cafeta TiPum</h2>

      <div className="table-responsive shadow-sm bg-white p-3 rounded">
        <table className="table align-middle mb-0">
          <thead className="table-dark">
            <tr>
              <th>Producto</th>
              <th>Precio</th>
              <th>Cantidad</th>
              <th>Subtotal</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {carrito.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-4 text-muted">
                  Tu carrito está vacío. <Link to="/productos">Ir a ver el menú</Link>
                </td>
              </tr>
            ) : (
              carrito.map((item) => (
                <tr key={item.id}>
                  <td>
                    <div className="d-flex align-items-center gap-3">
                      <img src={item.imagen} alt={item.nombre} style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '6px' }} />
                      <span className="fw-bold">{item.nombre}</span>
                    </div>
                  </td>
                  <td>${item.precio.toLocaleString('es-CL')}</td>
                  <td>
                    <button className="btn btn-sm btn-outline-secondary me-2" onClick={() => cambiarCantidad(item.id, -1)}>-</button>
                    <span className="fw-bold">{item.cantidad}</span>
                    <button className="btn btn-sm btn-outline-secondary ms-2" onClick={() => cambiarCantidad(item.id, 1)}>+</button>
                  </td>
                  <td className="fw-bold">${(item.precio * item.cantidad).toLocaleString('es-CL')}</td>
                  <td>
                    <button className="btn btn-danger btn-sm" onClick={() => eliminarItem(item.id)}>Eliminar</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="d-flex flex-wrap justify-content-between align-items-center mt-4 p-4 shadow-sm bg-white rounded">
        <h4 className="m-0">
          Total a Pagar: <span className="fw-bold text-success">${total.toLocaleString('es-CL')}</span>
        </h4>
        <div className="d-flex gap-2 mt-3 mt-md-0">
          <button className="btn btn-secondary" onClick={vaciarCarrito} disabled={carrito.length === 0}>
            Limpiar
          </button>
          <button className="btn btn-success btn-lg fw-bold" onClick={() => navigate('/checkout')} disabled={carrito.length === 0}>
            Comprar ahora
          </button>
        </div>
      </div>
    </main>
  )
}

export default Carrito