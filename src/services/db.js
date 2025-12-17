import lf from 'lovefield'

let db = null

export async function initDB() {
  if (db) return db

  // ⚠️ Incrémente la version si tu modifies la structure
  const schemaBuilder = lf.schema.create('medtrackerDB', 9)

  // -----------------------------
  // Table des utilisateurs
  // -----------------------------
  schemaBuilder
    .createTable('users')
    .addColumn('id_user', lf.Type.INTEGER)
    .addColumn('username', lf.Type.STRING)
    .addColumn('email', lf.Type.STRING)
    .addColumn('password', lf.Type.STRING)
    .addColumn('date_creation', lf.Type.DATE_TIME)
    .addPrimaryKey(['id_user'], true) // auto-increment
    .addUnique('uq_email', ['email'])

  // -----------------------------
  // Table des médicaments
  // -----------------------------
  schemaBuilder
    .createTable('medicaments')
    .addColumn('id_medicament', lf.Type.INTEGER)
    .addColumn('nom', lf.Type.STRING)
    .addColumn('forme', lf.Type.STRING)
    .addColumn('dose', lf.Type.NUMBER)
    .addColumn('unite', lf.Type.STRING)
    .addColumn('frequence', lf.Type.INTEGER)
    .addColumn('heures', lf.Type.OBJECT)
    .addColumn('date_debut', lf.Type.DATE_TIME)
    .addColumn('date_fin', lf.Type.DATE_TIME)
    .addColumn('user_id', lf.Type.INTEGER)
    .addPrimaryKey(['id_medicament'], true) // auto-increment

  // -----------------------------
  // Table des prises quotidiennes
  // -----------------------------
  schemaBuilder
    .createTable('prises')
    .addColumn('id_prise', lf.Type.INTEGER)
    .addColumn('medicament_id', lf.Type.INTEGER)
    .addColumn('user_id', lf.Type.INTEGER)
    .addColumn('nom', lf.Type.STRING)
    .addColumn('forme', lf.Type.STRING)
    .addColumn('dose', lf.Type.NUMBER)
    .addColumn('unite', lf.Type.STRING)
    .addColumn('heure', lf.Type.DATE_TIME)
    .addColumn('statut', lf.Type.STRING) // "À faire" ou "Fait"
    .addPrimaryKey(['id_prise'], true) // auto-increment

  // -----------------------------
  // Connexion à la base
  // -----------------------------
  db = await schemaBuilder.connect()
  console.log('✅ Base Lovefield initialisée avec tables users, medicaments et prises')
  return db
}

/**
 * Retourne l'instance DB déjà connectée
 */
export function getDB() {
  if (!db) {
    throw new Error(
      '❌ La base Lovefield n’est pas initialisée. Appelle initDB() avant d’utiliser getDB().',
    )
  }
  return db
}
