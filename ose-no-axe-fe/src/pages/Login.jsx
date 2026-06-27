import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { findUsuario, loginExiste, cpfExiste, salvarUsuario } from '../data/db'
import logo from '../assets/logo.png'
import './Login.css'

function LoginForm() {
  const [form, setForm] = useState({ login: '', senha: '' })
  const [erro, setErro] = useState('')
  const { entrar } = useAuth()
  const navigate = useNavigate()

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  function handleSubmit(e) {
    e.preventDefault()
    setErro('')

    if (!form.login || !form.senha) {
      setErro('Preencha todos os campos.')
      return
    }

    const encontrado = findUsuario(form.login, form.senha)
    if (!encontrado) {
      setErro('Login ou senha incorretos.')
      return
    }

    const { senha, ...sessao } = encontrado
    entrar(sessao)
    navigate('/app/home')
  }

  return (
    <form className="login-form" onSubmit={handleSubmit}>
      <div className="login-field">
        <label htmlFor="login">Login</label>
        <input
          type="text"
          id="login"
          name="login"
          placeholder="Seu login"
          value={form.login}
          onChange={handleChange}
        />
      </div>
      <div className="login-field">
        <label htmlFor="senha">Senha</label>
        <input
          type="password"
          id="senha"
          name="senha"
          placeholder="Sua senha"
          value={form.senha}
          onChange={handleChange}
        />
      </div>
      {erro && <p className="login-erro">{erro}</p>}
      <button type="submit" className="login-btn-submit">Entrar</button>
    </form>
  )
}

function CadastroForm() {
  const [form, setForm] = useState({
    nome: '',
    cpf: '',
    login: '',
    dataBori: '',
    senha: '',
    confirmarSenha: '',
  })
  const [erro, setErro] = useState('')
  const { entrar } = useAuth()
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
    const novoValor = name === 'cpf' ? mascaraCpf(value) : value
    setForm({ ...form, [name]: novoValor })
  }

  function validarCpf(cpf) {
    return cpf.replace(/\D/g, '').length === 11
  }

  function handleSubmit(e) {
    e.preventDefault()
    setErro('')

    if (!form.nome || !form.cpf || !form.login || !form.dataBori || !form.senha || !form.confirmarSenha) {
      setErro('Preencha todos os campos.')
      return
    }

    if (!validarCpf(form.cpf)) {
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

    const novoUsuario = {
      nome: form.nome,
      cpf: form.cpf.replace(/\D/g, ''),
      login: form.login,
      dataBori: form.dataBori,
      senha: form.senha,
      tipo: 'membro',
    }

    const { senha, ...sessao } = novoUsuario
    salvarUsuario(novoUsuario)
    entrar(sessao)
    navigate('/app/home')
  }

  return (
    <form className="login-form" onSubmit={handleSubmit}>
      <div className="login-field">
        <label htmlFor="nome">Nome completo</label>
        <input
          type="text"
          id="nome"
          name="nome"
          placeholder="Seu nome completo"
          value={form.nome}
          onChange={handleChange}
        />
      </div>
      <div className="login-field">
        <label htmlFor="cpf">CPF</label>
        <input
          type="text"
          id="cpf"
          name="cpf"
          placeholder="000.000.000-00"
          value={form.cpf}
          onChange={handleChange}
        />
      </div>
      <div className="login-field">
        <label htmlFor="login">Login</label>
        <input
          type="text"
          id="login"
          name="login"
          placeholder="Escolha um login"
          value={form.login}
          onChange={handleChange}
        />
      </div>
      <div className="login-field">
        <label htmlFor="dataBori">Data de bori</label>
        <input
          type="date"
          id="dataBori"
          name="dataBori"
          value={form.dataBori}
          onChange={handleChange}
        />
      </div>
      <div className="login-field">
        <label htmlFor="senha">Senha</label>
        <input
          type="password"
          id="senha"
          name="senha"
          placeholder="Escolha uma senha"
          value={form.senha}
          onChange={handleChange}
        />
      </div>
      <div className="login-field">
        <label htmlFor="confirmarSenha">Confirmar senha</label>
        <input
          type="password"
          id="confirmarSenha"
          name="confirmarSenha"
          placeholder="Confirme sua senha"
          value={form.confirmarSenha}
          onChange={handleChange}
        />
      </div>
      {erro && <p className="login-erro">{erro}</p>}
      <button type="submit" className="login-btn-submit">Cadastrar</button>
    </form>
  )
}

function Login() {
  const [isRegistering, setIsRegistering] = useState(false)

  return (
    <div className="login-page">
      <div className="login-card">
        <img src={logo} alt="Osé no Axé" className="login-logo" />
        <h1 className="login-title">
          {isRegistering ? 'Cadastro' : 'Login'}
        </h1>
        {isRegistering ? <CadastroForm /> : <LoginForm />}
        <button
          className="login-toggle"
          onClick={() => setIsRegistering(!isRegistering)}
        >
          {isRegistering ? 'Já tenho conta' : 'Criar conta'}
        </button>
      </div>
    </div>
  )
}

export default Login
