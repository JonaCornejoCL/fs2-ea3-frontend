import { useState } from 'react'
import { Link } from 'react-router-dom'
import { DATOS_GEOGRAFICOS, validaRutChileno, validaDominioCorreo } from '../data/database'
import api from '../api/client'

function Registro() {
  const [form, setForm] = useState({
    run: '', nombre: '', apellidos: '', correo: '', fechaNacimiento: '',
    direccion: '', region: '', comuna: '', pass: '', passConfirm: ''
  })
  const [error, setError] = useState('')
  const [exito, setExito] = useState(false)
  const [cargando, setCargando] = useState(false)

  const comunasDisponibles = form.region ? DATOS_GEOGRAFICOS[form.region] || [] : []

  const handleChange = (e) => {
    const { name, value } = e.target
    if (name === 'region') {
      setForm({ ...form, region: value, comuna: '' })
    } else {
      setForm({ ...form, [name]: value })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setExito(false)
    setError('')

    if (!validaRutChileno(form.run)) return setError('El RUN ingresado no es válido (Ej: 19011022K).')
    if (!form.nombre.trim() || form.nombre.length > 50) return setError('El nombre es obligatorio (Máx. 50 caracteres).')
    if (!form.apellidos.trim() || form.apellidos.length > 100) return setError('Los apellidos son obligatorios (Máx. 100 caracteres).')
    if (!validaDominioCorreo(form.correo)) return setError('Usa un correo válido (@duoc.cl, @profesor.duoc.cl o @gmail.com).')
    if (!form.direccion.trim() || form.direccion.length > 300) return setError('La dirección es obligatoria (Máx. 300 caracteres).')
    if (!form.region || !form.comuna) return setError('Por favor, selecciona una región y una comuna.')
    if (form.pass.length < 4 || form.pass.length > 100) return setError('La contraseña es obligatoria (mínimo 4 caracteres).')
    if (form.pass !== form.passConfirm) return setError('Las contraseñas no coinciden.')

    setCargando(true)
    try {
      await api.registro({
        run: form.run.toUpperCase(),
        nombre: form.nombre.trim(),
        apellidos: form.apellidos.trim(),
        correo: form.correo.trim(),
        password: form.pass,
        region: form.region,
        comuna: form.comuna,
        direccion: form.direccion.trim(),
        fechaNacimiento: form.fechaNacimiento || null
      })
      setExito(true)
      setForm({
        run: '', nombre: '', apellidos: '', correo: '', fechaNacimiento: '',
        direccion: '', region: '', comuna: '', pass: '', passConfirm: ''
      })
    } catch (err) {
      setError(err.message || 'Error al registrar el usuario')
    } finally {
      setCargando(false)
    }
  }

  return (
    <main className="container my-5 d-flex justify-content-center">
      <section className="w-100" style={{ maxWidth: '550px' }}>
        <article className="formulario-contenedor">
          <h2 className="text-center fw-bold mb-2">NUEVO USUARIO</h2>
          <p className="text-center text-muted mb-4">Únete a la familia de Cafeta TiPum</p>

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label fw-bold">RUN (Sin puntos ni guión):</label>
              <input type="text" name="run" className="form-control" placeholder="Ej: 19011022K" value={form.run} onChange={handleChange} />
            </div>

            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label fw-bold">Nombre:</label>
                <input type="text" name="nombre" className="form-control" value={form.nombre} onChange={handleChange} />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label fw-bold">Apellidos:</label>
                <input type="text" name="apellidos" className="form-control" value={form.apellidos} onChange={handleChange} />
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label fw-bold">Correo electrónico:</label>
              <input type="email" name="correo" className="form-control" placeholder="usuario@duoc.cl" value={form.correo} onChange={handleChange} />
            </div>

            <div className="mb-3">
              <label className="form-label fw-bold">Dirección:</label>
              <input type="text" name="direccion" className="form-control" placeholder="Ej: Av. Los Carrera 450" value={form.direccion} onChange={handleChange} />
            </div>

            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label fw-bold">Región:</label>
                <select name="region" className="form-select" value={form.region} onChange={handleChange}>
                  <option value="">-- Seleccione región --</option>
                  {Object.keys(DATOS_GEOGRAFICOS).map((reg) => (
                    <option key={reg} value={reg}>{reg}</option>
                  ))}
                </select>
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label fw-bold">Comuna:</label>
                <select name="comuna" className="form-select" value={form.comuna} onChange={handleChange}>
                  <option value="">-- Seleccione comuna --</option>
                  {comunasDisponibles.map((com) => (
                    <option key={com} value={com}>{com}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label fw-bold">Contraseña:</label>
                <input type="password" name="pass" className="form-control" value={form.pass} onChange={handleChange} />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label fw-bold">Confirmar Contraseña:</label>
                <input type="password" name="passConfirm" className="form-control" value={form.passConfirm} onChange={handleChange} />
              </div>
            </div>

            {error && <div className="alert alert-danger">{error}</div>}
            {exito && (
              <div className="alert alert-success text-center fw-bold">
                ¡Usuario registrado con éxito! <Link to="/login">Inicia sesión aquí</Link>
              </div>
            )}

            <button type="submit" className="btn btn-tipum w-100 py-2 mt-2" disabled={cargando}>
              {cargando ? 'Registrando...' : 'Registrar en Cafeta TiPum'}
            </button>
          </form>
        </article>
      </section>
    </main>
  )
}

export default Registro
