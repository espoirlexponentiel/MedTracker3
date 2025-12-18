<template>
  <q-page class="q-pa-md">
    <q-card class="q-pa-md" style="max-width: 700px; margin: auto">
      <q-card-section>
        <div class="text-h6 text-primary">Prises quotidiennes</div>
        <div class="text-caption text-grey">Liste des médicaments à prendre aujourd'hui</div>
      </q-card-section>

      <q-list bordered separator>
        <q-item
          v-for="prise in prises"
          :key="prise.id_prise"
          :class="{
            'bg-red-2': isLate(prise),
            'bg-green-2': prise.statut === 'Fait',
          }"
        >
          <q-item-section>
            <q-item-label>{{ prise.nom }} ({{ prise.forme }})</q-item-label>
            <q-item-label caption>
              {{ prise.dose }} {{ prise.unite }} - {{ formatHeure(prise.heure) }}
            </q-item-label>
            <q-item-label caption> Statut : {{ prise.statut }} </q-item-label>
          </q-item-section>

          <q-item-section side>
            <q-badge v-if="isLate(prise)" color="negative" label="En retard" class="q-mr-sm" />

            <q-btn
              dense
              flat
              icon="check"
              color="positive"
              :disable="prise.statut === 'Fait'"
              @click="marquerPris(prise)"
            />
          </q-item-section>
        </q-item>
      </q-list>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getDailyPrises, markPriseAsDone } from 'src/services/prises'

const userId = ref(1)
const prises = ref([])

function formatHeure(date) {
  const d = new Date(date)
  if (isNaN(d.getTime())) return 'Date invalide'
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

function isLate(prise) {
  const now = new Date()
  const priseDate = new Date(prise.heure)
  return prise.statut === 'À faire' && priseDate < now
}

async function loadPrises() {
  try {
    const data = await getDailyPrises(userId.value)
    prises.value = data.sort((a, b) => new Date(a.heure) - new Date(b.heure))
  } catch (err) {
    console.error('Erreur lors du chargement des prises :', err)
  }
}

async function marquerPris(prise) {
  try {
    await markPriseAsDone(prise.id_prise)
    await loadPrises()
  } catch (err) {
    console.error('Erreur lors du marquage de la prise :', err)
  }
}

onMounted(() => {
  loadPrises()
})
</script>
