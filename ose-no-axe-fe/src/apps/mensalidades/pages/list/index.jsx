import { useState } from 'react'
import { Navigate, Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../../../contexts/AuthContext'
import { listarUsuarios, listarMensalidades } from '../../../../data/db'
import './List.css'

const MESES_ABREV = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']

function formatarMesColuna(ref) {
  const [ano, mes] = ref.split('-')
  return `${MESES_ABREV[parseInt(mes, 10) - 1]}/${ano.slice(2)}`
}

function statusDoMes(mensalidades, login, referencia) {
  const registros = mensalidades.filter(m => m.membroLogin === login && m.referencia === referencia)
  if (registros.some(m => m.status === 'aprovado')) return 'aprovado'
  if (registros.some(m => m.status === 'pendente')) return 'pendente'
  if (registros.some(m => m.status === 'rejeitado')) return 'rejeitado'
  return null
}

function StatusCell({ status }) {
  const config = {
    aprovado:  { simbolo: '✓', label: 'Aprovado' },
    pendente:  { simbolo: '~', label: 'Pendente' },
    rejeitado: { simbolo: '✗', label: 'Rejeitado' },
  }
  if (!status) {
    return <span className="status-cell status-cell--vazio" title="Sem registro">—</span>
  }
  return (
    <span className={`status-cell status-cell--${status}`} title={config[status].label}>
      {config[status].simbolo}
    </span>
  )
}

function List() {
  const { usuario } = useAuth()
  const navigate = useNavigate()
  const [usuarios]     = useState(() => listarUsuarios())
  const [mensalidades] = useState(() => listarMensalidades())

  if (usuario.tipo !== 'adm') {
    return <Navigate to={`/app/mensalidades/list/${usuario.login}`} replace />
  }

  const mesesExibir = [...new Set(mensalidades.map(m => m.referencia))].sort()

  const hoje     = new Date()
  const mesAtual = `${hoje.getFullYear()}-${String(hoje.getMonth() + 1).padStart(2, '0')}`

  const filhos = usuarios

  const loginsPagosNoMes = new Set(
    mensalidades
      .filter(m => (m.status === 'aprovado' || m.status === 'pendente') && m.referencia === mesAtual)
      .map(m => m.membroLogin)
  )
  const emDia       = filhos.filter(u => loginsPagosNoMes.has(u.login)).length
  const inadimplentes = filhos.length - emDia


  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">
          Mensalidades{' '}
          <span style={{ fontWeight: 400, color: 'var(--color-text-muted)' }}>
            // Regularidade
          </span>
        </h1>
        <button className="btn-secondary" onClick={() => navigate('/app/mensalidades')}>
          Voltar
        </button>
      </div>

      <div className="regularidade-dashboard">
        <div className="regularidade-panel">
          <p className="regularidade-panel-title">Adimplência</p>
          <div className="regularidade-stats">
            <div className="regularidade-stat">
              <span className="regularidade-stat-value">{filhos.length}</span>
              <span className="regularidade-stat-label">Total</span>
            </div>
            <div className="regularidade-stat">
              <span className="regularidade-stat-value" style={{ color: '#065f46' }}>{emDia}</span>
              <span className="regularidade-stat-label">Em dia</span>
            </div>
            <div className="regularidade-stat">
              <span className="regularidade-stat-value" style={{ color: '#b91c1c' }}>{inadimplentes}</span>
              <span className="regularidade-stat-label">Inadimplentes</span>
            </div>
          </div>
        </div>

      </div>

      {mesesExibir.length === 0 ? (
        <div className="table-wrapper">
          <p className="table-empty">Nenhum pagamento registrado ainda.</p>
        </div>
      ) : (
        <div className="table-wrapper" style={{ overflowX: 'auto' }}>
          <table className="table regularidade-table">
            <thead>
              <tr>
                <th>Membro</th>
                {mesesExibir.map(m => (
                  <th key={m} className="regularidade-mes">{formatarMesColuna(m)}</th>
                ))}
                <th className="regularidade-mes">Aprovados</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.length === 0 ? (
                <tr>
                  <td colSpan={mesesExibir.length + 2} className="table-empty">
                    Nenhum membro cadastrado.
                  </td>
                </tr>
              ) : (
                usuarios.map(u => {
                  const aprovados = mesesExibir.filter(
                    m => statusDoMes(mensalidades, u.login, m) === 'aprovado'
                  ).length
                  return (
                    <tr key={u.login}>
                      <td>
                        <Link
                          to={`/app/mensalidades/list/${u.login}`}
                          state={{ from: '/app/mensalidades/list' }}
                          className="btn-link"
                        >
                          {u.nome}
                        </Link>
                      </td>
                      {mesesExibir.map(m => (
                        <td key={m} className="regularidade-cell">
                          <StatusCell status={statusDoMes(mensalidades, u.login, m)} />
                        </td>
                      ))}
                      <td className="regularidade-aprovados">
                        {aprovados}/{mesesExibir.length}
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      )}

      <div className="regularidade-legenda">
        <span className="regularidade-legenda-item">
          <span className="status-cell status-cell--aprovado">✓</span> Aprovado
        </span>
        <span className="regularidade-legenda-item">
          <span className="status-cell status-cell--pendente">~</span> Pendente
        </span>
        <span className="regularidade-legenda-item">
          <span className="status-cell status-cell--rejeitado">✗</span> Rejeitado
        </span>
        <span className="regularidade-legenda-item">
          <span className="status-cell status-cell--vazio">—</span> Sem registro
        </span>
      </div>
    </div>
  )
}

export default List
