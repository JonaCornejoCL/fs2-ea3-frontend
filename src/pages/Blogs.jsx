import { useState } from 'react'

function Blogs() {
  const [blogActivo, setBlogActivo] = useState(null)

  const articulos = [
    {
      id: 1,
      titulo: 'Los beneficios del café de especialidad',
      resumen: 'Descubre por qué el café de origen no solo es delicioso, sino también una gran fuente de antioxidantes para empezar tu día.',
      imagen: 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?auto=format&fit=crop&q=80',
      contenido: [
        'El café de especialidad no es solo una bebida, es toda una experiencia que involucra a productores, tostadores y baristas dedicados a resaltar los mejores sabores de cada grano. En Cafeta TiPum, nos tomamos muy en serio este proceso.',
        'A diferencia del café comercial, el café de especialidad se cultiva en altitudes específicas y microclimas ideales, lo que resulta en un perfil de taza único, libre de defectos. Además, su consumo moderado aporta grandes cantidades de antioxidantes y mejora la concentración.',
        'La próxima vez que disfrutes de un Latte Pumita, recuerda que estás apoyando prácticas de comercio justo y cuidando tu salud con cada sorbo.'
      ]
    },
    {
      id: 2,
      titulo: 'El secreto de nuestros muffins',
      resumen: 'Un vistazo a los ingredientes frescos y el amor que ponemos en la preparación de nuestra clásica pastelería artesanal.',
      imagen: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&q=80',
      contenido: [
        'Muchas veces nos preguntan cuál es el secreto para lograr esa textura esponjosa y ese sabor inconfundible en nuestra pastelería. La respuesta es más sencilla de lo que parece: ingredientes frescos, tiempo y mucho amor.',
        'Nuestra receta de Muffin de Arándanos ha pasado por docenas de pruebas hasta alcanzar el equilibrio perfecto. Utilizamos harina de trigo seleccionada, mantequilla real y arándanos frescos de la zona.',
        'En Cafeta TiPum creemos que un buen café merece una compañía a su altura, por eso horneamos en pequeños lotes durante el día.'
      ]
    }
  ]

  if (blogActivo) {
    return (
      <main className="container my-5">
        <section className="bg-white p-4 p-md-5 rounded shadow-sm border mx-auto" style={{ maxWidth: '800px' }}>
          <h1 className="fw-bold mb-4 text-center" style={{ color: '#3E2723' }}>{blogActivo.titulo}</h1>
          <img src={blogActivo.imagen} alt={blogActivo.titulo} className="img-fluid rounded shadow-sm mb-4 w-100" style={{ maxHeight: '380px', objectFit: 'cover' }} />
          <article className="fs-5 text-muted">
            {blogActivo.contenido.map((parrafo, idx) => (
              <p key={idx}>{parrafo}</p>
            ))}
          </article>
          <div className="text-center mt-4">
            <button onClick={() => setBlogActivo(null)} className="btn btn-outline-danger px-4">
              Volver a Noticias
            </button>
          </div>
        </section>
      </main>
    )
  }

  return (
    <main className="container my-5">
      <h2 className="text-center fw-bold mb-5" style={{ color: '#3E2723' }}>Noticias y Curiosidades</h2>
      <div className="row g-4 justify-content-center">
        {articulos.map((art) => (
          <article className="col-md-5" key={art.id}>
            <div className="card shadow-sm border-0 h-100">
              <img src={art.imagen} className="card-img-top" alt={art.titulo} style={{ height: '200px', objectFit: 'cover' }} />
              <div className="card-body d-flex flex-column">
                <h4 className="card-title fw-bold">{art.titulo}</h4>
                <p className="card-text text-muted">{art.resumen}</p>
                <button onClick={() => setBlogActivo(art)} className="btn btn-outline-danger mt-auto">
                  Leer más
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </main>
  )
}

export default Blogs