import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, test, expect, beforeEach } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import Producto from './Producto'

const renderProducto = () => {
  render(
    <MemoryRouter>
      <Producto
        id="1"
        nombre="Café Latte Pumita"
        precio="2500"
        stockInicial={5}
      />
    </MemoryRouter>
  )
}

describe('Componente Producto - Cafeta TiPum', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  test('2. muestra el nombre y el precio del producto', () => {
    renderProducto()
    expect(screen.getByText('Café Latte Pumita')).toBeInTheDocument()
    expect(screen.getByText('Precio: $2500')).toBeInTheDocument()
  })

  test('3. muestra stock inicial de 5 y oculta botones +/- antes de añadir al carrito', () => {
    renderProducto()
    expect(screen.getByText('Stock disponible: 5')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Añadir al carrito' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: '+' })).not.toBeInTheDocument()
  })

  test('4. al presionar Añadir al carrito, muestra controles +/- y baja el stock disponible a 4', async () => {
    const user = userEvent.setup()
    renderProducto()

    const botonAgregar = screen.getByRole('button', { name: 'Añadir al carrito' })
    await user.click(botonAgregar)

    expect(screen.getByText('En carrito: 1')).toBeInTheDocument()
    expect(screen.getByText('Stock disponible: 4')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '+' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '-' })).toBeInTheDocument()
  })

  test('5. aumenta la cantidad en el carrito al presionar + y disminuye al presionar -', async () => {
    const user = userEvent.setup()
    renderProducto()

    await user.click(screen.getByRole('button', { name: 'Añadir al carrito' }))
    const botonMas = screen.getByRole('button', { name: '+' })
    const botonMenos = screen.getByRole('button', { name: '-' })

    await user.click(botonMas)
    expect(screen.getByText('En carrito: 2')).toBeInTheDocument()
    expect(screen.getByText('Stock disponible: 3')).toBeInTheDocument()

    await user.click(botonMenos)
    expect(screen.getByText('En carrito: 1')).toBeInTheDocument()
    expect(screen.getByText('Stock disponible: 4')).toBeInTheDocument()
  })

  test('6. no permite que el stock disponible sea negativo al superar el límite', async () => {
    const user = userEvent.setup()
    renderProducto()

    await user.click(screen.getByRole('button', { name: 'Añadir al carrito' }))
    const botonMas = screen.getByRole('button', { name: '+' })

    await user.click(botonMas)
    await user.click(botonMas)
    await user.click(botonMas)
    await user.click(botonMas)
    await user.click(botonMas)

    expect(screen.getByText('Stock disponible: 0')).toBeInTheDocument()
    expect(screen.getByText('En carrito: 5')).toBeInTheDocument()
  })
})