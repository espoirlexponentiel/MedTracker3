import { getDB } from './db'
import lf from 'lovefield'

/**
 * Génère les prises pour un traitement en fonction des heures saisies
 * @param {Object} medicament - Le médicament contenant date_debut, date_fin et heures
 */
export async function generatePrisesForTreatment(medicament) {
  const db = getDB()
  const prisesTable = db.getSchema().table('prises')

  // Vérifications basiques
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

  // Vérifier que le nombre d'heures correspond à la fréquence
  if (medicament.heures.length !== medicament.frequence) {
    console.warn(
      `⚠️ Le nombre d'heures (${medicament.heures.length}) ne correspond pas à la fréquence (${medicament.frequence})`,
    )
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

/**
 * Récupère les prises du jour pour un utilisateur donné
 * @param {number} user_id
 * @returns {Promise<Array>}
 */
export async function getDailyPrises(user_id) {
  const db = getDB()
  const prisesTable = db.getSchema().table('prises')

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const tomorrow = new Date(today)
  tomorrow.setDate(today.getDate() + 1)

  return db
    .select()
    .from(prisesTable)
    .where(lf.op.and(prisesTable.user_id.eq(user_id), prisesTable.heure.between(today, tomorrow)))
    .exec()
}

/**
 * Marque une prise comme faite
 * @param {number} priseId
 */
export async function markPriseAsDone(priseId) {
  if (!priseId) return
  const db = getDB()
  const prisesTable = db.getSchema().table('prises')

  await db
    .update(prisesTable)
    .set(prisesTable.statut, 'Fait')
    .where(prisesTable.id_prise.eq(priseId))
    .exec()

  console.log(`✅ Prise ${priseId} marquée comme Fait`)
}
