<template>
  <q-page class="flex flex-center bg-background">
    <q-card class="q-pa-md" style="width: 550px">
      <q-card-section>
        <div class="text-h6 text-primary">Inscription</div>
      </q-card-section>

      <q-form @submit.prevent="register">
        <q-input v-model="username" label="Nom d'utilisateur" outlined /><br>
        <q-input v-model="email" label="Email" type="email" outlined /><br>
        <q-input v-model="password" label="Mot de passe" type="password" outlined /><br>

        <q-btn label="S'inscrire" type="submit" color="accent" class="full-width q-mt-md" />
      </q-form>

      <q-card-section v-if="error" class="text-negative">
        {{ error }}
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { registerUser } from 'src/services/auth'

const username = ref('')
const email = ref('')
const password = ref('')
const error = ref('')

async function register() {
  try {
    await registerUser({ username: username.value, email: email.value, password: password.value })
    error.value = ''
    alert('Inscription réussie ✅')
  } catch (err) {
    error.value = err.message
  }
}
</script>
