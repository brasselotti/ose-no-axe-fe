import { Link } from 'react-router-dom'
import './NotFound.css'

function NotFound() {
  return (
    <div className="not-found-page">
      <div className="not-found-card">
        <span className="not-found-code">404</span>
        <h1 className="not-found-title">Página não encontrada</h1>
        <p className="not-found-desc">O endereço que você acessou não existe ou foi removido.</p>
        <Link to="/login" className="not-found-btn">Voltar ao início</Link>
      </div>
    </div>
  )
}

export default NotFound
