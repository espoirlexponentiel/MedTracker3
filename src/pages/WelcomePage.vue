<template>
  <q-page class="welcome-page flex flex-center">
    <!-- overlay sombre -->
    <div class="overlay"></div>

    <!-- contenu -->
    <q-card class="q-pa-lg text-center content" style="width: 450px; height: 400px">
      <q-card-section>
        <div class="text-h5 text-primary q-mb-sm">Bienvenue sur MedTracker</div>
        <div class="text-caption text-grey">Gérez vos médicaments et vos prises facilement</div>
      </q-card-section>

      <q-card-actions vertical class="q-gutter-sm">
        <q-btn label="Se connecter" color="primary" icon="login" @click="goLogin" />
        <q-btn
          label="Créer un compte"
          color="accent"
          icon="person_add"
          outline
          @click="goRegister"
        />
      </q-card-actions>
      <!-- ✅ IMAGE JUSTE EN BAS DU BOUTON -->
      <q-img
        src="src/assets/add.png"
        alt="Illustration MedTracker"
        class="q-mt-md rounded-borders"
        style="max-height: 140px"
        fit="contain"
      />
    </q-card>
  </q-page>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

onMounted(() => {
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true'
  if (isLoggedIn) {
    router.replace('/dashboard')
  }
})

function goLogin() {
  router.push('/login')
}

function goRegister() {
  router.push('/register')
}
</script>

<style scoped>
.welcome-page {
  min-height: 100vh;
  background-image: url('src/assets/medapp.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  position: relative;
}

/* assombrit l’image */
.overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.55);
}

/* contenu au-dessus */
.content {
  position: relative;
  z-index: 1;
}
</style>
