import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { listarUsuarios } from '../../../data/db'

function formatarCpf(cpf) {
  const c = (cpf ?? '').replace(/\D/g, '')
  return c.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
}

function Cadastros() {
  const [usuarios] = useState(() => listarUsuarios())
  const navigate = useNavigate()

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Cadastros</h1>
        <Link to="/app/cadastros/novo" className="btn-primary">Novo cadastro</Link>
      </div>

      <div className="table-wrapper">
        <table className="table">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Login</th>
              <th>CPF</th>
              <th>Data de bori</th>
              <th>Perfil</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {usuarios.length === 0 ? (
              <tr>
                <td colSpan={6} className="table-empty">Nenhum membro cadastrado.</td>
              </tr>
            ) : (
              usuarios.map(u => (
                <tr key={u.login}>
                  <td>{u.nome}</td>
                  <td>{u.login}</td>
                  <td>{formatarCpf(u.cpf)}</td>
                  <td>{u.dataBori ? new Date(u.dataBori + 'T00:00:00').toLocaleDateString('pt-BR') : '—'}</td>
                  <td>
                    <span className={`badge badge--${u.tipo}`}>{u.tipo}</span>
                  </td>
                  <td>
                    <button
                      className="btn-link"
                      onClick={() => navigate(`/app/cadastros/editar/${u.login}`)}
                    >
                      Editar
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Cadastros
