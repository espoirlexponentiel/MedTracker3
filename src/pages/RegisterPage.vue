<template>
  <q-page class="flex flex-center bg-background">
    <q-card class="q-pa-md" style="width: 500px">
      <q-card-section>
        <div class="text-h6 text-primary">Inscription</div>
      </q-card-section>

      <q-form @submit.prevent="register">
        <q-input v-model="username" label="Nom d'utilisateur" outlined class="q-mb-md" />
        <q-input v-model="email" label="Email" type="email" outlined class="q-mb-md" />
        <q-input v-model="password" label="Mot de passe" type="password" outlined class="q-mb-md" />

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
import { useRouter } from 'vue-router'
import { Notify } from 'quasar'
import { registerUser } from 'src/services/auth'

const router = useRouter()
const username = ref('')
const email = ref('')
const password = ref('')
const error = ref('')

async function register() {
  if (!username.value || !email.value || !password.value) {
    Notify.create({ type: 'negative', message: 'Veuillez remplir tous les champs !' })
    return
  }

  try {
    await registerUser({ username: username.value, email: email.value, password: password.value })
    Notify.create({ type: 'positive', message: 'Inscription réussie ✅' })
    router.push('/login') // Redirection vers Login après inscription
  } catch (err) {
    error.value = err.message
    Notify.create({ type: 'negative', message: err.message })
  }
}
</script>
