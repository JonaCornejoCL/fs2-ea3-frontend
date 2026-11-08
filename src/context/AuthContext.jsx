import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import api from '../api/client'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null)
  const [cargando, setCargando] = useState(true)

  // Recupera la sesión guardada al cargar/recargar la página (persistencia de sesión)
  useEffect(() => {
    const tokenGuardado = localStorage.getItem('tokenTipum')
    const usuarioGuardado = localStorage.getItem('usuarioTipum')
    if (tokenGuardado && usuarioGuardado) {
      try {
        setUsuario(JSON.parse(usuarioGuardado))
      } catch {
        setUsuario(null)
        localStorage.removeItem('tokenTipum')
        localStorage.removeItem('usuarioTipum')
      }
    }
    setCargando(false)
  }, [])

  const login = useCallback(async (correo, password) => {
    const data = await api.login({ correo, password })
    localStorage.setItem('tokenTipum', data.token)
    localStorage.setItem('usuarioTipum', JSON.stringify(data.usuario))
    setUsuario(data.usuario)
    return data.usuario
  }, [])

  const registro = useCallback(async (payload) => {
    return api.registro(payload)
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('tokenTipum')
    localStorage.removeItem('usuarioTipum')
    setUsuario(null)
  }, [])

  return (
    <AuthContext.Provider value={{ usuario, cargando, login, registro, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider')
  }
  return ctx
}
