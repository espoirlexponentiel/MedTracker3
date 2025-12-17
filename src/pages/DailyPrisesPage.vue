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
          :class="{ 'bg-red-2': isLate(prise) }"
        >
          <q-item-section>
            <q-item-label>{{ prise.nom }} ({{ prise.forme }})</q-item-label>
            <q-item-label caption>
              {{ prise.dose }} {{ prise.unite }} - {{ formatHeure(prise.heure) }}
            </q-item-label>
            <q-item-label caption> Statut : {{ prise.statut }} </q-item-label>
          </q-item-section>

          <q-item-section side>
            <!-- Badge si en retard -->
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

const userId = 1 // ⚠️ à remplacer par l'utilisateur connecté
const prises = ref([])

function formatHeure(date) {
  return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

function isLate(prise) {
  const now = new Date()
  return prise.statut === 'À faire' && new Date(prise.heure) < now
}

async function loadPrises() {
  prises.value = await getDailyPrises(userId)
  console.log('Prises du jour :', prises.value)
}

async function marquerPris(prise) {
  await markPriseAsDone(prise.id_prise)
  prise.statut = 'Fait'
}

onMounted(() => {
  loadPrises()
})
</script>
