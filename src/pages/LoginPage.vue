<template>
  <q-page class="flex flex-center bg-background">
    <q-card class="q-pa-md" style="width: 500px">
      <q-card-section>
        <div class="text-h6 text-primary">Connexion</div>
      </q-card-section>

      <q-form @submit.prevent="login">
        <q-input v-model="email" label="Email" type="email" outlined class="q-mb-md" />
        <q-input v-model="password" label="Mot de passe" type="password" outlined class="q-mb-md" />

        <q-btn label="Se connecter" type="submit" color="accent" class="full-width q-mt-md" />
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
import { loginUser } from 'src/services/auth'

const router = useRouter()
const email = ref('')
const password = ref('')
const error = ref('')

async function login() {
  if (!email.value || !password.value) {
    Notify.create({ type: 'negative', message: 'Veuillez remplir tous les champs !' })
    return
  }

  try {
    const user = await loginUser(email.value, password.value)

    // Sauvegarde l'état de connexion
    localStorage.setItem('isLoggedIn', 'true')
    localStorage.setItem('user', JSON.stringify(user))

    Notify.create({ type: 'positive', message: `Bienvenue ${user.username} 🎉` })

    router.push('/') // Redirection vers Dashboard
  } catch {
    error.value = 'Email ou mot de passe incorrect'
    Notify.create({ type: 'negative', message: 'Email ou mot de passe incorrect ❌' })
  }
}
</script>
