function Nosotros() {
  return (
    <main className="container my-5">
      <section className="text-center mb-5">
        <h2 className="fw-bold mb-4" style={{ color: '#3E2723' }}>Nuestra Historia</h2>
        <p className="lead text-muted mx-auto" style={{ maxWidth: '800px' }}>
          Cafeta TiPum nace del amor incondicional por nuestras queridas mascotas, Titi y Pumita. Somos una cafetería de especialidad enfocada en brindar momentos cálidos, con pastelería artesanal y el mejor café en un ambiente que te hará sentir como en casa.
        </p>
      </section>

      <section className="mt-5 text-center">
        <h3 className="fw-bold mb-4" style={{ color: '#3E2723' }}>El Equipo TiPum</h3>
        <div className="row justify-content-center">
          <article className="col-md-5">
            <div className="card shadow-sm border-0">
              <div className="card-body py-4">
                <h4 className="card-title text-danger fw-bold">Jonathan y Dayna</h4>
                <p className="card-text text-muted">Fundadores de TiPum SpA</p>
                <p className="small mb-0">Apasionados por brindar un buen servicio y el mejor café de especialidad.</p>
              </div>
            </div>
          </article>
        </div>
      </section>
    </main>
  )
}

export default Nosotros