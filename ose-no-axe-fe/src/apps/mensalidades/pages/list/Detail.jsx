import { useState } from 'react'
import { Navigate, useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../../../../contexts/AuthContext'
import { buscarUsuarioPorLogin, buscarMensalidadesPorMembro } from '../../../../data/db'
import './Detail.css'

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

const FILTROS = [
  { valor: 'todos',    label: 'Todos' },
  { valor: 'aprovado', label: 'Aprovados' },
  { valor: 'pendente', label: 'Pendentes' },
  { valor: 'rejeitado',label: 'Rejeitados' },
]

function Detail() {
  const { id: loginParam } = useParams()
  const { usuario } = useAuth()
  const navigate = useNavigate()
  const [filtro, setFiltro] = useState('todos')

  if (usuario.tipo !== 'adm' && usuario.login !== loginParam) {
    return <Navigate to={`/app/mensalidades/list/${usuario.login}`} replace />
  }

  const membro = buscarUsuarioPorLogin(loginParam)
  if (!membro) {
    return <Navigate to="/app/mensalidades" replace />
  }

  const todasMensalidades = buscarMensalidadesPorMembro(loginParam)
    .sort((a, b) => new Date(b.criadaEm) - new Date(a.criadaEm))

  const mensalidades = filtro === 'todos'
    ? todasMensalidades
    : todasMensalidades.filter(m => m.status === filtro)

  const contagem = {
    todos:     todasMensalidades.length,
    aprovado:  todasMensalidades.filter(m => m.status === 'aprovado').length,
    pendente:  todasMensalidades.filter(m => m.status === 'pendente').length,
    rejeitado: todasMensalidades.filter(m => m.status === 'rejeitado').length,
  }

  const voltarUrl = '/app/mensalidades'

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">
          Mensalidades{' '}
          <span style={{ fontWeight: 400, color: 'var(--color-text-muted)' }}>
            // Histórico de {membro.nome.split(' ')[0]}
          </span>
        </h1>
        <button className="btn-secondary" onClick={() => navigate(voltarUrl)}>
          Voltar
        </button>
      </div>

      <div className="detail-membro-card">
        <div className="detail-membro-info">
          <span className="detail-membro-nome">{membro.nome}</span>
          <span className="detail-membro-login">@{membro.login}</span>
        </div>
        <span className={`badge badge--${membro.tipo}`}>{membro.tipo}</span>
      </div>

      <div className="detail-filtros">
        {FILTROS.map(f => (
          <button
            key={f.valor}
            className={`detail-filtro-btn${filtro === f.valor ? ' detail-filtro-btn--ativo' : ''}`}
            onClick={() => setFiltro(f.valor)}
          >
            {f.label}
            <span className="detail-filtro-count">{contagem[f.valor]}</span>
          </button>
        ))}
      </div>

      {mensalidades.length === 0 ? (
        <div className="table-wrapper">
          <p className="table-empty">
            {filtro === 'todos'
              ? 'Nenhum registro encontrado.'
              : `Nenhum pagamento ${filtro}.`}
          </p>
        </div>
      ) : (
        <div className="detail-list">
          {mensalidades.map(m => (
            <div key={m.id} className="detail-card">
              <div className="detail-card-header">
                <span className="detail-card-ref">{formatarReferencia(m.referencia)}</span>
                <span className={`badge badge--${m.status}`}>{m.status}</span>
              </div>

              <div className="detail-card-body">
                <div className="detail-card-info">
                  <div>
                    <p className="detail-detalhe-label">Valor pago</p>
                    <p className="detail-detalhe-valor">{formatarMoeda(m.valor)}</p>
                  </div>
                  <div>
                    <p className="detail-detalhe-label">Data de pagamento</p>
                    <p className="detail-detalhe-valor">{formatarData(m.dataPagamento)}</p>
                  </div>
                  <div>
                    <p className="detail-detalhe-label">Enviado em</p>
                    <p className="detail-detalhe-valor">{formatarData(m.criadaEm)}</p>
                  </div>
                  {m.analisadaEm && (
                    <div>
                      <p className="detail-detalhe-label">Analisado em</p>
                      <p className="detail-detalhe-valor">{formatarData(m.analisadaEm)}</p>
                    </div>
                  )}
                </div>

                {m.comprovante ? (
                  <div className="detail-comprovante">
                    {m.nomeArquivo?.toLowerCase().endsWith('.pdf') ? (
                      <a href={m.comprovante} target="_blank" rel="noreferrer" className="btn-link">
                        📄 Ver PDF
                      </a>
                    ) : (
                      <a href={m.comprovante} target="_blank" rel="noreferrer" title="Clique para ampliar">
                        <img
                          src={m.comprovante}
                          alt="Comprovante"
                          className="detail-comprovante-img"
                        />
                      </a>
                    )}
                    <span className="form-hint">Comprovante</span>
                  </div>
                ) : (
                  <span className="form-hint" style={{ alignSelf: 'center' }}>Sem comprovante</span>
                )}
              </div>

              {m.status === 'rejeitado' && m.observacao && (
                <div className="detail-observacao">
                  <p className="detail-detalhe-label">Motivo da rejeição</p>
                  <p className="detail-observacao-texto">{m.observacao}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Detail
