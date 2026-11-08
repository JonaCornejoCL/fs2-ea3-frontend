import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [cargando, setCargando] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setCargando(true)
    try {
      const usuario = await login(email, password)
      if (usuario.rol === 'ADMIN') navigate('/admin')
      else if (usuario.rol === 'VENDEDOR') navigate('/vendedor')
      else navigate('/productos')
    } catch (err) {
      setError(err.message || 'Error al iniciar sesión')
    } finally {
      setCargando(false)
    }
  }

  return (
    <main className="container my-5 d-flex justify-content-center">
      <section className="w-100" style={{ maxWidth: '500px' }}>
        <article className="formulario-contenedor">
          <h1 className="text-center fw-bold mb-2" style={{ color: '#3E2723' }}>Iniciar Sesión</h1>
          <p className="text-center text-muted mb-4">Bienvenido de vuelta a Cafeta TiPum</p>

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="email" className="form-label fw-bold">Correo electrónico</label>
              <input
                id="email"
                type="email"
                className="form-control"
                placeholder="Ej: usuario@duoc.cl"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="password" className="form-label fw-bold">Contraseña</label>
              <input
                id="password"
                type="password"
                className="form-control"
                placeholder="Tu contraseña"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
              />
            </div>

            {error && <div className="alert alert-danger">{error}</div>}

            <button type="submit" className="btn btn-tipum w-100 py-2" disabled={cargando}>
              {cargando ? 'Ingresando...' : 'Ingresar'}
            </button>
          </form>

          <div className="alert alert-light border mt-4 small">
            <strong>Usuarios de prueba:</strong><br />
            👑 Admin: <code>admin@duoc.cl</code> / <code>admin123</code><br />
            🧑‍💼 Vendedor: <code>vendedor@duoc.cl</code> / <code>vendedor123</code><br />
            🛒 Cliente: <code>juan.perez@duoc.cl</code> / <code>cliente123</code>
          </div>

          <p className="text-center mt-3 text-muted">
            ¿No tienes cuenta? <a href="/registro" className="fw-bold">Regístrate aquí</a>
          </p>
        </article>
      </section>
    </main>
  )
}

export default Login
