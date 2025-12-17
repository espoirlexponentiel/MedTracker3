<template>
  <q-page class="flex flex-center bg-background">
    <q-card class="q-pa-md" style="width: 550px">
      <q-card-section>
        <div class="text-h6 text-primary">Connexion</div>
      </q-card-section>

      <q-form @submit.prevent="login"><br>
        <q-input v-model="email" label="Email" type="email" outlined /><br>
        <q-input v-model="password" label="Mot de passe" type="password" outlined /><br>

        <q-btn label="Se connecter" type="submit" color="accent" class="full-width q-mt-md" /><br>
      </q-form>

      <q-card-section v-if="error" class="text-negative">
        {{ error }}
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { loginUser } from 'src/services/auth'

const email = ref('')
const password = ref('')
const error = ref('')

async function login() {
  try {
    const user = await loginUser(email.value, password.value)
    error.value = ''
    alert(`Bienvenue ${user.username} 🎉`)
    // Ici tu peux rediriger vers le dashboard
  } catch (err) {
    error.value = err.message
  }
}
</script>
