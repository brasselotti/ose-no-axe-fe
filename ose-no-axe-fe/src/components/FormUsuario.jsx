import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { buscarUsuarioPorLogin, atualizarUsuario, salvarUsuario, deletarUsuario, loginExiste, cpfExiste } from '../data/db'

function mascaraTelefone(valor) {
  const d = valor.replace(/\D/g, '').slice(0, 11)
  if (d.length <= 2) return `(${d}`
  if (d.length <= 7) return `(${d.slice(0, 2)}) ${d.slice(2)}`
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`
}

function mascaraCep(valor) {
  const d = valor.replace(/\D/g, '').slice(0, 8)
  if (d.length <= 5) return d
  return `${d.slice(0, 5)}-${d.slice(5)}`
}

function mascaraCpf(valor) {
  return valor
    .replace(/\D/g, '')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
    .slice(0, 14)
}

function cpfFormatado(cpf) {
  if (!cpf) return ''
  const d = cpf.replace(/\D/g, '')
  return d.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
}

function IconEye() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  )
}

function IconEyeOff() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  )
}

const TITULOS = { novo: 'Novo cadastro', perfil: 'Meu perfil', editar: 'Editar cadastro' }
const VOLTAR  = { novo: '/app/cadastros', perfil: '/app/home', editar: '/app/cadastros' }

function estadoVazio() {
  return {
    nome: '', cpf: '', login: '', telefone: '', contaAdm: false,
    endereco: '', bairro: '', cidade: '', cep: '',
    dataNascimento: '', dataBori: '', filhoIniciado: false,
    dataIniciacao: '', ordemPosto: '', orixa: '', orunko: '',
    nomeEre: '', madrinhasPadrinho: '', maePaiPequeno: '',
    senha: '', confirmarSenha: '',
  }
}

function estadoDeUsuario(u) {
  return {
    nome:              u.nome              ?? '',
    cpf:               cpfFormatado(u.cpf),
    login:             u.login             ?? '',
    telefone:          u.telefone          ?? '',
    contaAdm:          u.tipo === 'adm',
    endereco:          u.endereco          ?? '',
    bairro:            u.bairro            ?? '',
    cidade:            u.cidade            ?? '',
    cep:               u.cep               ?? '',
    dataNascimento:    u.dataNascimento    ?? '',
    dataBori:          u.dataBori          ?? '',
    filhoIniciado:     u.filhoIniciado     ?? false,
    dataIniciacao:     u.dataIniciacao     ?? '',
    ordemPosto:        u.ordemPosto        ?? '',
    orixa:             u.orixa             ?? '',
    orunko:            u.orunko            ?? '',
    nomeEre:           u.nomeEre           ?? '',
    madrinhasPadrinho: u.madrinhasPadrinho ?? '',
    maePaiPequeno:     u.maePaiPequeno     ?? '',
    senha: '', confirmarSenha: '',
  }
}

function FormUsuario({ modo }) {
  const { usuario: usuarioLogado, entrar } = useAuth()
  const { login: loginParam } = useParams()
  const navigate = useNavigate()

  const [originalLogin, setOriginalLogin] = useState('')
  const [originalCpf, setOriginalCpf]     = useState('')
  const [form, setForm] = useState(null)

  const [mostrarSenha, setMostrarSenha]         = useState(false)
  const [mostrarConfirmar, setMostrarConfirmar] = useState(false)
  const [mostrarOrunko, setMostrarOrunko]       = useState(false)
  const [confirmarExclusao, setConfirmarExclusao] = useState(false)
  const [erro, setErro]       = useState('')
  const [sucesso, setSucesso] = useState('')

  useEffect(() => {
    if (modo === 'novo') {
      setForm(estadoVazio())
    } else if (modo === 'perfil') {
      setOriginalLogin(usuarioLogado.login)
      setOriginalCpf(usuarioLogado.cpf ?? '')
      setForm(estadoDeUsuario(usuarioLogado))
    } else {
      const u = buscarUsuarioPorLogin(loginParam)
      if (!u) { navigate('/app/cadastros'); return }
      setOriginalLogin(u.login)
      setOriginalCpf(u.cpf ?? '')
      setForm(estadoDeUsuario(u))
    }
  }, [modo, loginParam])

  if (!form) return null

  function handleChange(e) {
    const { name, value, type, checked } = e.target
    setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }))
    setErro(''); setSucesso('')
  }

  function handleCpf(e) {
    setForm(f => ({ ...f, cpf: mascaraCpf(e.target.value) }))
    setErro(''); setSucesso('')
  }

  function handleTelefone(e) {
    setForm(f => ({ ...f, telefone: mascaraTelefone(e.target.value) }))
    setErro(''); setSucesso('')
  }

  function handleCep(e) {
    setForm(f => ({ ...f, cep: mascaraCep(e.target.value) }))
    setErro(''); setSucesso('')
  }

  function handleSubmit(e) {
    e.preventDefault()
    setErro(''); setSucesso('')

    if (!form.nome.trim()) { setErro('O nome é obrigatório.'); return }

    const cpfDigits = form.cpf.replace(/\D/g, '')

    if (modo === 'novo') {
      if (!form.login || !form.dataBori || !form.senha || !form.confirmarSenha) {
        setErro('Preencha todos os campos obrigatórios.')
        return
      }
      if (cpfDigits && cpfDigits.length !== 11) { setErro('CPF inválido. Informe 11 dígitos.'); return }
      if (cpfDigits && cpfExiste(cpfDigits))    { setErro('Já existe um cadastro com este CPF.'); return }
      if (loginExiste(form.login)) { setErro('Este login já está em uso.'); return }
      if (form.senha !== form.confirmarSenha) { setErro('As senhas não coincidem.'); return }

      salvarUsuario({
        nome: form.nome, cpf: cpfDigits, login: form.login, senha: form.senha,
        tipo: form.contaAdm ? 'adm' : 'membro',
        telefone: form.telefone, endereco: form.endereco, bairro: form.bairro,
        cidade: form.cidade, cep: form.cep, dataNascimento: form.dataNascimento,
        dataBori: form.dataBori, filhoIniciado: form.filhoIniciado,
        dataIniciacao: form.dataIniciacao, ordemPosto: form.ordemPosto,
        orixa: form.orixa, orunko: form.orunko, nomeEre: form.nomeEre,
        madrinhasPadrinho: form.madrinhasPadrinho, maePaiPequeno: form.maePaiPequeno,
      })
      navigate('/app/cadastros')
      return
    }

    if (cpfDigits && cpfDigits.length !== 11) { setErro('CPF inválido. Informe 11 dígitos.'); return }

    if (form.login !== originalLogin && loginExiste(form.login)) {
      setErro('Este login já está em uso.'); return
    }
    if (cpfDigits !== originalCpf && cpfDigits && cpfExiste(cpfDigits)) {
      setErro('Já existe um cadastro com este CPF.'); return
    }

    const dados = {
      nome: form.nome, cpf: cpfDigits || originalCpf,
      login: form.login || originalLogin,
      telefone: form.telefone, tipo: form.contaAdm ? 'adm' : 'membro',
      endereco: form.endereco, bairro: form.bairro, cidade: form.cidade, cep: form.cep,
      dataNascimento: form.dataNascimento, dataBori: form.dataBori,
      filhoIniciado: form.filhoIniciado, dataIniciacao: form.dataIniciacao,
      ordemPosto: form.ordemPosto, orixa: form.orixa, orunko: form.orunko,
      nomeEre: form.nomeEre, madrinhasPadrinho: form.madrinhasPadrinho,
      maePaiPequeno: form.maePaiPequeno,
    }
    if (form.senha) dados.senha = form.senha

    const chave = modo === 'perfil' ? usuarioLogado.login : loginParam
    atualizarUsuario(chave, dados)

    if (modo === 'perfil' || (modo === 'editar' && loginParam === usuarioLogado.login)) {
      entrar({ ...usuarioLogado, ...dados })
    }

    setSucesso('Cadastro atualizado com sucesso.')
    setForm(f => ({ ...f, senha: '', confirmarSenha: '' }))
    setOriginalLogin(dados.login)
    setOriginalCpf(dados.cpf)
  }

  const mostrarContaAdm = modo === 'perfil' ? usuarioLogado.tipo === 'adm' : true

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">{TITULOS[modo]}</h1>
      </div>

      <form onSubmit={handleSubmit} style={{ maxWidth: '800px' }} autoComplete="off">

        {/* ── Identificação ── */}
        <div className="form-section">
          <div className="form-section-header">Identificação</div>
          <div className="form-section-body">

            <div className="form-field">
              <label>Nome Completo</label>
              <input name="nome" value={form.nome} onChange={handleChange} placeholder="Nome completo" />
            </div>

            <div className="form-grid-2">
              <div className="form-field">
                <label>CPF</label>
                <input name="cpf" value={form.cpf} onChange={handleCpf} placeholder="000.000.000-00" />
              </div>
              <div className="form-field">
                <label>Usuário (login)</label>
                <input name="login" value={form.login} onChange={handleChange} placeholder="Login de acesso" />
              </div>
            </div>

            <div className="form-grid-2">
              <div className="form-field">
                <label>Telefone</label>
                <input name="telefone" value={form.telefone} onChange={handleTelefone} placeholder="(00) 00000-0000" />
              </div>
              {mostrarContaAdm && (
                <div className="form-field form-field--checkbox">
                  <input type="checkbox" id="contaAdm" name="contaAdm" checked={form.contaAdm} onChange={handleChange} />
                  <label htmlFor="contaAdm">Conta de Administrador</label>
                </div>
              )}
            </div>

          </div>
        </div>

        {/* ── Endereço ── */}
        <div className="form-section">
          <div className="form-section-header">Endereço</div>
          <div className="form-section-body">

            <div className="form-field">
              <label>Endereço</label>
              <input name="endereco" value={form.endereco} onChange={handleChange} placeholder="Rua, número, complemento" />
            </div>

            <div className="form-grid-3">
              <div className="form-field">
                <label>Bairro</label>
                <input name="bairro" value={form.bairro} onChange={handleChange} placeholder="Bairro" />
              </div>
              <div className="form-field">
                <label>Cidade</label>
                <input name="cidade" value={form.cidade} onChange={handleChange} placeholder="Cidade" />
              </div>
              <div className="form-field">
                <label>CEP</label>
                <input name="cep" value={form.cep} onChange={handleCep} placeholder="00000-000" />
              </div>
            </div>

          </div>
        </div>

        {/* ── Informações do Médium ── */}
        <div className="form-section">
          <div className="form-section-header">Informações do Médium</div>
          <div className="form-section-body">

            <div className="form-grid-3">
              <div className="form-field">
                <label>Data de Nascimento</label>
                <input type="date" name="dataNascimento" value={form.dataNascimento} onChange={handleChange} />
              </div>
              <div className="form-field">
                <label>Data de Bori</label>
                <input type="date" name="dataBori" value={form.dataBori} onChange={handleChange} />
              </div>
              <div className="form-field form-field--checkbox">
                <input type="checkbox" id="filhoIniciado" name="filhoIniciado" checked={form.filhoIniciado} onChange={handleChange} />
                <label htmlFor="filhoIniciado">Filho Iniciado?</label>
              </div>
            </div>

            {form.filhoIniciado && (
              <>
                <div className="form-grid-3">
                  <div className="form-field">
                    <label>Data de Iniciação</label>
                    <input type="date" name="dataIniciacao" value={form.dataIniciacao} onChange={handleChange} />
                  </div>
                  <div className="form-field">
                    <label>Ordem / Posto</label>
                    <input name="ordemPosto" value={form.ordemPosto} onChange={handleChange} placeholder="Ex: Dofono" />
                  </div>
                  <div className="form-field">
                    <label>Orixá</label>
                    <input name="orixa" value={form.orixa} onChange={handleChange} placeholder="Ex: Oxaguian" />
                  </div>
                </div>

                <div className="form-grid-3">
                  <div className="form-field">
                    <label>Orunkó</label>
                    <div className="form-input-group">
                      <input
                        type={mostrarOrunko ? 'text' : 'password'}
                        name="orunko" value={form.orunko} onChange={handleChange} autoComplete="off"
                      />
                      <button type="button" className="form-input-group-btn" onClick={() => setMostrarOrunko(v => !v)}>
                        {mostrarOrunko ? <IconEyeOff /> : <IconEye />}
                      </button>
                    </div>
                  </div>
                  <div className="form-field">
                    <label>Nome do Erê</label>
                    <input name="nomeEre" value={form.nomeEre} onChange={handleChange} />
                  </div>
                  <div className="form-field">
                    <label>Madrinha / Padrinho</label>
                    <input name="madrinhasPadrinho" value={form.madrinhasPadrinho} onChange={handleChange} />
                  </div>
                </div>

                <div className="form-grid-3">
                  <div className="form-field">
                    <label>Mãe / Pai Pequeno(a)</label>
                    <input name="maePaiPequeno" value={form.maePaiPequeno} onChange={handleChange} />
                  </div>
                </div>
              </>
            )}

          </div>
        </div>

        {/* ── Acesso ── */}
        <div className="form-section">
          <div className="form-section-header">Acesso</div>
          <div className="form-section-body">

            {modo === 'novo' ? (
              <div className="form-grid-2">
                <div className="form-field">
                  <label>Senha</label>
                  <div className="form-input-group">
                    <input
                      type={mostrarSenha ? 'text' : 'password'}
                      name="senha" value={form.senha} onChange={handleChange}
                      placeholder="Senha de acesso" autoComplete="new-password"
                    />
                    <button type="button" className="form-input-group-btn" onClick={() => setMostrarSenha(v => !v)}>
                      {mostrarSenha ? <IconEyeOff /> : <IconEye />}
                    </button>
                  </div>
                </div>
                <div className="form-field">
                  <label>Confirmar senha</label>
                  <div className="form-input-group">
                    <input
                      type={mostrarConfirmar ? 'text' : 'password'}
                      name="confirmarSenha" value={form.confirmarSenha} onChange={handleChange}
                      placeholder="Confirme a senha" autoComplete="new-password"
                    />
                    <button type="button" className="form-input-group-btn" onClick={() => setMostrarConfirmar(v => !v)}>
                      {mostrarConfirmar ? <IconEyeOff /> : <IconEye />}
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="form-field">
                <label>
                  Senha{' '}
                  <span style={{ fontWeight: 400, color: 'var(--color-text-muted)' }}>
                    (deixe em branco para não alterar)
                  </span>
                </label>
                <div className="form-input-group" style={{ maxWidth: '360px' }}>
                  <input
                    type={mostrarSenha ? 'text' : 'password'}
                    name="senha" value={form.senha} onChange={handleChange}
                    autoComplete="new-password"
                  />
                  <button type="button" className="form-input-group-btn" onClick={() => setMostrarSenha(v => !v)}>
                    {mostrarSenha ? <IconEyeOff /> : <IconEye />}
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>

        {erro   && <p className="form-erro">{erro}</p>}
        {sucesso && <p className="form-sucesso">{sucesso}</p>}

        <div className="form-actions">
          <button type="submit" className="btn-primary">Salvar</button>
          <button type="button" className="btn-secondary" onClick={() => navigate(VOLTAR[modo])}>
            {modo === 'novo' ? 'Cancelar' : 'Voltar'}
          </button>
          {modo === 'editar' && !confirmarExclusao && (
            <button type="button" className="btn-danger" style={{ marginLeft: 'auto' }} onClick={() => setConfirmarExclusao(true)}>
              Excluir membro
            </button>
          )}
        </div>

        {modo === 'editar' && confirmarExclusao && (
          <div className="confirmar-pagamento" style={{ backgroundColor: '#fff5f5', marginTop: '1rem' }}>
            <p className="confirmar-pagamento-label" style={{ color: '#b91c1c' }}>
              Tem certeza? Esta ação não pode ser desfeita.
            </p>
            <div className="confirmar-pagamento-actions">
              <button
                type="button"
                className="btn-danger"
                onClick={() => { deletarUsuario(loginParam); navigate('/app/cadastros') }}
              >
                Confirmar exclusão
              </button>
              <button type="button" className="btn-secondary" onClick={() => setConfirmarExclusao(false)}>
                Cancelar
              </button>
            </div>
          </div>
        )}

      </form>
    </div>
  )
}

export default FormUsuario
