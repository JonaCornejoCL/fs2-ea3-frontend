import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { obtenerCarrito, guardarCarrito, DATOS_GEOGRAFICOS } from '../data/database'
import { useAuth } from '../context/AuthContext'
import api from '../api/client'

function Checkout() {
  const { usuario } = useAuth()
  const navigate = useNavigate()
  const [carrito, setCarrito] = useState([])
  const [cargandoPago, setCargandoPago] = useState(false)
  const [estadoPago, setEstadoPago] = useState(null) // null | 'exito' | 'error'
  const [ordenGenerada, setOrdenGenerada] = useState(null)
  const [mensaje, setMensaje] = useState('')

  const [envio, setEnvio] = useState({
    calle: '',
    depto: '',
    region: 'Región de Valparaíso',
    comuna: 'Quilpué',
    indicaciones: ''
  })

  useEffect(() => {
    setCarrito(obtenerCarrito())
  }, [])

  const total = carrito.reduce((acc, item) => acc + item.precio * item.cantidad, 0)
  const comunas = DATOS_GEOGRAFICOS[envio.region] || []

  const procesarPago = async (simularFallo = false) => {
    // Simulación de pasarela de pago con error (no crea orden en el backend)
    if (simularFallo) {
      setOrdenGenerada(null)
      setEstadoPago('error')
      return
    }

    if (!usuario) {
      navigate('/login')
      return
    }

    if (!envio.calle) {
      setMensaje('Por favor completa la Calle y número de entrega.')
      return
    }

    setCargandoPago(true)
    setMensaje('')
    try {
      const orden = await api.crearOrden({
        items: carrito.map((item) => ({ productoId: item.id, cantidad: item.cantidad })),
        direccion: `${envio.calle} ${envio.depto}, ${envio.comuna}, ${envio.region}`
      })
      guardarCarrito([])
      setOrdenGenerada(orden)
      setEstadoPago('exito')
    } catch (err) {
      setMensaje(err.message || 'Error al procesar el pago')
      setEstadoPago('error')
    } finally {
      setCargandoPago(false)
    }
  }

  // Vista de compra exitosa
  if (estadoPago === 'exito' && ordenGenerada) {
    return (
      <main className="container my-5">
        <div className="bg-white p-4 p-md-5 rounded shadow-sm border mx-auto" style={{ maxWidth: '800px' }}>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h3 className="fw-bold text-success">✅ ¡Se ha registrado tu pedido! Nro #{ordenGenerada.id}</h3>
            <span className="badge bg-dark">Código: {ordenGenerada.codigo}</span>
          </div>

          <p className="text-muted mb-1">Estado: <strong>{ordenGenerada.estado}</strong></p>
          <p className="mb-1"><strong>Cliente:</strong> {ordenGenerada.cliente} ({ordenGenerada.correo})</p>
          <p className="mb-3"><strong>Dirección:</strong> {ordenGenerada.direccion}</p>

          <div className="table-responsive mt-3">
            <table className="table align-middle">
              <thead className="table-light">
                <tr>
                  <th>Producto</th>
                  <th>Precio</th>
                  <th>Cantidad</th>
                  <th>Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {ordenGenerada.items?.map((it) => (
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

          <div className="alert alert-secondary text-center fs-4 fw-bold mt-3">
            Total a pagar: ${ordenGenerada.monto?.toLocaleString('es-CL')}
          </div>

          <div className="d-flex justify-content-center gap-3 mt-4">
            <button className="btn btn-danger" onClick={() => window.print()}>Imprimir boleta en PDF</button>
            <Link to="/productos" className="btn btn-primary">Seguir comprando</Link>
            {usuario?.rol === 'CLIENTE' && (
              <Link to="/mis-pedidos" className="btn btn-outline-dark">Ver mis pedidos</Link>
            )}
          </div>
        </div>
      </main>
    )
  }

  // Vista de error de pago
  if (estadoPago === 'error') {
    return (
      <main className="container my-5">
        <div className="bg-white p-4 p-md-5 rounded shadow-sm border mx-auto text-center" style={{ maxWidth: '700px' }}>
          <h3 className="fw-bold text-danger">❌ No se pudo procesar el pago</h3>
          <p className="text-muted mt-2">{mensaje || 'La pasarela de pago rechazó la transacción.'}</p>
          <div className="d-flex justify-content-center gap-3 mt-4">
            <button className="btn btn-success fw-bold px-4 py-2" onClick={() => setEstadoPago(null)}>
              Volver a intentar
            </button>
            <Link to="/productos" className="btn btn-outline-dark px-4 py-2">Seguir comprando</Link>
          </div>
        </div>
      </main>
    )
  }

  // Vista principal del checkout
  return (
    <main className="container my-5">
      <div className="bg-white p-4 p-md-5 rounded shadow-sm border mx-auto" style={{ maxWidth: '850px' }}>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 className="fw-bold mb-0">Carrito de compra - Checkout</h2>
            <small className="text-muted">Completa la información para el envío de tu pedido TiPum</small>
          </div>
          <span className="btn btn-primary fw-bold fs-5">Total a pagar: ${total.toLocaleString('es-CL')}</span>
        </div>

        <h5 className="fw-bold mb-3">Información del cliente</h5>
        {usuario ? (
          <div className="alert alert-light border mb-4">
            <p className="mb-0">
              <strong>Cliente:</strong> {usuario.nombre} {usuario.apellidos} ({usuario.correo})
            </p>
          </div>
        ) : (
          <div className="alert alert-warning mb-4">
            Debes <Link to="/login" className="fw-bold">iniciar sesión</Link> para completar tu compra.
          </div>
        )}

        <h5 className="fw-bold mb-3">Dirección de entrega de los productos</h5>
        <div className="row g-3 mb-4">
          <div className="col-md-8">
            <label className="form-label">Calle y número*</label>
            <input type="text" className="form-control" placeholder="Ej: Av. Los Carrera 450" value={envio.calle} onChange={(e) => setEnvio({ ...envio, calle: e.target.value })} />
          </div>
          <div className="col-md-4">
            <label className="form-label">Departamento (opcional)</label>
            <input type="text" className="form-control" placeholder="Ej: Depto 603" value={envio.depto} onChange={(e) => setEnvio({ ...envio, depto: e.target.value })} />
          </div>
          <div className="col-md-6">
            <label className="form-label">Región*</label>
            <select className="form-select" value={envio.region} onChange={(e) => setEnvio({ ...envio, region: e.target.value, comuna: DATOS_GEOGRAFICOS[e.target.value][0] })}>
              {Object.keys(DATOS_GEOGRAFICOS).map((r) => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
          <div className="col-md-6">
            <label className="form-label">Comuna*</label>
            <select className="form-select" value={envio.comuna} onChange={(e) => setEnvio({ ...envio, comuna: e.target.value })}>
              {comunas.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="col-12">
            <label className="form-label">Indicaciones para la entrega (opcional)</label>
            <textarea className="form-control" rows="2" placeholder="Ej: Conserjería, timbre..." value={envio.indicaciones} onChange={(e) => setEnvio({ ...envio, indicaciones: e.target.value })} />
          </div>
        </div>

        {mensaje && <div className="alert alert-danger">{mensaje}</div>}

        <div className="d-flex justify-content-end gap-3">
          <button className="btn btn-outline-danger" onClick={() => procesarPago(true)}>
            Simular Pago con Error
          </button>
          <button
            className="btn btn-success btn-lg fw-bold"
            onClick={() => procesarPago(false)}
            disabled={cargandoPago || carrito.length === 0}
          >
            {cargandoPago ? 'Procesando...' : `Pagar ahora $${total.toLocaleString('es-CL')}`}
          </button>
        </div>
      </div>
    </main>
  )
}

export default Checkout
