import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import logo from '../assets/logo.png'
import './Navbar.css'

function Navbar() {
  const { usuario, sair } = useAuth()
  const navigate = useNavigate()

  function handleSair() {
    sair()
    navigate('/login')
  }

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <img src={logo} alt="Osé no Axé" className="navbar-logo" />
        <span className="navbar-system-name">Osé no Axé</span>
      </div>

      <ul className="navbar-links">
        <li>
          <NavLink to="/app/home" className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')}>
            Home
          </NavLink>
        </li>
        {usuario?.tipo === 'adm' && (
          <li>
            <NavLink to="/app/cadastros" className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')}>
              Cadastros
            </NavLink>
          </li>
        )}
        <li>
          <NavLink to="/app/mensalidades" className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')}>
            Mensalidades
          </NavLink>
        </li>
      </ul>

      <div className="navbar-footer">
        <NavLink
          to="/app/perfil"
          className={({ isActive }) => 'navbar-user' + (isActive ? ' navbar-user--ativo' : '')}
        >
          <span className="navbar-nome">{usuario?.nome}</span>
          <span className={`navbar-tipo navbar-tipo--${usuario?.tipo}`}>{usuario?.tipo}</span>
        </NavLink>
        <button className="navbar-sair" onClick={handleSair}>Sair</button>
      </div>
    </nav>
  )
}

export default Navbar
