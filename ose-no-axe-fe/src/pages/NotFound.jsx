import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import './NotFound.css'

function NotFound() {
  const { usuario } = useAuth()

  return (
    <div className="not-found-page">
      <div className="not-found-card">
        <span className="not-found-code">404</span>
        <h1 className="not-found-title">Página não encontrada</h1>
        <p className="not-found-desc">O endereço que você acessou não existe ou foi removido.</p>
        <Link to={usuario ? '/app/home' : '/login'} className="not-found-btn">Voltar ao início</Link>
      </div>
    </div>
  )
}

export default NotFound
