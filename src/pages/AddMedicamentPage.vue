<template>
  <q-page class="q-pa-md">
    <!-- 🔙 / 🔍 Navigation -->
    <q-toolbar class="q-mb-md bg-primary text-white">
      <q-btn flat dense round icon="arrow_back" @click="goDashboard" />
      <q-toolbar-title>Ajouter un médicament</q-toolbar-title>
      <q-btn flat dense round icon="add" label="Voir les prises du jour" @click="goToDailyPrises" />
    </q-toolbar>

    <q-card class="q-pa-md" style="max-width: 700px; margin: auto">
      <q-card-section>
        <div class="text-h6 text-primary">Ajouter un médicament</div>
      </q-card-section>

      <q-form @submit.prevent="saveMedicament">
        <q-input v-model="nom" label="Nom du médicament" outlined class="q-mb-md" />
        <q-select
          v-model="forme"
          :options="['Comprimé', 'Sirop', 'Injection']"
          label="Forme"
          outlined
          class="q-mb-md"
        />
        <q-input v-model.number="dose" label="Dose" type="number" outlined class="q-mb-md" />
        <q-select
          v-model="unite"
          :options="['mg', 'ml', 'g']"
          label="Unité"
          outlined
          class="q-mb-md"
        />
        <q-input
          v-model.number="frequence"
          label="Fréquence (fois/jour)"
          type="number"
          outlined
          class="q-mb-md"
          @input="resetHeures"
        />

        <div class="q-mb-md">
          <div class="text-caption text-grey">Heures de prise</div>
          <q-input
            v-for="(heure, i) in heures"
            :key="i"
            v-model="heures[i]"
            label="Heure"
            outlined
            placeholder="HH:MM"
            class="q-mb-sm"
          />
          <q-btn
            flat
            color="primary"
            label="Ajouter une heure"
            @click="ajouterHeure"
            :disable="heures.length >= frequence"
          />
        </div>

        <q-input v-model="dateDebut" label="Date début" type="date" outlined class="q-mb-md" />
        <q-input
          v-model="dateFin"
          label="Date fin (optionnel)"
          type="date"
          outlined
          class="q-mb-md"
        />

        <q-btn label="Enregistrer" type="submit" color="accent" class="q-mt-md full-width" />
        <q-btn
          label="Ajouter médicament test"
          color="secondary"
          class="q-mt-md full-width"
          @click="saveTestMedicament"
        />
      </q-form>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { useQuasar } from 'quasar'
import { useRouter } from 'vue-router'
import { getDB } from 'src/services/db'
import { generatePrisesForTreatment } from 'src/services/prises'
import lf from 'lovefield'

const $q = useQuasar()
const router = useRouter()

const nom = ref('')
const forme = ref('')
const dose = ref(null)
const unite = ref('')
const frequence = ref(1)
const heures = ref([''])
const dateDebut = ref('')
const dateFin = ref('')

/* 🔹 Navigation */
function goDashboard() {
  router.push('/dashboard')
}

function goToDailyPrises() {
  router.push('/daily-prises')
}

/* 🔹 Gestion des heures selon fréquence */
function resetHeures() {
  heures.value = []
  if (frequence.value > 0) heures.value.push('')
}

function ajouterHeure() {
  if (heures.value.length < frequence.value) {
    heures.value.push('')
  }
}

/* 🔹 Sauvegarde du médicament */
async function saveMedicament() {
  if (!nom.value || !forme.value || !dose.value || !unite.value || !frequence.value) {
    $q.notify({ type: 'negative', message: 'Veuillez remplir tous les champs !' })
    return
  }
  if (!heures.value.every((h) => h)) {
    $q.notify({ type: 'negative', message: 'Veuillez saisir toutes les heures !' })
    return
  }
  if (!dateDebut.value) {
    $q.notify({ type: 'negative', message: 'Veuillez sélectionner la date de début !' })
    return
  }

  const dateDebutObj = new Date(dateDebut.value)
  let dateFinObj
  if (dateFin.value) {
    dateFinObj = new Date(dateFin.value)
  } else {
    const totalComprime = 30
    const nbreJours = Math.ceil(totalComprime / (dose.value * frequence.value))
    dateFinObj = new Date(dateDebutObj)
    dateFinObj.setDate(dateDebutObj.getDate() + nbreJours - 1)
  }

  try {
    const db = getDB()
    const medicamentsTable = db.getSchema().table('medicaments')
    const row = medicamentsTable.createRow({
      nom: nom.value,
      forme: forme.value,
      dose: dose.value,
      unite: unite.value,
      frequence: frequence.value,
      heures: JSON.stringify(heures.value),
      date_debut: dateDebutObj,
      date_fin: dateFinObj,
      user_id: 1,
    })

    await db.insertOrReplace().into(medicamentsTable).values([row]).exec()

    const inserted = await db
      .select()
      .from(medicamentsTable)
      .where(medicamentsTable.nom.eq(nom.value))
      .orderBy(medicamentsTable.id_medicament, lf.Order.DESC)
      .limit(1)
      .exec()

    if (inserted.length) {
      await generatePrisesForTreatment({
        ...inserted[0],
        heures: heures.value,
        frequence: frequence.value,
      })
      $q.notify({ type: 'positive', message: `Médicament "${nom.value}" enregistré ✅` })
    }
  } catch (err) {
    console.error(err)
    $q.notify({ type: 'negative', message: 'Erreur lors de l’enregistrement.' })
  }
}

/* 🔹 Médicament test */
async function saveTestMedicament() {
  try {
    const db = getDB()
    const medicamentsTable = db.getSchema().table('medicaments')

    const row = medicamentsTable.createRow({
      nom: 'Paracetamol',
      forme: 'Comprimé',
      dose: 500,
      unite: 'mg',
      frequence: 3,
      heures: ['07:00', '12:00', '18:00'],
      date_debut: new Date(),
      date_fin: new Date(new Date().setDate(new Date().getDate() + 2)),
      user_id: 1,
    })

    await db.insertOrReplace().into(medicamentsTable).values([row]).exec()
    const inserted = await db
      .select()
      .from(medicamentsTable)
      .where(medicamentsTable.nom.eq('Paracetamol'))
      .orderBy(medicamentsTable.id_medicament, lf.Order.DESC)
      .limit(1)
      .exec()

    if (inserted.length) {
      await generatePrisesForTreatment({
        ...inserted[0],
        heures: ['07:00', '12:00', '18:00'],
        frequence: 3,
      })
      $q.notify({ type: 'positive', message: 'Médicament test ajouté et prises générées ✅' })
    }
  } catch (err) {
    console.error(err)
    $q.notify({ type: 'negative', message: 'Erreur lors de l’ajout du médicament test.' })
  }
}
</script>
