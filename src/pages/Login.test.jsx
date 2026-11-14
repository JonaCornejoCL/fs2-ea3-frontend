import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, test, expect } from 'vitest'
import Login from './Login'

describe('Página Login - Cafeta TiPum', () => {
  test('7. muestra el formulario de inicio de sesión', () => {
    render(<Login />)
    expect(screen.getByText('Iniciar Sesión')).toBeInTheDocument()
  })

  test('8. muestra los campos de correo y contraseña asociados a su label', () => {
    render(<Login />)
    expect(screen.getByLabelText('Correo electrónico')).toBeInTheDocument()
    expect(screen.getByLabelText('Contraseña')).toBeInTheDocument()
  })

  test('9. permite escribir el correo electrónico', async () => {
    const user = userEvent.setup()
    render(<Login />)
    const inputEmail = screen.getByLabelText('Correo electrónico')
    await user.type(inputEmail, 'hernan@gmail.com')
    expect(inputEmail).toHaveValue('hernan@gmail.com')
  })

  test('10. permite escribir la contraseña', async () => {
    const user = userEvent.setup()
    render(<Login />)
    const inputPassword = screen.getByLabelText('Contraseña')
    await user.type(inputPassword, '12345')
    expect(inputPassword).toHaveValue('12345')
  })

  test('11. muestra error cuando el correo no es válido', async () => {
    const user = userEvent.setup()
    render(<Login />)
    await user.type(screen.getByLabelText('Correo electrónico'), 'hernan')
    await user.type(screen.getByLabelText('Contraseña'), '12345')
    await user.click(screen.getByRole('button', { name: 'Ingresar' }))
    expect(screen.getByText('El correo electrónico no es válido')).toBeInTheDocument()
  })

  test('12. muestra error con contraseña corta y no muestra error con datos válidos', async () => {
    const user = userEvent.setup()
    render(<Login />)
    const emailInput = screen.getByLabelText('Correo electrónico')
    const passInput = screen.getByLabelText('Contraseña')
    const btnIngresar = screen.getByRole('button', { name: 'Ingresar' })

    await user.type(emailInput, 'hernan@gmail.com')
    await user.type(passInput, '12')
    await user.click(btnIngresar)
    expect(screen.getByText('La contraseña debe tener al menos 4 caracteres')).toBeInTheDocument()

    await user.clear(passInput)
    await user.type(passInput, '12345')
    await user.click(btnIngresar)
    expect(screen.queryByText('La contraseña debe tener al menos 4 caracteres')).not.toBeInTheDocument()
  })
})