const DB_KEY = 'ose-no-axe-db'

function getDB() {
  const data = localStorage.getItem(DB_KEY)
  return data ? JSON.parse(data) : { usuarios: [] }
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
