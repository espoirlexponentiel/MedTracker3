import { boot } from 'quasar/wrappers'
import { initDB } from 'src/services/db'

export default boot(async () => {
  try {
    await initDB() // Initialise Lovefield
    console.log("Base Lovefield initialisée ✅")
  } catch (err) {
    console.error("Erreur Lovefield :", err)
  }
})
