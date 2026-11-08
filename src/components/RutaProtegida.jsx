import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

// Protege rutas: exige sesión iniciada y, opcionalmente, un rol específico.
function RutaProtegida({ children, roles = [] }) {
  const { usuario, cargando } = useAuth()

  if (cargando) {
    return (
      <main className="container my-5 text-center">
        <div className="spinner-border text-danger" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </main>
    )
  }

  if (!usuario) {
    return <Navigate to="/login" replace />
  }

  if (roles.length > 0 && !roles.includes(usuario.rol)) {
    return (
      <main className="container my-5 text-center">
        <div className="alert alert-danger mx-auto" style={{ maxWidth: '600px' }}>
          <h4>⛔ Acceso denegado</h4>
          <p>
            Tu rol (<strong>{usuario.rolEtiqueta || usuario.rol}</strong>) no tiene permisos para acceder a esta sección.
          </p>
        </div>
      </main>
    )
  }

  return children
}

export default RutaProtegida
