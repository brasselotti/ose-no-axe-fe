import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../../contexts/AuthContext'
import { listarMensalidades, listarUsuarios, buscarMensalidadesPorMembro } from '../../../data/db'
import './Mensalidades.css'

const MESES = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
]

function formatarReferencia(ref) {
  if (!ref) return '—'
  const [ano, mes] = ref.split('-')
  return `${MESES[parseInt(mes, 10) - 1]} ${ano}`
}

function formatarData(data) {
  if (!data) return '—'
  return new Date(data + 'T00:00:00').toLocaleDateString('pt-BR')
}

function formatarValor(valor) {
  return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

function Mensalidades() {
  const { usuario } = useAuth()

  const [todasMensalidades] = useState(() =>
    usuario.tipo === 'adm'
      ? listarMensalidades()
      : buscarMensalidadesPorMembro(usuario.login)
  )
  const [usuarios]  = useState(() => listarUsuarios())
  const [pendentes] = useState(() =>
    listarMensalidades().filter(m => m.status === 'pendente').length
  )

  const [filtroMes, setFiltroMes]       = useState('')
  const [filtroMembro, setFiltroMembro] = useState('')
  const [filtroStatus, setFiltroStatus] = useState('')
  const [comprovanteAberto, setComprovanteAberto] = useState(null)

  const mesesDisponiveis = [...new Set(todasMensalidades.map(m => m.referencia))].sort().reverse()

  const filtradas = todasMensalidades
    .filter(m => !filtroMes    || m.referencia  === filtroMes)
    .filter(m => !filtroMembro || m.membroLogin === filtroMembro)
    .filter(m => !filtroStatus || m.status      === filtroStatus)
    .sort((a, b) => new Date(b.criadaEm) - new Date(a.criadaEm))

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

        {usuario.tipo === 'adm' && (
          <>
            <Link to="/app/mensalidades/analisar" className="nav-card">
              <span className="nav-card-label">
                Analisar pagamentos
                {pendentes > 0 && <span className="nav-card-badge">{pendentes}</span>}
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

      {/* ── Histórico ── */}
      <div className="mensalidades-historico">
        <div className="mensalidades-historico-header">
          <span className="mensalidades-historico-title">Histórico de pagamentos</span>
          <div className="mensalidades-filtros">
            <select value={filtroMes} onChange={e => setFiltroMes(e.target.value)}>
              <option value="">Todos os meses</option>
              {mesesDisponiveis.map(m => (
                <option key={m} value={m}>{formatarReferencia(m)}</option>
              ))}
            </select>

            {usuario.tipo === 'adm' && (
              <select value={filtroMembro} onChange={e => setFiltroMembro(e.target.value)}>
                <option value="">Todos os membros</option>
                {usuarios.map(u => (
                  <option key={u.login} value={u.login}>{u.nome}</option>
                ))}
              </select>
            )}

            <select value={filtroStatus} onChange={e => setFiltroStatus(e.target.value)}>
              <option value="">Todos os status</option>
              <option value="pendente">Pendente</option>
              <option value="aprovado">Aprovado</option>
              <option value="rejeitado">Rejeitado</option>
            </select>
          </div>
        </div>

        <div className="table-wrapper" style={{ overflowX: 'auto' }}>
          {filtradas.length === 0 ? (
            <p className="table-empty">Nenhum pagamento encontrado.</p>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  {usuario.tipo === 'adm' && <th>Membro</th>}
                  <th>Referência</th>
                  <th>Data</th>
                  <th>Valor</th>
                  <th>Status</th>
                  <th>Comprovante</th>
                </tr>
              </thead>
              <tbody>
                {filtradas.map(m => (
                  <tr key={m.id}>
                    {usuario.tipo === 'adm' && <td>{m.membroNome}</td>}
                    <td>{formatarReferencia(m.referencia)}</td>
                    <td>{formatarData(m.dataPagamento)}</td>
                    <td>{formatarValor(m.valor)}</td>
                    <td>
                      <span className={`badge badge--${m.status}`}>
                        {m.status.charAt(0).toUpperCase() + m.status.slice(1)}
                      </span>
                      {m.status === 'rejeitado' && m.observacao && (
                        <p style={{ fontSize: '0.75rem', color: '#b91c1c', marginTop: '0.25rem' }}>
                          {m.observacao}
                        </p>
                      )}
                    </td>
                    <td>
                      {m.comprovante ? (
                        <button
                          className="historico-comprovante-link"
                          onClick={() => setComprovanteAberto(m)}
                        >
                          Ver
                        </button>
                      ) : (
                        <span style={{ color: '#d1d5db', fontSize: '0.85rem' }}>—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* ── Modal comprovante ── */}
      {comprovanteAberto && (
        <div className="historico-modal-overlay" onClick={() => setComprovanteAberto(null)}>
          <div className="historico-modal" onClick={e => e.stopPropagation()}>
            <p style={{ fontWeight: 600, fontSize: '0.9rem' }}>
              Comprovante — {formatarReferencia(comprovanteAberto.referencia)}
            </p>
            {comprovanteAberto.nomeArquivo?.toLowerCase().endsWith('.pdf') ? (
              <p style={{ color: 'var(--color-text-muted)' }}>📄 {comprovanteAberto.nomeArquivo}</p>
            ) : (
              <img src={comprovanteAberto.comprovante} alt="Comprovante" />
            )}
            <button
              className="btn-secondary historico-modal-fechar"
              onClick={() => setComprovanteAberto(null)}
            >
              Fechar
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default Mensalidades
