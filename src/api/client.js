
const API_BASE_URL = '';

function getToken() {
  return localStorage.getItem('tokenTipum')
}

export async function apiFetch(path, options = {}) {
  const token = getToken()
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  }
  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  let response
  try {
    response = await fetch(`${API_BASE_URL}${path}`, { ...options, headers })
  } catch {
    throw new Error('No se pudo conectar con el servidor. Verifica que el backend esté corriendo.')
  }

  if (response.status === 204) {
    return null
  }

  const text = await response.text()
  const data = text ? JSON.parse(text) : null

  if (!response.ok) {
    const message = data?.message || data?.error || `Error ${response.status}`
    const err = new Error(message)
    err.status = response.status
    throw err
  }

  return data
}

export const api = {
  // Autenticación
  login: (payload) => apiFetch('/api/auth/login', { method: 'POST', body: JSON.stringify(payload) }),
  registro: (payload) => apiFetch('/api/auth/registro', { method: 'POST', body: JSON.stringify(payload) }),

  // Productos
  listarProductos: () => apiFetch('/api/v2/productos'),
  obtenerProducto: (id) => apiFetch(`/api/v2/productos/${id}`),
  crearProducto: (payload) => apiFetch('/api/v1/productos', { method: 'POST', body: JSON.stringify(payload) }),
  actualizarProducto: (id, payload) => apiFetch(`/api/v1/productos/${id}`, { method: 'PUT', body: JSON.stringify(payload) }),
  eliminarProducto: (id) => apiFetch(`/api/v1/productos/${id}`, { method: 'DELETE' }),
  stockCritico: () => apiFetch('/api/v2/productos/stock-critico'),

  // Órdenes
  listarOrdenes: () => apiFetch('/api/v1/ordenes'),
  obtenerOrden: (id) => apiFetch(`/api/v1/ordenes/${id}`),
  misOrdenes: () => apiFetch('/api/v1/ordenes/mis-ordenes'),
  crearOrden: (payload) => apiFetch('/api/v1/ordenes', { method: 'POST', body: JSON.stringify(payload) }),
  actualizarEstadoOrden: (id, estado) => apiFetch(`/api/v1/ordenes/${id}/estado`, { method: 'PUT', body: JSON.stringify({ estado }) }),

  // Usuarios
  listarUsuarios: () => apiFetch('/api/v1/usuarios'),
  crearUsuario: (payload) => apiFetch('/api/v1/usuarios', { method: 'POST', body: JSON.stringify(payload) }),
  actualizarUsuario: (id, payload) => apiFetch(`/api/v1/usuarios/${id}`, { method: 'PUT', body: JSON.stringify(payload) }),
  eliminarUsuario: (id) => apiFetch(`/api/v1/usuarios/${id}`, { method: 'DELETE' }),
}

export default api
