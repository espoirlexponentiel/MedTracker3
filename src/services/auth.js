import { getDB } from './db'

// Inscription
export async function registerUser({ username, email, password }) {
  const db = getDB()
  const table = db.getSchema().table('users')

  // Vérifier si l’email existe déjà
  const exists = await db.select().from(table).where(table.email.eq(email)).exec()
  if (exists.length > 0) {
    throw new Error('Cet email est déjà utilisé')
  }

  const row = table.createRow({
    id_user: Date.now(),
    username,
    email,
    password,
    date_creation: new Date()
  })

  await db.insert().into(table).values([row]).exec()
  return row
}

// Connexion
export async function loginUser(email, password) {
  const db = getDB()
  const table = db.getSchema().table('users')

  const results = await db.select().from(table).where(table.email.eq(email)).exec()
  if (results.length === 0) {
    throw new Error('Utilisateur non trouvé')
  }

  const user = results[0]
  if (user.password !== password) {
    throw new Error('Mot de passe incorrect')
  }

  return user
}
