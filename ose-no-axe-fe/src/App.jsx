import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom'
import Cadastro from './pages/Cadastro'
import Login from './pages/Login'
import Home from './pages/Home'
import Cadastros from './apps/cadastros/pages'
import Novo from './apps/cadastros/pages/Novo'
import Editar from './apps/cadastros/pages/Editar'
import Mensalidades from './apps/mensalidades/pages'
import Registrar from './apps/mensalidades/pages/Registrar'
import Analisar from './apps/mensalidades/pages/Analisar'
import List from './apps/mensalidades/pages/list'
import Detail from './apps/mensalidades/pages/list/Detail'

function ProtectedRoute() {
  return <Outlet />
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/login" element={<Login />} />
        <Route path="/app" element={<ProtectedRoute />}>
          <Route path="home" element={<Home />} />
          <Route path="cadastros" element={<Cadastros />} />
          <Route path="cadastros/novo" element={<Novo />} />
          <Route path="cadastros/editar" element={<Editar />} />
          <Route path="mensalidades" element={<Mensalidades />} />
          <Route path="mensalidades/registrar" element={<Registrar />} />
          <Route path="mensalidades/analisar" element={<Analisar />} />
          <Route path="mensalidades/list" element={<List />} />
          <Route path="mensalidades/list/:id" element={<Detail />} />
        </Route>
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
