import { Link } from 'react-router-dom'
import { useAuth } from '../../../contexts/AuthContext'
import { listarMensalidades } from '../../../data/db'

function Mensalidades() {
  const { usuario } = useAuth()
  const pendentes = usuario?.tipo === 'adm'
    ? listarMensalidades().filter(m => m.status === 'pendente')
    : []

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Mensalidades</h1>
      </div>

      <div className="nav-cards">
        <Link to="/app/mensalidades/registrar" className="nav-card">
          <span className="nav-card-label">Registrar mensalidade</span>
          <span className="nav-card-desc">Enviar comprovante de pagamento</span>
        </Link>

        <Link to={`/app/mensalidades/list/${usuario.login}`} className="nav-card">
          <span className="nav-card-label">Meu histórico</span>
          <span className="nav-card-desc">Ver meus pagamentos</span>
        </Link>

        {usuario?.tipo === 'adm' && (
          <>
            <Link to="/app/mensalidades/analisar" className="nav-card">
              <span className="nav-card-label">
                Analisar mensalidades
                {pendentes.length > 0 && (
                  <span className="nav-card-badge">{pendentes.length}</span>
                )}
              </span>
              <span className="nav-card-desc">Aprovar ou rejeitar comprovantes</span>
            </Link>
            <Link to="/app/mensalidades/list" className="nav-card">
              <span className="nav-card-label">Regularidade</span>
              <span className="nav-card-desc">Situação dos membros por mês</span>
            </Link>
          </>
        )}
      </div>
    </div>
  )
}

export default Mensalidades
