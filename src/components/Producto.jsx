import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { obtenerCarrito, actualizarCantidadItemCarrito } from '../data/database'

function Producto({ id, nombre, precio, imagen, stockInicial = 5, enOferta = false, precioOferta }) {
  // Stock base del producto guardado en localStorage
  const [stockTotal] = useState(() => {
    const guardado = localStorage.getItem(`stock_base_${nombre}`)
    return guardado !== null ? Number(guardado) : Number(stockInicial)
  })

  // Cantidad actual de este producto en el carrito
  const [cantidadCarrito, setCantidadCarrito] = useState(() => {
    const carrito = obtenerCarrito()
    const item = carrito.find((i) => i.id === Number(id) || i.nombre === nombre)
    return item ? Number(item.cantidad) : 0
  })

  // Stock disponible en tiempo real = Stock Total - Cantidad en el Carrito
  const stockDisponible = Math.max(0, stockTotal - cantidadCarrito)

  useEffect(() => {
    localStorage.setItem(`stock_base_${nombre}`, stockTotal)
  }, [stockTotal, nombre])

  useEffect(() => {
    const sincronizarDesdeCarrito = () => {
      const carrito = obtenerCarrito()
      const item = carrito.find((i) => i.id === Number(id) || i.nombre === nombre)
      setCantidadCarrito(item ? Number(item.cantidad) : 0)
    }
    window.addEventListener('carritoActualizado', sincronizarDesdeCarrito)
    return () => window.removeEventListener('carritoActualizado', sincronizarDesdeCarrito)
  }, [id, nombre])

  const sincronizarProducto = (nuevaCantidad) => {
    const precioNumerico = Number(String(precio).replace(/\./g, ''))
    const ofertaNumerica = precioOferta ? Number(String(precioOferta).replace(/\./g, '')) : precioNumerico

    setCantidadCarrito(nuevaCantidad)
    actualizarCantidadItemCarrito(
      {
        id: Number(id) || 1,
        nombre,
        precio: precioNumerico,
        enOferta,
        precioOferta: ofertaNumerica,
        imagen: imagen || 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&q=80'
      },
      nuevaCantidad
    )
  }

  const handleAgregarInicial = () => {
    if (stockDisponible > 0) {
      sincronizarProducto(1)
    }
  }

  const aumentarCantidad = () => {
    if (stockDisponible > 0) {
      sincronizarProducto(cantidadCarrito + 1)
    }
  }

  const disminuirCantidad = () => {
    if (cantidadCarrito > 0) {
      sincronizarProducto(cantidadCarrito - 1)
    }
  }

  return (
    <div className="card h-100 producto-card shadow-sm border-0">
      {imagen && (
        <div className="position-relative">
          <img src={imagen} alt={nombre} className="card-img-top" />
          {enOferta && (
            <span className="badge bg-danger position-absolute top-0 end-0 m-2 fs-6">
              ¡OFERTA!
            </span>
          )}
        </div>
      )}
      <div className="card-body d-flex flex-column text-center">
        <h5 className="card-title fw-bold" style={{ color: '#3E2723' }}>{nombre}</h5>
        <p className="card-text fw-bold text-danger fs-5 mb-1">Precio: ${precio}</p>
        <p className="text-muted mb-3">Stock disponible: {stockDisponible}</p>

        <div className="mb-3">
          <Link to={`/producto/${id}`} className="btn btn-outline-dark btn-sm w-100">
            Ver detalle
          </Link>
        </div>

        {/* Renderizado condicional: Si no está en el carrito, muestra "Añadir al carrito". Si ya se añadió, muestra - / cantidad / + */}
        {cantidadCarrito === 0 ? (
          <button
            className="btn btn-tipum w-100 mt-auto py-2"
            onClick={handleAgregarInicial}
            disabled={stockDisponible === 0}
          >
            {stockDisponible === 0 ? 'Sin Stock' : 'Añadir al carrito'}
          </button>
        ) : (
          <div className="d-flex justify-content-between align-items-center mt-auto bg-light p-2 rounded border">
            <button
              className="btn btn-danger fw-bold px-3"
              onClick={disminuirCantidad}
              aria-label="-"
            >
              -
            </button>
            <span className="fw-bold text-dark">
              En carrito: {cantidadCarrito}
            </span>
            <button
              className="btn btn-success fw-bold px-3"
              onClick={aumentarCantidad}
              disabled={stockDisponible === 0}
              aria-label="+"
            >
              +
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default Producto