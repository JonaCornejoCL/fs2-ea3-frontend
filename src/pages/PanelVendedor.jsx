import { useState, useEffect } from 'react'
import api from '../api/client'

// Panel exclusivo del rol VENDEDOR: puede ver productos (y stock crítico) y órdenes (solo lectura).
function PanelVendedor() {
  const [pestana, setPestana] = useState('productos')
  const [productos, setProductos] = useState([])
  const [stockCritico, setStockCritico] = useState([])
  const [ordenes, setOrdenes] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    Promise.all([api.listarProductos(), api.stockCritico(), api.listarOrdenes()])
      .then(([prods, criticos, ords]) => {
        setProductos(prods)
        setStockCritico(criticos)
        setOrdenes(ords)
      })
      .catch((e) => setError(e.message))
      .finally(() => setCargando(false))
  }, [])

  if (cargando) {
    return <main className="container my-5 text-center">Cargando información del vendedor...</main>
  }

  if (error) {
    return (
      <main className="container my-5">
        <div className="alert alert-danger">Error al cargar datos: {error}</div>
      </main>
    )
  }

  return (
    <main className="container my-5">
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 pb-3 border-bottom">
        <h2 className="fw-bold mb-0" style={{ color: '#3E2723' }}>🧑‍💼 Panel Vendedor - Cafeta TiPum</h2>
        <div className="d-flex gap-2 mt-2 mt-md-0">
          <button className={`btn ${pestana === 'productos' ? 'btn-dark' : 'btn-outline-dark'}`} onClick={() => setPestana('productos')}>
            Productos ({productos.length})
          </button>
          <button className={`btn ${pestana === 'ordenes' ? 'btn-dark' : 'btn-outline-dark'}`} onClick={() => setPestana('ordenes')}>
            Órdenes ({ordenes.length})
          </button>
        </div>
      </div>

      {pestana === 'productos' && (
        <>
          <div className="alert alert-warning">
            ⚠️ Productos con stock crítico: <strong>{stockCritico.length}</strong> (stock ≤ stock crítico)
          </div>
          <div className="table-responsive">
            <table className="table align-middle">
              <thead className="table-dark">
                <tr>
                  <th>Nombre</th>
                  <th>Categoría</th>
                  <th>Precio</th>
                  <th>Stock</th>
                  <th>Stock Crítico</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {productos.map((p) => (
                  <tr key={p.id}>
                    <td className="fw-bold">{p.nombre}</td>
                    <td>{p.categoria}</td>
                    <td>${p.precio?.toLocaleString('es-CL')}</td>
                    <td>{p.stock} u.</td>
                    <td>{p.stockCritico} u.</td>
                    <td>
                      <span className={`badge ${p.stock <= p.stockCritico ? 'bg-danger' : 'bg-success'}`}>
                        {p.stock <= p.stockCritico ? 'Crítico' : 'Normal'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {pestana === 'ordenes' && (
        <div className="table-responsive">
          <table className="table table-hover align-middle">
            <thead className="table-dark">
              <tr>
                <th>#</th>
                <th>Código</th>
                <th>Cliente</th>
                <th>Fecha</th>
                <th>Monto</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {ordenes.length === 0 ? (
                <tr><td colSpan="6" className="text-center text-muted py-4">No hay órdenes registradas.</td></tr>
              ) : (
                ordenes.map((o) => (
                  <tr key={o.id}>
                    <td>#{o.id}</td>
                    <td>{o.codigo}</td>
                    <td>{o.cliente}</td>
                    <td>{o.fecha ? new Date(o.fecha).toLocaleString('es-CL') : '-'}</td>
                    <td className="fw-bold">${o.monto?.toLocaleString('es-CL')}</td>
                    <td>
                      <span className={`badge ${o.estado === 'Completado' ? 'bg-success' : o.estado === 'Rechazado' ? 'bg-danger' : 'bg-warning text-dark'}`}>
                        {o.estado}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </main>
  )
}

export default PanelVendedor
