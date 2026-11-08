import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/client'

// Historial de compras del cliente autenticado.
function MisPedidos() {
  const [ordenes, setOrdenes] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    api.misOrdenes()
      .then(setOrdenes)
      .catch((e) => setError(e.message))
      .finally(() => setCargando(false))
  }, [])

  if (cargando) {
    return <main className="container my-5 text-center">Cargando tus pedidos...</main>
  }

  if (error) {
    return (
      <main className="container my-5">
        <div className="alert alert-danger">Error al cargar tus pedidos: {error}</div>
      </main>
    )
  }

  return (
    <main className="container my-5">
      <h2 className="fw-bold mb-4" style={{ color: '#3E2723' }}>📦 Mis Pedidos</h2>

      {ordenes.length === 0 ? (
        <div className="alert alert-info text-center">
          Aún no tienes pedidos. <Link to="/productos" className="fw-bold">¡Haz tu primer pedido!</Link>
        </div>
      ) : (
        ordenes.map((o) => (
          <div className="card shadow-sm border-0 mb-4" key={o.id}>
            <div className="card-header bg-white d-flex flex-wrap justify-content-between align-items-center">
              <div>
                <strong>Orden #{o.id}</strong> · <span className="text-muted">{o.codigo}</span>
              </div>
              <div className="d-flex align-items-center gap-2">
                <span className="text-muted">{o.fecha ? new Date(o.fecha).toLocaleString('es-CL') : '-'}</span>
                <span className={`badge ${o.estado === 'Completado' ? 'bg-success' : o.estado === 'Rechazado' ? 'bg-danger' : 'bg-warning text-dark'}`}>
                  {o.estado}
                </span>
              </div>
            </div>
            <div className="card-body">
              <p className="mb-2 text-muted">Dirección de entrega: {o.direccion || '-'}</p>
              <div className="table-responsive">
                <table className="table table-sm align-middle mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>Producto</th>
                      <th>Precio</th>
                      <th>Cantidad</th>
                      <th>Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {o.items?.map((it) => (
                      <tr key={it.id}>
                        <td>{it.nombre}</td>
                        <td>${it.precio?.toLocaleString('es-CL')}</td>
                        <td>{it.cantidad}</td>
                        <td>${(it.precio * it.cantidad)?.toLocaleString('es-CL')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="text-end mt-2 fw-bold fs-5">Total: ${o.monto?.toLocaleString('es-CL')}</div>
            </div>
          </div>
        ))
      )}
    </main>
  )
}

export default MisPedidos
