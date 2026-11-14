import { useState } from 'react'
import { validaDominioCorreo } from '../data/database'

function Contacto() {
  const [nombre, setNombre] = useState('')
  const [correo, setCorreo] = useState('')
  const [comentario, setComentario] = useState('')
  const [error, setError] = useState('')
  const [exito, setExito] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setExito(false)

    if (!nombre.trim() || nombre.length > 100) {
      setError('El nombre es obligatorio (Máx. 100 caracteres).')
      return
    }
    if (!validaDominioCorreo(correo)) {
      setError('Usa un correo válido (@duoc.cl, @profesor.duoc.cl o @gmail.com).')
      return
    }
    if (!comentario.trim() || comentario.length > 500) {
      setError('El mensaje es obligatorio (Máx. 500 caracteres).')
      return
    }

    setError('')
    setExito(true)
    setNombre('')
    setCorreo('')
    setComentario('')
  }

  return (
    <main className="container my-5 d-flex justify-content-center">
      <section className="w-100" style={{ maxWidth: '600px' }}>
        <article className="formulario-contenedor">
          <h2 className="text-center fw-bold mb-2">CONTÁCTANOS</h2>
          <p className="text-center text-muted mb-4">¿Tienes dudas o sugerencias? Escríbenos y te responderemos a la brevedad.</p>

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="nombreContacto" className="form-label fw-bold">Nombre Completo:</label>
              <input
                id="nombreContacto"
                type="text"
                className="form-control"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Ej: Juan Pérez"
              />
            </div>

            <div className="mb-3">
              <label htmlFor="correoContacto" className="form-label fw-bold">Correo Electrónico:</label>
              <input
                id="correoContacto"
                type="email"
                className="form-control"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                placeholder="Ej: usuario@duoc.cl"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="comentarioContacto" className="form-label fw-bold">Mensaje o Comentario:</label>
              <textarea
                id="comentarioContacto"
                className="form-control"
                rows="4"
                value={comentario}
                onChange={(e) => setComentario(e.target.value)}
                placeholder="Escribe tu mensaje aquí..."
              />
            </div>

            {error && <div className="alert alert-danger">{error}</div>}
            {exito && <div className="alert alert-success text-center fw-bold">¡Mensaje enviado con éxito! Te responderemos a la brevedad.</div>}

            <button type="submit" className="btn btn-tipum w-100 py-2">Enviar Mensaje</button>
          </form>
        </article>
      </section>
    </main>
  )
}

export default Contacto