<template>
  <q-page class="q-pa-md flex flex-center bg-grey-2">
    <div class="row q-col-gutter-md" style="max-width: 1000px; width: 100%;">

      <!-- Cadre 1 : Ajouter un médicament -->
      <div class="col-12 col-md-6">
        <q-card class="q-pa-md">
          <q-card-section>
            <div class="text-h6 text-primary">Ajouter un médicament</div>
            <div class="text-caption text-grey">Enregistrer un nouveau traitement</div>
          </q-card-section><br><br>

          <q-card-actions align="center">
            <q-btn
              label="Accéder au formulaire"
              color="accent"
              @click="goToAddMedicament"
            />
          </q-card-actions>
        </q-card>
      </div>

      <!-- Cadre 2 : Voir les prises quotidiennes -->
      <div class="col-12 col-md-6">
        <q-card class="q-pa-md">
          <q-card-section>
            <div class="text-h6 text-primary">Voir les prises quotidiennes</div>
            <div class="text-caption text-grey">Consulter les médicaments à prendre aujourd'hui</div>
          </q-card-section><br><br>

          <q-card-actions align="center">
            <q-btn
              label="Voir les prises"
              color="accent"
              @click="goToDailyPrises"
            />
          </q-card-actions>
        </q-card>
      </div>

    </div>
  </q-page>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

function goToAddMedicament() {
  router.push('/add-medicament') // route vers le formulaire
}

function goToDailyPrises() {
  router.push('/daily-prises') // route vers la liste des prises
}
</script>
