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
