import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { atualizarUsuario } from '../data/db'

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

function Perfil() {
  const { usuario, entrar } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    nome:              usuario.nome              ?? '',
    telefone:          usuario.telefone          ?? '',
    contaAdm:          usuario.tipo === 'adm',
    endereco:          usuario.endereco          ?? '',
    bairro:            usuario.bairro            ?? '',
    cidade:            usuario.cidade            ?? '',
    cep:               usuario.cep               ?? '',
    dataNascimento:    usuario.dataNascimento    ?? '',
    dataBori:          usuario.dataBori          ?? '',
    filhoIniciado:     usuario.filhoIniciado     ?? false,
    dataIniciacao:     usuario.dataIniciacao     ?? '',
    ordemPosto:        usuario.ordemPosto        ?? '',
    orixa:             usuario.orixa             ?? '',
    orunko:            usuario.orunko            ?? '',
    nomeEre:           usuario.nomeEre           ?? '',
    madrinhasPadrinho: usuario.madrinhasPadrinho ?? '',
    maePaiPequeno:     usuario.maePaiPequeno     ?? '',
    senha:             '',
  })
  const [mostrarSenha, setMostrarSenha]   = useState(false)
  const [mostrarOrunko, setMostrarOrunko] = useState(false)
  const [erro, setErro]       = useState('')
  const [sucesso, setSucesso] = useState('')

  function handleChange(e) {
    const { name, value, type, checked } = e.target
    setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }))
    setErro('')
    setSucesso('')
  }

  function handleTelefone(e) {
    setForm(f => ({ ...f, telefone: mascaraTelefone(e.target.value) }))
    setErro('')
    setSucesso('')
  }

  function handleCep(e) {
    setForm(f => ({ ...f, cep: mascaraCep(e.target.value) }))
    setErro('')
    setSucesso('')
  }

  function handleSubmit(e) {
    e.preventDefault()
    setErro('')
    setSucesso('')

    if (!form.nome.trim()) {
      setErro('O nome é obrigatório.')
      return
    }

    const dados = {
      nome:              form.nome,
      telefone:          form.telefone,
      endereco:          form.endereco,
      bairro:            form.bairro,
      cidade:            form.cidade,
      cep:               form.cep,
      dataNascimento:    form.dataNascimento,
      dataBori:          form.dataBori,
      filhoIniciado:     form.filhoIniciado,
      dataIniciacao:     form.dataIniciacao,
      ordemPosto:        form.ordemPosto,
      orixa:             form.orixa,
      orunko:            form.orunko,
      nomeEre:           form.nomeEre,
      madrinhasPadrinho: form.madrinhasPadrinho,
      maePaiPequeno:     form.maePaiPequeno,
    }

    if (usuario.tipo === 'adm') {
      dados.tipo = form.contaAdm ? 'adm' : 'membro'
    }

    if (form.senha) dados.senha = form.senha

    atualizarUsuario(usuario.login, dados)
    entrar({ ...usuario, ...dados })

    setSucesso('Cadastro atualizado com sucesso.')
    setForm(f => ({ ...f, senha: '' }))
  }

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Meu perfil</h1>
      </div>

      <form onSubmit={handleSubmit} style={{ maxWidth: '800px' }} autoComplete="off">

        {/* ── Identificação ── */}
        <div className="form-section">
          <div className="form-section-header">Identificação</div>
          <div className="form-section-body">

            <div className="form-field">
              <label>Nome Completo</label>
              <input
                name="nome"
                value={form.nome}
                onChange={handleChange}
                placeholder="Nome completo"
              />
            </div>

            <div className="form-grid-3">
              <div className="form-field">
                <label>Usuário (login)</label>
                <input value={usuario.login} disabled />
              </div>
              <div className="form-field">
                <label>CPF</label>
                <input
                  value={usuario.cpf
                    ? usuario.cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
                    : '—'}
                  disabled
                />
              </div>
              <div className="form-field">
                <label>
                  Senha{' '}
                  <span style={{ fontWeight: 400, color: 'var(--color-text-muted)' }}>
                    (deixe em branco para não alterar)
                  </span>
                </label>
                <div className="form-input-group">
                  <input
                    type={mostrarSenha ? 'text' : 'password'}
                    name="senha"
                    value={form.senha}
                    onChange={handleChange}
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    className="form-input-group-btn"
                    onClick={() => setMostrarSenha(v => !v)}
                  >
                    {mostrarSenha ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>
            </div>

            <div className="form-grid-2">
              <div className="form-field">
                <label>Telefone</label>
                <input
                  name="telefone"
                  value={form.telefone}
                  onChange={handleTelefone}
                  placeholder="(00) 00000-0000"
                />
              </div>
              {usuario.tipo === 'adm' && (
                <div className="form-field form-field--checkbox">
                  <input
                    type="checkbox"
                    id="contaAdm"
                    name="contaAdm"
                    checked={form.contaAdm}
                    onChange={handleChange}
                  />
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
              <input
                name="endereco"
                value={form.endereco}
                onChange={handleChange}
                placeholder="Rua, número, complemento"
              />
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
                <input
                  type="checkbox"
                  id="filhoIniciado"
                  name="filhoIniciado"
                  checked={form.filhoIniciado}
                  onChange={handleChange}
                />
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
                        name="orunko"
                        value={form.orunko}
                        onChange={handleChange}
                        autoComplete="off"
                      />
                      <button
                        type="button"
                        className="form-input-group-btn"
                        onClick={() => setMostrarOrunko(v => !v)}
                      >
                        {mostrarOrunko ? '🙈' : '👁️'}
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

        {erro   && <p className="form-erro">{erro}</p>}
        {sucesso && <p className="form-sucesso">{sucesso}</p>}

        <div className="form-actions">
          <button type="submit" className="btn-primary">Salvar</button>
          <button type="button" className="btn-secondary" onClick={() => navigate('/app/home')}>
            Voltar
          </button>
        </div>

      </form>
    </div>
  )
}

export default Perfil
