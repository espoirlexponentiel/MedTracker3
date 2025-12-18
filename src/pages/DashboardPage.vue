<template>
  <q-page class="q-pa-md flex flex-center bg-grey-2">
    <div class="row q-col-gutter-md" style="max-width: 1000px; width: 95%">
      <!-- Ajouter un médicament -->
      <div class="col-12 col-md-6">
        <q-card class="q-pa-md">
          <q-card-section>
            <div class="text-h6 text-primary">Ajouter un médicament</div>
            <div class="text-caption text-grey">Enregistrer un nouveau traitement</div>
          </q-card-section>
          <br />
          <q-card-actions align="center">
            <q-btn label="Accéder au formulaire" color="accent" @click="goToAddMedicament" />
          </q-card-actions>
        </q-card>
      </div>

      <!-- Voir les prises quotidiennes -->
      <div class="col-12 col-md-6">
        <q-card class="q-pa-md">
          <q-card-section>
            <div class="text-h6 text-primary">Voir les prises quotidiennes</div>
            <div class="text-caption text-grey">
              Consulter les médicaments à prendre aujourd'hui
            </div>
          </q-card-section>
          <br />
          <q-card-actions align="center">
            <q-btn label="Voir les prises" color="accent" @click="goToDailyPrises" />
          </q-card-actions>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { Notify } from 'quasar'

const router = useRouter()

function isAuthenticated() {
  return localStorage.getItem('isLoggedIn') === 'true'
}

function goToAddMedicament() {
  if (!isAuthenticated()) {
    Notify.create({
      type: 'negative',
      message: '⚠️ Vous devez être connecté pour accéder au formulaire.',
    })
    router.push('/login')
    return
  }
  router.push('/add-medicament')
}

function goToDailyPrises() {
  if (!isAuthenticated()) {
    Notify.create({
      type: 'negative',
      message: '⚠️ Vous devez être connecté pour voir vos prises quotidiennes.',
    })
    router.push('/login')
    return
  }
  router.push('/daily-prises')
}
</script>
