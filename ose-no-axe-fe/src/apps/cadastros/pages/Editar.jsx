import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { buscarUsuarioPorLogin, atualizarUsuario } from '../../../data/db'
import { useAuth } from '../../../contexts/AuthContext'

function Editar() {
  const { login } = useParams()
  const navigate = useNavigate()
  const { usuario: usuarioLogado, entrar } = useAuth()
  const [form, setForm] = useState({ nome: '', dataBori: '', senha: '', confirmarSenha: '', tipo: '' })
  const [erro, setErro] = useState('')
  const [sucesso, setSucesso] = useState('')

  useEffect(() => {
    const u = buscarUsuarioPorLogin(login)
    if (!u) {
      navigate('/app/cadastros')
      return
    }
    setForm({ nome: u.nome, dataBori: u.dataBori, senha: '', confirmarSenha: '', tipo: u.tipo })
  }, [login])

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  function handleSubmit(e) {
    e.preventDefault()
    setErro('')
    setSucesso('')

    if (!form.nome || !form.dataBori || !form.tipo) {
      setErro('Preencha os campos obrigatórios.')
      return
    }

    if (form.senha && form.senha !== form.confirmarSenha) {
      setErro('As senhas não coincidem.')
      return
    }

    const dados = { nome: form.nome, dataBori: form.dataBori, tipo: form.tipo }
    if (form.senha) dados.senha = form.senha

    atualizarUsuario(login, dados)

    if (usuarioLogado.login === login) {
      entrar({ ...usuarioLogado, ...dados })
    }

    setSucesso('Cadastro atualizado com sucesso.')
  }

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Editar cadastro</h1>
      </div>

      <div className="form-card">
        <form onSubmit={handleSubmit}>
          <div className="form-field">
            <label>Login</label>
            <input value={login} disabled />
          </div>
          <div className="form-field">
            <label>Nome completo</label>
            <input name="nome" value={form.nome} onChange={handleChange} placeholder="Nome completo" />
          </div>
          <div className="form-field">
            <label>Data de bori</label>
            <input type="date" name="dataBori" value={form.dataBori} onChange={handleChange} />
          </div>
          <div className="form-field">
            <label>
              Nova senha{' '}
              <span style={{ fontWeight: 400, color: 'var(--color-text-muted)' }}>
                (deixe em branco para manter)
              </span>
            </label>
            <input type="password" name="senha" value={form.senha} onChange={handleChange} placeholder="Nova senha" />
          </div>
          <div className="form-field">
            <label>Confirmar nova senha</label>
            <input type="password" name="confirmarSenha" value={form.confirmarSenha} onChange={handleChange} placeholder="Confirme a nova senha" />
          </div>
          <div className="form-field">
            <label>Perfil</label>
            <select name="tipo" value={form.tipo} onChange={handleChange}>
              <option value="membro">Membro</option>
              <option value="adm">Administrador</option>
            </select>
          </div>

          {erro && <p className="form-erro">{erro}</p>}
          {sucesso && <p className="form-sucesso">{sucesso}</p>}

          <div className="form-actions">
            <button type="submit" className="btn-primary">Salvar</button>
            <button type="button" className="btn-secondary" onClick={() => navigate('/app/cadastros')}>Voltar</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Editar
