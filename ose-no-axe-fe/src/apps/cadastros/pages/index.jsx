import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { listarUsuarios } from '../../../data/db'
import './Cadastros.css'

function descricaoIniciacao(u) {
  if (!u.filhoIniciado) return 'Abian'
  const partes = [u.ordemPosto, u.orixa].filter(Boolean)
  if (partes.length === 2) return `${partes[0]} de ${partes[1]}`
  if (partes.length === 1) return partes[0]
  return 'Iniciado'
}

function IconePessoa() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
    </svg>
  )
}

function IconeTelefone() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2A19.79 19.79 0 0 1 11.39 19a19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 3.1 4.18 2 2 0 0 1 5.09 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L9.91 9.91a16 16 0 0 0 6 6l.46-.46a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
    </svg>
  )
}

function IconeLocal() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
      <circle cx="12" cy="10" r="3"/>
    </svg>
  )
}

function Cadastros() {
  const [usuarios] = useState(() => listarUsuarios())
  const [busca, setBusca]   = useState('')
  const navigate = useNavigate()

  const filtrados = usuarios.filter(u =>
    u.nome.toLowerCase().includes(busca.toLowerCase())
  )

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Filhos Cadastrados</h1>
        <Link to="/app/cadastros/novo" className="btn-primary">+ Cadastrar Filho</Link>
      </div>

      <input
        className="filhos-busca"
        placeholder="Buscar por nome..."
        value={busca}
        onChange={e => setBusca(e.target.value)}
      />

      {filtrados.length === 0 ? (
        <p style={{ color: 'var(--color-text-muted)' }}>Nenhum resultado encontrado.</p>
      ) : (
        <div className="filhos-grid">
          {filtrados.map(u => (
            <div key={u.login} className="filho-card">

              <div className="filho-card-header">
                <div className="filho-avatar">
                  <IconePessoa />
                </div>
                <div className="filho-info">
                  <p className="filho-nome">{u.nome}</p>
                  <p className="filho-subtitle">{descricaoIniciacao(u)}</p>
                </div>
              </div>

              <hr className="filho-divider" />

              <div className="filho-detalhes">
                <div className="filho-detalhe">
                  <span className="filho-detalhe-icon"><IconeTelefone /></span>
                  <span>{u.telefone || '—'}</span>
                </div>
                <div className="filho-detalhe">
                  <span className="filho-detalhe-icon"><IconeLocal /></span>
                  <span>{u.cidade || '—'}</span>
                </div>
                <div className="filho-tags">
                  {u.filhoIniciado
                    ? <span className="badge badge--iniciado">Iniciado</span>
                    : <span className="badge badge--nao-iniciado">Não iniciado</span>
                  }
                  {u.tipo === 'adm' && (
                    <span className="badge badge--adm">ADM</span>
                  )}
                </div>
              </div>

              <div className="filho-footer">
                <span className="filho-login">{u.login}</span>
                <button
                  className="btn-editar"
                  onClick={() => navigate(`/app/cadastros/editar/${u.login}`)}
                >
                  ✏ Editar
                </button>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Cadastros
