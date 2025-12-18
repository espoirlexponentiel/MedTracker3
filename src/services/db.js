import lf from 'lovefield'

let db = null

export async function initDB() {
  if (db) return db

  // ⚠️ Incrémente la version si tu modifies la structure
  const schemaBuilder = lf.schema.create('medtrackerDB', 13)

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
    .addColumn('heures', lf.Type.STRING) // JSON string
    .addColumn('date_debut', lf.Type.DATE_TIME)
    .addColumn('date_fin', lf.Type.DATE_TIME)
    .addColumn('user_id', lf.Type.INTEGER)
    .addPrimaryKey(['id_medicament'], true)

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
    .addPrimaryKey(['id_prise'], true)

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

/* -----------------------------
   Fonctions utilitaires
----------------------------- */

/**
 * Crée un utilisateur et retourne l'objet inséré
 */
export async function createUser({ username, email, password }) {
  const db = getDB()
  const usersTable = db.getSchema().table('users')

  const row = usersTable.createRow({
    username,
    email,
    password,
    date_creation: new Date(),
  })

  await db.insertOrReplace().into(usersTable).values([row]).exec()

  const inserted = await db
    .select()
    .from(usersTable)
    .where(usersTable.email.eq(email))
    .orderBy(usersTable.id_user, lf.Order.DESC)
    .limit(1)
    .exec()

  return inserted[0] || null
}

/**
 * Crée un médicament pour un utilisateur spécifique
 */
export async function createMedicament({
  user_id,
  nom,
  forme,
  dose,
  unite,
  frequence,
  heures,
  date_debut,
  date_fin,
}) {
  const db = getDB()
  const medicamentsTable = db.getSchema().table('medicaments')

  const row = medicamentsTable.createRow({
    user_id,
    nom,
    forme,
    dose,
    unite,
    frequence,
    heures: JSON.stringify(heures),
    date_debut,
    date_fin,
  })

  await db.insertOrReplace().into(medicamentsTable).values([row]).exec()

  const inserted = await db
    .select()
    .from(medicamentsTable)
    .where(medicamentsTable.nom.eq(nom))
    .orderBy(medicamentsTable.id_medicament, lf.Order.DESC)
    .limit(1)
    .exec()

  return inserted[0] || null
}

/**
 * Génère automatiquement les prises pour un médicament donné
 */
export async function generatePrisesForTreatment(medicament) {
  const db = getDB()
  const prisesTable = db.getSchema().table('prises')

  if (
    !medicament ||
    !medicament.date_debut ||
    !medicament.date_fin ||
    !Array.isArray(medicament.heures)
  ) {
    console.error('❌ Médicament ou dates/heures invalides')
    return
  }

  const start = new Date(medicament.date_debut)
  const end = new Date(medicament.date_fin)
  if (isNaN(start.getTime()) || isNaN(end.getTime()) || start > end) {
    console.error('❌ Dates de traitement invalides')
    return
  }

  const rows = []
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    for (const h of medicament.heures) {
      if (!h.includes(':')) continue
      const [hh, mm] = h.split(':').map(Number)
      const priseDate = new Date(d)
      priseDate.setHours(hh, mm, 0, 0)

      const row = prisesTable.createRow({
        medicament_id: medicament.id_medicament,
        user_id: medicament.user_id,
        nom: medicament.nom,
        forme: medicament.forme,
        dose: medicament.dose,
        unite: medicament.unite,
        heure: priseDate,
        statut: 'À faire',
      })

      rows.push(row)
    }
  }

  if (!rows.length) {
    console.warn('⚠️ Aucune prise générée')
    return
  }

  await db.insertOrReplace().into(prisesTable).values(rows).exec()
  console.log(`✅ ${rows.length} prises générées pour "${medicament.nom}"`)
}
