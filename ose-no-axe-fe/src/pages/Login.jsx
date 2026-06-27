import { useState } from 'react'

function Login() {
  const [isRegistering, setIsRegistering] = useState(false)

  return (
    <div>
      {isRegistering ? (
        <>
          <h1>Cadastro</h1>
          <button onClick={() => setIsRegistering(false)}>
            Já tenho conta
          </button>
        </>
      ) : (
        <>
          <h1>Login</h1>
          <button onClick={() => setIsRegistering(true)}>
            Criar conta
          </button>
        </>
      )}
    </div>
  )
}

export default Login
