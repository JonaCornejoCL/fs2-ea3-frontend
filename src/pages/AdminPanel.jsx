import { useState, useEffect } from 'react'
import api from '../api/client'

const ROLES = ['Cliente', 'Vendedor', 'Administrador']
const CATEGORIAS = [
  { id: 'cafe', nombre: 'Cafetería' },
  { id: 'pasteleria', nombre: 'Pastelería' },
  { id: 'merchandising', nombre: 'Merchandising' }
]

function AdminPanel() {
  const [pestana, setPestana] = useState('dashboard')
  const [productos, setProductos] = useState([])
  const [usuarios, setUsuarios] = useState([])
  const [ordenes, setOrdenes] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')
  const [soloCriticos, setSoloCriticos] = useState(false)

  // Formulario producto (crear/editar)
  const [prodForm, setProdForm] = useState({
    id: null, nombre: '', categoria: 'cafe', precio: '', stock: '', stockCritico: 5, enOferta: false, precioOferta: '', imagen: '', descripcion: ''
  })
  const [msgProd, setMsgProd] = useState('')

  // Formulario usuario
  const [userForm, setUserForm] = useState({ run: '', nombre: '', apellidos: '', correo: '', password: '', comuna: '', rol: 'Cliente' })
  const [msgUser, setMsgUser] = useState('')

  const cargarDatos = () => {
    setCargando(true)
    Promise.all([api.listarProductos(), api.listarUsuarios(), api.listarOrdenes()])
      .then(([prods, users, ords]) => {
        setProductos(prods)
        setUsuarios(users)
        setOrdenes(ords)
      })
      .catch((e) => setError(e.message))
      .finally(() => setCargando(false))
  }

  useEffect(() => {
    cargarDatos()
  }, [])

  // ===== Productos =====
  const handleGuardarProducto = async (e) => {
    e.preventDefault()
    setMsgProd('')
    const payload = {
      nombre: prodForm.nombre,
      categoria: prodForm.categoria,
      precio: Number(prodForm.precio),
      stock: Number(prodForm.stock),
      stockCritico: Number(prodForm.stockCritico || 5),
      enOferta: prodForm.enOferta,
      precioOferta: prodForm.precioOferta ? Number(prodForm.precioOferta) : null,
      imagen: prodForm.imagen || null,
      descripcion: prodForm.descripcion || null
    }
    try {
      if (prodForm.id) {
        await api.actualizarProducto(prodForm.id, payload)
        setMsgProd('¡Producto actualizado correctamente!')
      } else {
        await api.crearProducto(payload)
        setMsgProd('¡Producto creado correctamente!')
      }
      setProdForm({ id: null, nombre: '', categoria: 'cafe', precio: '', stock: '', stockCritico: 5, enOferta: false, precioOferta: '', imagen: '', descripcion: '' })
      cargarDatos()
    } catch (err) {
      setMsgProd(err.message || 'Error al guardar el producto')
    }
  }

  const handleEditarProducto = (p) => {
    setProdForm({
      id: p.id, nombre: p.nombre, categoria: p.categoria, precio: p.precio, stock: p.stock,
      stockCritico: p.stockCritico, enOferta: p.enOferta, precioOferta: p.precioOferta || '',
      imagen: p.imagen || '', descripcion: p.descripcion || ''
    })
    setPestana('productos')
  }

  const handleEliminarProducto = async (id) => {
    if (!window.confirm('¿Eliminar este producto?')) return
    try {
      await api.eliminarProducto(id)
      cargarDatos()
    } catch (err) {
      setMsgProd(err.message)
    }
  }

  // ===== Usuarios =====
  const handleGuardarUsuario = async (e) => {
    e.preventDefault()
    setMsgUser('')
    try {
      await api.crearUsuario({
        run: userForm.run,
        nombre: userForm.nombre,
        apellidos: userForm.apellidos,
        correo: userForm.correo,
        password: userForm.password,
        comuna: userForm.comuna,
        rol: userForm.rol
      })
      setMsgUser('¡Usuario creado correctamente!')
      setUserForm({ run: '', nombre: '', apellidos: '', correo: '', password: '', comuna: '', rol: 'Cliente' })
      cargarDatos()
    } catch (err) {
      setMsgUser(err.message || 'Error al crear el usuario')
    }
  }

  const handleEliminarUsuario = async (id) => {
    if (!window.confirm('¿Eliminar este usuario?')) return
    try {
      await api.eliminarUsuario(id)
      cargarDatos()
    } catch (err) {
      setMsgUser(err.message)
    }
  }

  // ===== Órdenes =====
  const handleCambiarEstado = async (id, estado) => {
    try {
      await api.actualizarEstadoOrden(id, estado)
      cargarDatos()
    } catch (err) {
      setError(err.message)
    }
  }

  if (cargando) {
    return <main className="container my-5 text-center">Cargando panel de administración...</main>
  }

  if (error) {
    return (
      <main className="container my-5">
        <div className="alert alert-danger">Error: {error}</div>
        <button className="btn btn-outline-dark" onClick={cargarDatos}>Reintentar</button>
      </main>
    )
  }

  const productosMostrados = soloCriticos ? productos.filter((p) => p.stock <= (p.stockCritico || 5)) : productos

  return (
    <main className="container my-5">
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 pb-3 border-bottom">
        <h2 className="fw-bold mb-0" style={{ color: '#3E2723' }}>⚙️ Panel Administrador - Cafeta TiPum</h2>
        <div className="d-flex flex-wrap gap-2 mt-2 mt-md-0">
          <button className={`btn ${pestana === 'dashboard' ? 'btn-dark' : 'btn-outline-dark'}`} onClick={() => setPestana('dashboard')}>Dashboard</button>
          <button className={`btn ${pestana === 'productos' ? 'btn-dark' : 'btn-outline-dark'}`} onClick={() => setPestana('productos')}>Productos ({productos.length})</button>
          <button className={`btn ${pestana === 'ordenes' ? 'btn-dark' : 'btn-outline-dark'}`} onClick={() => setPestana('ordenes')}>Órdenes ({ordenes.length})</button>
          <button className={`btn ${pestana === 'usuarios' ? 'btn-dark' : 'btn-outline-dark'}`} onClick={() => setPestana('usuarios')}>Usuarios ({usuarios.length})</button>
        </div>
      </div>

      {/* DASHBOARD */}
      {pestana === 'dashboard' && (
        <section>
          <div className="row g-4 mb-5">
            <div className="col-md-3">
              <div className="card shadow-sm border-0 bg-primary text-white p-3">
                <h6 className="text-uppercase fw-bold">Órdenes</h6>
                <h3 className="mb-0">{ordenes.length}</h3>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card shadow-sm border-0 bg-success text-white p-3">
                <h6 className="text-uppercase fw-bold">Productos</h6>
                <h3 className="mb-0">{productos.length}</h3>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card shadow-sm border-0 bg-warning text-dark p-3">
                <h6 className="text-uppercase fw-bold">Usuarios</h6>
                <h3 className="mb-0">{usuarios.length}</h3>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card shadow-sm border-0 bg-danger text-white p-3">
                <h6 className="text-uppercase fw-bold">Stock Crítico</h6>
                <h3 className="mb-0">{productos.filter((p) => p.stock <= (p.stockCritico || 5)).length}</h3>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* PRODUCTOS */}
      {pestana === 'productos' && (
        <div className="row g-4">
          <div className="col-lg-4">
            <div className="card shadow-sm border-0 p-4">
              <h5 className="fw-bold mb-3">{prodForm.id ? 'Editar Producto' : 'Nuevo Producto'}</h5>
              <form onSubmit={handleGuardarProducto}>
                <div className="mb-2">
                  <label className="form-label fw-bold">Nombre:</label>
                  <input type="text" className="form-control" required value={prodForm.nombre} onChange={(e) => setProdForm({ ...prodForm, nombre: e.target.value })} />
                </div>
                <div className="mb-2">
                  <label className="form-label fw-bold">Categoría:</label>
                  <select className="form-select" value={prodForm.categoria} onChange={(e) => setProdForm({ ...prodForm, categoria: e.target.value })}>
                    {CATEGORIAS.map((c) => <option key={c.id} value={c.id}>{c.nombre}</option>)}
                  </select>
                </div>
                <div className="row">
                  <div className="col-6 mb-2">
                    <label className="form-label fw-bold">Precio ($):</label>
                    <input type="number" className="form-control" required min="0" value={prodForm.precio} onChange={(e) => setProdForm({ ...prodForm, precio: e.target.value })} />
                  </div>
                  <div className="col-6 mb-2">
                    <label className="form-label fw-bold">Stock:</label>
                    <input type="number" className="form-control" required min="0" value={prodForm.stock} onChange={(e) => setProdForm({ ...prodForm, stock: e.target.value })} />
                  </div>
                </div>
                <div className="mb-2">
                  <label className="form-label fw-bold">Stock Crítico:</label>
                  <input type="number" className="form-control" min="0" value={prodForm.stockCritico} onChange={(e) => setProdForm({ ...prodForm, stockCritico: e.target.value })} />
                </div>
                <div className="form-check my-2">
                  <input type="checkbox" className="form-check-input" id="chkOferta" checked={prodForm.enOferta} onChange={(e) => setProdForm({ ...prodForm, enOferta: e.target.checked })} />
                  <label className="form-check-label" htmlFor="chkOferta">Producto en Oferta</label>
                </div>
                {prodForm.enOferta && (
                  <div className="mb-2">
                    <label className="form-label fw-bold">Precio Oferta ($):</label>
                    <input type="number" className="form-control" min="0" value={prodForm.precioOferta} onChange={(e) => setProdForm({ ...prodForm, precioOferta: e.target.value })} />
                  </div>
                )}
                <div className="mb-2">
                  <label className="form-label fw-bold">URL Imagen (opcional):</label>
                  <input type="text" className="form-control" value={prodForm.imagen} onChange={(e) => setProdForm({ ...prodForm, imagen: e.target.value })} />
                </div>
                <div className="mb-2">
                  <label className="form-label fw-bold">Descripción (opcional):</label>
                  <textarea className="form-control" rows="2" value={prodForm.descripcion} onChange={(e) => setProdForm({ ...prodForm, descripcion: e.target.value })} />
                </div>
                <button type="submit" className="btn btn-dark w-100 mt-2">{prodForm.id ? 'Actualizar Producto' : 'Guardar Producto'}</button>
                {prodForm.id && (
                  <button type="button" className="btn btn-outline-secondary w-100 mt-2" onClick={() => setProdForm({ id: null, nombre: '', categoria: 'cafe', precio: '', stock: '', stockCritico: 5, enOferta: false, precioOferta: '', imagen: '', descripcion: '' })}>Cancelar edición</button>
                )}
                {msgProd && <p className="text-success fw-bold mt-2 mb-0 small">{msgProd}</p>}
              </form>
            </div>
          </div>

          <div className="col-lg-8">
            <div className="card shadow-sm border-0 p-4">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="fw-bold mb-0">Inventario de Productos</h5>
                <button className={`btn btn-sm ${soloCriticos ? 'btn-danger' : 'btn-outline-danger'}`} onClick={() => setSoloCriticos(!soloCriticos)}>
                  {soloCriticos ? 'Ver Todos' : '⚠️ Filtrar Stock Crítico'}
                </button>
              </div>
              <div className="table-responsive">
                <table className="table align-middle">
                  <thead className="table-dark">
                    <tr>
                      <th>Nombre</th>
                      <th>Categoría</th>
                      <th>Precio</th>
                      <th>Stock</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {productosMostrados.map((p) => (
                      <tr key={p.id}>
                        <td className="fw-bold">{p.nombre}</td>
                        <td>{p.categoria}</td>
                        <td>${p.precio?.toLocaleString('es-CL')}</td>
                        <td>
                          <span className={`badge ${p.stock <= (p.stockCritico || 5) ? 'bg-danger' : 'bg-success'}`}>{p.stock} u.</span>
                        </td>
                        <td>
                          <button className="btn btn-warning btn-sm me-1" onClick={() => handleEditarProducto(p)}>Editar</button>
                          <button className="btn btn-danger btn-sm" onClick={() => handleEliminarProducto(p.id)}>Eliminar</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ÓRDENES */}
      {pestana === 'ordenes' && (
        <div className="card shadow-sm border-0 p-4">
          <h5 className="fw-bold mb-3">Listado de Órdenes y Boletas</h5>
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
                  <th>Cambiar estado</th>
                </tr>
              </thead>
              <tbody>
                {ordenes.map((o) => (
                  <tr key={o.id}>
                    <td>#{o.id}</td>
                    <td>{o.codigo}</td>
                    <td>{o.cliente}</td>
                    <td>{o.fecha ? new Date(o.fecha).toLocaleString('es-CL') : '-'}</td>
                    <td className="fw-bold">${o.monto?.toLocaleString('es-CL')}</td>
                    <td>
                      <span className={`badge ${o.estado === 'Completado' ? 'bg-success' : o.estado === 'Rechazado' ? 'bg-danger' : 'bg-warning text-dark'}`}>{o.estado}</span>
                    </td>
                    <td>
                      <select className="form-select form-select-sm" value={o.estado} onChange={(e) => handleCambiarEstado(o.id, e.target.value)}>
                        <option value="Pendiente">Pendiente</option>
                        <option value="Completado">Completado</option>
                        <option value="Rechazado">Rechazado</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* USUARIOS */}
      {pestana === 'usuarios' && (
        <div className="row g-4">
          <div className="col-lg-4">
            <div className="card shadow-sm border-0 p-4">
              <h5 className="fw-bold mb-3">Agregar Usuario</h5>
              <form onSubmit={handleGuardarUsuario}>
                <div className="mb-2">
                  <label className="form-label fw-bold">RUN:</label>
                  <input type="text" className="form-control" required value={userForm.run} onChange={(e) => setUserForm({ ...userForm, run: e.target.value })} />
                </div>
                <div className="mb-2">
                  <label className="form-label fw-bold">Nombre:</label>
                  <input type="text" className="form-control" required value={userForm.nombre} onChange={(e) => setUserForm({ ...userForm, nombre: e.target.value })} />
                </div>
                <div className="mb-2">
                  <label className="form-label fw-bold">Apellidos:</label>
                  <input type="text" className="form-control" required value={userForm.apellidos} onChange={(e) => setUserForm({ ...userForm, apellidos: e.target.value })} />
                </div>
                <div className="mb-2">
                  <label className="form-label fw-bold">Correo:</label>
                  <input type="email" className="form-control" required value={userForm.correo} onChange={(e) => setUserForm({ ...userForm, correo: e.target.value })} />
                </div>
                <div className="mb-2">
                  <label className="form-label fw-bold">Contraseña:</label>
                  <input type="password" className="form-control" required minLength="4" value={userForm.password} onChange={(e) => setUserForm({ ...userForm, password: e.target.value })} />
                </div>
                <div className="mb-3">
                  <label className="form-label fw-bold">Rol:</label>
                  <select className="form-select" value={userForm.rol} onChange={(e) => setUserForm({ ...userForm, rol: e.target.value })}>
                    {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
                <button type="submit" className="btn btn-success w-100">Guardar Usuario</button>
                {msgUser && <p className="text-success fw-bold mt-2 mb-0 small">{msgUser}</p>}
              </form>
            </div>
          </div>

          <div className="col-lg-8">
            <div className="card shadow-sm border-0 p-4">
              <h5 className="fw-bold mb-3">Usuarios Registrados</h5>
              <div className="table-responsive">
                <table className="table align-middle">
                  <thead className="table-dark">
                    <tr>
                      <th>RUN</th>
                      <th>Nombre</th>
                      <th>Correo</th>
                      <th>Rol</th>
                      <th>Acción</th>
                    </tr>
                  </thead>
                  <tbody>
                    {usuarios.map((u) => (
                      <tr key={u.id}>
                        <td>{u.run}</td>
                        <td>{u.nombre} {u.apellidos}</td>
                        <td>{u.correo}</td>
                        <td>
                          <span className={`badge ${u.rol === 'ADMIN' ? 'bg-danger' : u.rol === 'VENDEDOR' ? 'bg-warning text-dark' : 'bg-primary'}`}>{u.rolEtiqueta || u.rol}</span>
                        </td>
                        <td>
                          <button className="btn btn-danger btn-sm" onClick={() => handleEliminarUsuario(u.id)}>Eliminar</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}

export default AdminPanel
