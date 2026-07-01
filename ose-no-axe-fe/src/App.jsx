import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom'
import './App.css'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import Layout from './components/Layout'
import Login from './pages/Login'
import NotFound from './pages/NotFound'
import Home from './pages/Home'
import Perfil from './pages/Perfil'
import Cadastros from './apps/cadastros/pages'
import Novo from './apps/cadastros/pages/Novo'
import Editar from './apps/cadastros/pages/Editar'
import Mensalidades from './apps/mensalidades/pages'
import Registrar from './apps/mensalidades/pages/Registrar'
import Analisar from './apps/mensalidades/pages/Analisar'
import List from './apps/mensalidades/pages/list'
import Detail from './apps/mensalidades/pages/list/Detail'

function ProtectedRoute() {
  const { usuario } = useAuth()
  return usuario ? <Outlet /> : <Navigate to="/login" replace />
}

function AdminRoute() {
  const { usuario } = useAuth()
  return usuario?.tipo === 'adm' ? <Outlet /> : <Navigate to="/app/home" replace />
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/cadastro" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/app" element={<ProtectedRoute />}>
            <Route element={<Layout />}>
              <Route path="home" element={<Home />} />
              <Route path="perfil" element={<Perfil />} />
              <Route path="mensalidades" element={<Mensalidades />} />
              <Route path="mensalidades/registrar" element={<Registrar />} />
              <Route path="mensalidades/analisar" element={<Analisar />} />
              <Route path="mensalidades/list" element={<List />} />
              <Route path="mensalidades/list/:id" element={<Detail />} />
              <Route element={<AdminRoute />}>
                <Route path="cadastros" element={<Cadastros />} />
                <Route path="cadastros/novo" element={<Novo />} />
                <Route path="cadastros/editar/:login" element={<Editar />} />
              </Route>
            </Route>
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
