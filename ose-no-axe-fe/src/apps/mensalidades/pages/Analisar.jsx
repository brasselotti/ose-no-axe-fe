import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../../../contexts/AuthContext'
import { listarMensalidades, atualizarMensalidade } from '../../../data/db'
import './Analisar.css'

const MESES = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
]

function formatarReferencia(ref) {
  if (!ref) return '—'
  const [ano, mes] = ref.split('-')
  return `${MESES[parseInt(mes, 10) - 1]} ${ano}`
}

function formatarMoeda(valor) {
  if (valor == null) return '—'
  return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

function formatarData(dataStr) {
  if (!dataStr) return '—'
  if (dataStr.length === 10) {
    const [ano, mes, dia] = dataStr.split('-')
    return `${dia}/${mes}/${ano}`
  }
  return new Date(dataStr).toLocaleDateString('pt-BR')
}

function Analisar() {
  const { usuario } = useAuth()
  const navigate = useNavigate()
  const [pendentes, setPendentes] = useState(() =>
    listarMensalidades()
      .filter(m => m.status === 'pendente')
      .sort((a, b) => new Date(a.criadaEm) - new Date(b.criadaEm))
  )
  const [rejeitandoId, setRejeitandoId] = useState(null)
  const [observacao, setObservacao] = useState('')

  if (usuario.tipo !== 'adm') {
    return <Navigate to="/app/mensalidades" replace />
  }

  function aprovar(id) {
    atualizarMensalidade(id, {
      status: 'aprovado',
      analisadaEm: new Date().toISOString(),
      analisadaPor: usuario.login,
    })
    setPendentes(p => p.filter(m => m.id !== id))
  }

  function confirmarRejeicao(id) {
    atualizarMensalidade(id, {
      status: 'rejeitado',
      observacao,
      analisadaEm: new Date().toISOString(),
      analisadaPor: usuario.login,
    })
    setPendentes(p => p.filter(m => m.id !== id))
    setRejeitandoId(null)
    setObservacao('')
  }

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">
          Mensalidades{' '}
          <span style={{ fontWeight: 400, color: 'var(--color-text-muted)' }}>
            // Analisar pagamentos
          </span>
        </h1>
        <button className="btn-secondary" onClick={() => navigate('/app/mensalidades')}>
          Voltar
        </button>
      </div>

      {pendentes.length === 0 ? (
        <div className="table-wrapper">
          <p className="table-empty">Nenhum pagamento pendente de análise.</p>
        </div>
      ) : (
        <div className="analisar-list">
          {pendentes.map(m => (
            <div key={m.id} className="analisar-card">
              <div className="analisar-card-header">
                <span className="analisar-card-nome">{m.membroNome}</span>
                <span className="analisar-card-ref">{formatarReferencia(m.referencia)}</span>
                <span className="badge badge--pendente">pendente</span>
              </div>

              <div className="analisar-card-body">
                <div className="analisar-card-info">
                  <div>
                    <p className="analisar-detalhe-label">Valor pago</p>
                    <p className="analisar-detalhe-valor">{formatarMoeda(m.valor)}</p>
                  </div>
                  <div>
                    <p className="analisar-detalhe-label">Data de pagamento</p>
                    <p className="analisar-detalhe-valor">{formatarData(m.dataPagamento)}</p>
                  </div>
                  <div>
                    <p className="analisar-detalhe-label">Enviado em</p>
                    <p className="analisar-detalhe-valor">{formatarData(m.criadaEm)}</p>
                  </div>
                </div>

                {m.comprovante ? (
                  <div className="analisar-card-comprovante">
                    {m.nomeArquivo?.toLowerCase().endsWith('.pdf') ? (
                      <a href={m.comprovante} target="_blank" rel="noreferrer" className="btn-link">
                        📄 Ver PDF
                      </a>
                    ) : (
                      <a href={m.comprovante} target="_blank" rel="noreferrer" title="Clique para ampliar">
                        <img src={m.comprovante} alt="Comprovante" className="analisar-card-img" />
                      </a>
                    )}
                    <span className="form-hint">Comprovante</span>
                  </div>
                ) : (
                  <span className="form-hint">Sem comprovante</span>
                )}
              </div>

              {rejeitandoId === m.id ? (
                <div className="analisar-rejeitar-form">
                  <label>
                    Motivo da rejeição{' '}
                    <span style={{ fontWeight: 400, color: 'var(--color-text-muted)' }}>(opcional)</span>
                  </label>
                  <textarea
                    value={observacao}
                    onChange={e => setObservacao(e.target.value)}
                    placeholder="Descreva o motivo da rejeição..."
                  />
                  <div className="analisar-rejeitar-actions">
                    <button className="btn-danger" onClick={() => confirmarRejeicao(m.id)}>
                      Confirmar rejeição
                    </button>
                    <button
                      className="btn-secondary"
                      onClick={() => { setRejeitandoId(null); setObservacao('') }}
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              ) : (
                <div className="analisar-card-footer">
                  <button className="btn-primary" onClick={() => aprovar(m.id)}>
                    Aprovar
                  </button>
                  <button
                    className="btn-danger"
                    onClick={() => { setRejeitandoId(m.id); setObservacao('') }}
                  >
                    Rejeitar
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Analisar
