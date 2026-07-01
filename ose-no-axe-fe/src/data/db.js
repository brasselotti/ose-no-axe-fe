const DB_KEY = 'ose-no-axe-db'

function getDB() {
  const data = localStorage.getItem(DB_KEY)
  return data ? JSON.parse(data) : { usuarios: [], mensalidades: [] }
}

function saveDB(data) {
  localStorage.setItem(DB_KEY, JSON.stringify(data))
}

export function findUsuario(login, senha) {
  return getDB().usuarios.find(u => u.login === login && u.senha === senha)
}

export function loginExiste(login) {
  return getDB().usuarios.some(u => u.login === login)
}

export function cpfExiste(cpf) {
  return getDB().usuarios.some(u => u.cpf === cpf)
}

export function salvarUsuario(usuario) {
  const db = getDB()
  db.usuarios.push(usuario)
  saveDB(db)
}

export function listarUsuarios() {
  return getDB().usuarios
}

export function buscarUsuarioPorLogin(login) {
  return getDB().usuarios.find(u => u.login === login) ?? null
}

export function atualizarUsuario(login, dados) {
  const db = getDB()
  const idx = db.usuarios.findIndex(u => u.login === login)
  if (idx === -1) return false
  db.usuarios[idx] = { ...db.usuarios[idx], ...dados }
  saveDB(db)
  return true
}

export function listarMensalidades() {
  return getDB().mensalidades ?? []
}

export function salvarMensalidade(mensalidade) {
  const db = getDB()
  if (!db.mensalidades) db.mensalidades = []
  db.mensalidades.push(mensalidade)
  saveDB(db)
}

export function atualizarMensalidade(id, dados) {
  const db = getDB()
  if (!db.mensalidades) db.mensalidades = []
  const idx = db.mensalidades.findIndex(m => m.id === id)
  if (idx === -1) return false
  db.mensalidades[idx] = { ...db.mensalidades[idx], ...dados }
  saveDB(db)
  return true
}

export function buscarMensalidadesPorMembro(login) {
  return (getDB().mensalidades ?? []).filter(m => m.membroLogin === login)
}

export function deletarUsuario(login) {
  const db = getDB()
  db.usuarios = db.usuarios.filter(u => u.login !== login)
  saveDB(db)
}

export function initDB() {
  const db = getDB()
  if (db.usuarios.length === 0) {
    db.usuarios.push({
      nome: 'Administrador',
      cpf: '00000000000',
      login: 'adm',
      dataBori: '',
      senha: 'adm123',
      tipo: 'adm',
    })
    saveDB(db)
  }
}
