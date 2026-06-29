import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { loginExiste, cpfExiste, salvarUsuario } from '../../../data/db'

function Novo() {
  const [form, setForm] = useState({
    nome: '',
    cpf: '',
    login: '',
    dataBori: '',
    senha: '',
    confirmarSenha: '',
    tipo: 'membro',
  })
  const [erro, setErro] = useState('')
  const navigate = useNavigate()

  function mascaraCpf(valor) {
    return valor
      .replace(/\D/g, '')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
      .slice(0, 14)
  }

  function handleChange(e) {
    const { name, value } = e.target
    setForm({ ...form, [name]: name === 'cpf' ? mascaraCpf(value) : value })
  }

  function handleSubmit(e) {
    e.preventDefault()
    setErro('')

    if (!form.nome || !form.cpf || !form.login || !form.dataBori || !form.senha || !form.confirmarSenha) {
      setErro('Preencha todos os campos.')
      return
    }

    if (form.cpf.replace(/\D/g, '').length !== 11) {
      setErro('CPF inválido. Informe 11 dígitos.')
      return
    }

    if (cpfExiste(form.cpf.replace(/\D/g, ''))) {
      setErro('Já existe um cadastro com este CPF.')
      return
    }

    if (loginExiste(form.login)) {
      setErro('Este login já está em uso.')
      return
    }

    if (form.senha !== form.confirmarSenha) {
      setErro('As senhas não coincidem.')
      return
    }

    salvarUsuario({
      nome: form.nome,
      cpf: form.cpf.replace(/\D/g, ''),
      login: form.login,
      dataBori: form.dataBori,
      senha: form.senha,
      tipo: form.tipo,
    })

    navigate('/app/cadastros')
  }

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Novo cadastro</h1>
      </div>

      <div className="form-card">
        <form onSubmit={handleSubmit}>
          <div className="form-field">
            <label>Nome completo</label>
            <input name="nome" value={form.nome} onChange={handleChange} placeholder="Nome completo" />
          </div>
          <div className="form-field">
            <label>CPF</label>
            <input name="cpf" value={form.cpf} onChange={handleChange} placeholder="000.000.000-00" />
          </div>
          <div className="form-field">
            <label>Login</label>
            <input name="login" value={form.login} onChange={handleChange} placeholder="Login de acesso" />
          </div>
          <div className="form-field">
            <label>Data de bori</label>
            <input type="date" name="dataBori" value={form.dataBori} onChange={handleChange} />
          </div>
          <div className="form-field">
            <label>Senha</label>
            <input type="password" name="senha" value={form.senha} onChange={handleChange} placeholder="Senha de acesso" />
          </div>
          <div className="form-field">
            <label>Confirmar senha</label>
            <input type="password" name="confirmarSenha" value={form.confirmarSenha} onChange={handleChange} placeholder="Confirme a senha" />
          </div>
          <div className="form-field">
            <label>Perfil</label>
            <select name="tipo" value={form.tipo} onChange={handleChange}>
              <option value="membro">Membro</option>
              <option value="adm">Administrador</option>
            </select>
          </div>

          {erro && <p className="form-erro">{erro}</p>}

          <div className="form-actions">
            <button type="submit" className="btn-primary">Salvar</button>
            <button type="button" className="btn-secondary" onClick={() => navigate('/app/cadastros')}>Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Novo
