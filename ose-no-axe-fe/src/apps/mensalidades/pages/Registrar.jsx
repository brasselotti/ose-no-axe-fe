import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../../contexts/AuthContext'
import { salvarMensalidade, buscarMensalidadesPorMembro, findUsuario, listarUsuarios } from '../../../data/db'

const MESES = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
]

function formatarReferencia(ref) {
  if (!ref) return '—'
  const [ano, mes] = ref.split('-')
  return `${MESES[parseInt(mes, 10) - 1]} ${ano}`
}

function formatarMoeda(digitos) {
  if (!digitos) return ''
  return (parseInt(digitos, 10) / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

function Registrar() {
  const { usuario } = useAuth()
  const navigate = useNavigate()

  const membros = usuario.tipo === 'adm' ? listarUsuarios() : []

  const [form, setForm] = useState({
    membroLogin:  usuario.tipo === 'adm' ? '' : usuario.login,
    nomeCompleto: usuario.tipo === 'adm' ? '' : usuario.nome,
    valor:        '',
    referencia:   '',
    dataPagamento: '',
    comprovante:  null,
    nomeArquivo:  '',
    senha:        '',
  })
  const [erro, setErro]           = useState('')
  const [sucesso, setSucesso]     = useState('')
  const [carregando, setCarregando] = useState(false)

  function handleChange(e) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
    setErro(''); setSucesso('')
  }

  function handleMembroChange(e) {
    const login = e.target.value
    const membro = membros.find(m => m.login === login)
    setForm(f => ({ ...f, membroLogin: login, nomeCompleto: membro?.nome ?? '' }))
    setErro(''); setSucesso('')
  }

  function handleValorChange(e) {
    const raw = e.target.value.replace(/\D/g, '')
    setForm(f => ({ ...f, valor: raw }))
    setErro(''); setSucesso('')
  }

  function handleFile(e) {
    const file = e.target.files[0]
    if (!file) return
    setErro(''); setSucesso('')

    if (file.size > 2 * 1024 * 1024) {
      setErro('Arquivo muito grande. O tamanho máximo é 2 MB.')
      e.target.value = ''
      return
    }

    setCarregando(true)
    const reader = new FileReader()
    reader.onload = () => {
      setForm(f => ({ ...f, comprovante: reader.result, nomeArquivo: file.name }))
      setCarregando(false)
    }
    reader.readAsDataURL(file)
  }

  function handleSubmit(e) {
    e.preventDefault()
    setErro(''); setSucesso('')

    if (!form.membroLogin || !form.valor || !form.referencia || !form.dataPagamento || !form.senha) {
      setErro('Preencha todos os campos obrigatórios.')
      return
    }

    if (parseInt(form.valor, 10) === 0) {
      setErro('Informe um valor válido.')
      return
    }

    if (!findUsuario(usuario.login, form.senha)) {
      setErro('Senha incorreta.')
      return
    }

    const existentes = buscarMensalidadesPorMembro(form.membroLogin)
    const duplicada = existentes.find(
      m => m.referencia === form.referencia && (m.status === 'pendente' || m.status === 'aprovado')
    )

    if (duplicada) {
      const motivo = duplicada.status === 'aprovado' ? 'aprovado' : 'aguardando análise'
      setErro(`Já existe um comprovante ${motivo} para ${formatarReferencia(form.referencia)}.`)
      return
    }

    salvarMensalidade({
      id:            crypto.randomUUID(),
      membroLogin:   form.membroLogin,
      membroNome:    form.nomeCompleto,
      valor:         parseInt(form.valor, 10) / 100,
      referencia:    form.referencia,
      dataPagamento: form.dataPagamento,
      comprovante:   form.comprovante,
      nomeArquivo:   form.nomeArquivo,
      status:        'pendente',
      observacao:    '',
      criadaEm:      new Date().toISOString(),
      analisadaEm:   null,
      analisadaPor:  null,
    })

    setSucesso(`Comprovante de ${formatarReferencia(form.referencia)} enviado! Aguarde a análise.`)
    setForm({
      membroLogin:   usuario.tipo === 'adm' ? '' : usuario.login,
      nomeCompleto:  usuario.tipo === 'adm' ? '' : usuario.nome,
      valor: '', referencia: '', dataPagamento: '',
      comprovante: null, nomeArquivo: '', senha: '',
    })
  }

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">
          Mensalidades{' '}
          <span style={{ fontWeight: 400, color: 'var(--color-text-muted)' }}>// Registrar pagamento</span>
        </h1>
      </div>

      <form onSubmit={handleSubmit} style={{ maxWidth: '800px' }} autoComplete="off">

        {/* ── Dados do pagamento ── */}
        <div className="form-section">
          <div className="form-section-header">Dados do pagamento</div>
          <div className="form-section-body">

            <div className="form-field">
              <label>Nome Completo</label>
              {usuario.tipo === 'adm' ? (
                <select name="membroLogin" value={form.membroLogin} onChange={handleMembroChange}>
                  <option value="">Selecione um membro</option>
                  {membros.map(m => (
                    <option key={m.login} value={m.login}>{m.nome}</option>
                  ))}
                </select>
              ) : (
                <input value={form.nomeCompleto} disabled />
              )}
            </div>

            <div className="form-grid-2">
              <div className="form-field">
                <label>Valor Pago</label>
                <input
                  type="text"
                  inputMode="numeric"
                  name="valor"
                  value={formatarMoeda(form.valor)}
                  onChange={handleValorChange}
                  placeholder="R$ 0,00"
                />
              </div>
              <div className="form-field">
                <label>Mês de referência</label>
                <input
                  type="month"
                  name="referencia"
                  value={form.referencia}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-grid-2">
              <div className="form-field">
                <label>Data de pagamento</label>
                <input
                  type="date"
                  name="dataPagamento"
                  value={form.dataPagamento}
                  onChange={handleChange}
                />
              </div>
              <div className="form-field">
                <label>
                  Comprovante{' '}
                  <span style={{ fontWeight: 400, color: 'var(--color-text-muted)' }}>(opcional)</span>
                </label>
                <input type="file" accept="image/*,.pdf" onChange={handleFile} />
                <span className="form-hint">Imagem ou PDF — máximo 2 MB</span>
              </div>
            </div>

            {carregando && <p className="form-hint">Carregando arquivo...</p>}

            {form.comprovante && !carregando && (
              <div className="form-field">
                <label>Pré-visualização</label>
                {!form.nomeArquivo.toLowerCase().endsWith('.pdf') ? (
                  <img
                    src={form.comprovante}
                    alt="Comprovante"
                    style={{ maxWidth: '100%', maxHeight: '180px', borderRadius: '8px', objectFit: 'contain' }}
                  />
                ) : (
                  <p className="form-hint">📄 {form.nomeArquivo}</p>
                )}
              </div>
            )}

          </div>
        </div>

        {/* ── Confirmação ── */}
        <div className="confirmar-pagamento">
          <p className="confirmar-pagamento-label">Confirmar pagamento</p>
          <div className="confirmar-pagamento-actions">
            <input
              type="password"
              name="senha"
              value={form.senha}
              onChange={handleChange}
              placeholder="Senha"
              autoComplete="new-password"
              style={{ flex: 1, minWidth: '180px', padding: '0.625rem 0.875rem', border: '1.5px solid #d1d5db', borderRadius: '8px', fontSize: '0.9rem' }}
            />
            <button type="submit" className="btn-primary" disabled={carregando}>
              Enviar
            </button>
          </div>
        </div>

        {erro   && <p className="form-erro" style={{ marginTop: '1rem' }}>{erro}</p>}
        {sucesso && <p className="form-sucesso" style={{ marginTop: '1rem' }}>{sucesso}</p>}

        <div className="form-actions" style={{ marginTop: '1.5rem' }}>
          <button type="button" className="btn-secondary" onClick={() => navigate('/app/mensalidades')}>
            Voltar
          </button>
        </div>

      </form>
    </div>
  )
}

export default Registrar
