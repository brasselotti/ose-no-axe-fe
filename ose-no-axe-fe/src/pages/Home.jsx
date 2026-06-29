import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { listarUsuarios } from '../data/db'
import './Home.css'

function Home() {
  const { usuario } = useAuth()
  const primeiroNome = usuario?.nome?.split(' ')[0]

  const usuarios = listarUsuarios()
  const totalMembros = usuarios.filter(u => u.tipo === 'membro').length
  const totalAdms = usuarios.filter(u => u.tipo === 'adm').length

  return (
    <div className="home">
      <h1 className="home-title">Olá, {primeiroNome}!</h1>
      <p className="home-sub">Bem-vindo ao sistema Osé no Axé.</p>

      <section className="home-section">
        <h2 className="home-section-title">Atalhos</h2>
        <div className="home-cards">
          {usuario?.tipo === 'adm' && (
            <Link to="/app/cadastros" className="home-card">
              <span className="home-card-label">Cadastros</span>
              <span className="home-card-desc">Gerenciar membros</span>
            </Link>
          )}
          <Link to="/app/mensalidades" className="home-card">
            <span className="home-card-label">Mensalidades</span>
            <span className="home-card-desc">Acompanhar pagamentos</span>
          </Link>
        </div>
      </section>

      <div className="home-divider" />

      <section className="home-section">
        <h2 className="home-section-title">Visão geral</h2>
        <div className="home-dashboard">
          {usuario?.tipo === 'adm' && (
            <div className="dashboard-panel">
              <h3 className="dashboard-panel-title">Cadastros</h3>
              <div className="dashboard-stats">
                <div className="dashboard-stat">
                  <span className="dashboard-stat-value">{totalMembros + totalAdms}</span>
                  <span className="dashboard-stat-label">Total cadastrado</span>
                </div>
                <div className="dashboard-stat">
                  <span className="dashboard-stat-value">{totalMembros}</span>
                  <span className="dashboard-stat-label">Membros</span>
                </div>
                <div className="dashboard-stat">
                  <span className="dashboard-stat-value">{totalAdms}</span>
                  <span className="dashboard-stat-label">Administradores</span>
                </div>
              </div>
            </div>
          )}
          <div className="dashboard-panel">
            <h3 className="dashboard-panel-title">Mensalidades</h3>
            <div className="dashboard-stats">
              <div className="dashboard-stat">
                <span className="dashboard-stat-value">—</span>
                <span className="dashboard-stat-label">Em dia</span>
              </div>
              <div className="dashboard-stat">
                <span className="dashboard-stat-value">—</span>
                <span className="dashboard-stat-label">Pendentes</span>
              </div>
              <div className="dashboard-stat">
                <span className="dashboard-stat-value">—</span>
                <span className="dashboard-stat-label">Em atraso</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
