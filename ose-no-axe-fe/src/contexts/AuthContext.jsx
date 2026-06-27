import { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(() => {
    const saved = sessionStorage.getItem('usuario')
    return saved ? JSON.parse(saved) : null
  })

  function entrar(novoUsuario) {
    setUsuario(novoUsuario)
    sessionStorage.setItem('usuario', JSON.stringify(novoUsuario))
  }

  function sair() {
    setUsuario(null)
    sessionStorage.removeItem('usuario')
  }

  return (
    <AuthContext value={{ usuario, entrar, sair }}>
      {children}
    </AuthContext>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
