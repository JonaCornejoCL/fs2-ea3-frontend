import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Producto from '../components/Producto'
import api from '../api/client'

function Inicio() {
  const [productos, setProductos] = useState([])
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    api.listarProductos()
      .then((data) => setProductos(data.slice(0, 3)))
      .catch(() => setProductos([]))
      .finally(() => setCargando(false))
  }, [])

  return (
    <main>
      <section id="banner-principal">
        <article className="container">
          <h2 className="fw-bold">Bienvenidos a Cafeta TiPum</h2>
          <p className="lead mx-auto" style={{ maxWidth: '650px' }}>
            Inspirado en el amor incondicional de Titi y nuestro querido Pumita. Café de especialidad y pastelería artesanal.
          </p>
          <Link to="/productos" className="btn btn-tipum btn-lg px-4 py-2 mt-2">
            Ver nuestro menú
          </Link>
        </article>
      </section>

      <section className="container my-5 text-center">
        <h3 className="fw-bold mb-4" style={{ color: '#3E2723' }}>Nuestras Categorías</h3>
        <div className="row g-4">
          <div className="col-12 col-md-4">
            <div className="card shadow-sm border-0 p-4 h-100">
              <h4 className="fw-bold">☕ Cafetería</h4>
              <p className="text-muted">Granos seleccionados de especialidad.</p>
              <Link to="/productos?categoria=cafe" className="btn btn-outline-danger mt-auto">Ver Cafés</Link>
            </div>
          </div>
          <div className="col-12 col-md-4">
            <div className="card shadow-sm border-0 p-4 h-100">
              <h4 className="fw-bold">🧁 Pastelería</h4>
              <p className="text-muted">Muffins, cheesecakes y dulces horneados a diario.</p>
              <Link to="/productos?categoria=pasteleria" className="btn btn-outline-danger mt-auto">Ver Pastelería</Link>
            </div>
          </div>
          <div className="col-12 col-md-4">
            <div className="card shadow-sm border-0 p-4 h-100">
              <h4 className="fw-bold">🎁 Merchandising</h4>
              <p className="text-muted">Lleva la experiencia TiPum a tu casa.</p>
              <Link to="/productos?categoria=merchandising" className="btn btn-outline-danger mt-auto">Ver Merch</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="container my-5">
        <h2 className="text-center fw-bold mb-4" style={{ color: '#3E2723' }}>Nuestras Especialidades</h2>
        {cargando ? (
          <div className="text-center text-muted">Cargando especialidades...</div>
        ) : (
          <div className="row g-4">
            {productos.map((prod) => (
              <div className="col-12 col-md-6 col-lg-4" key={prod.id}>
                <Producto
                  id={prod.id}
                  nombre={prod.nombre}
                  precio={prod.precio}
                  imagen={prod.imagen}
                  stockInicial={prod.stock}
                  enOferta={prod.enOferta}
                  precioOferta={prod.precioOferta}
                />
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  )
}

export default Inicio
