<template>
  <q-page class="login-page">
    <q-splitter v-model="splitter" style="height: 100vh" separator-class="bg-transparent">
      <!-- 🖼️ IMAGE -->
      <template #before>
        <div class="image-panel">
          <div class="overlay">
            <div class="image-text">
              <h4>Bienvenue 👋</h4>
              <p>Connectez-vous pour accéder à votre tableau de bord</p>
            </div>
          </div>
        </div>
      </template>

      <!-- 🔐 FORMULAIRE -->
      <template #after>
        <div class="form-panel flex flex-center">
          <q-card class="login-card q-pa-lg">
            <q-card-section>
              <div class="text-h6 text-primary text-center">Connexion</div>
            </q-card-section>

            <q-form @submit.prevent="login">
              <q-input
                v-model="email"
                label="Email"
                type="email"
                outlined
                class="q-mb-md"
                lazy-rules
                :rules="[(val) => !!val || 'Email requis']"
              />

              <q-input
                v-model="password"
                label="Mot de passe"
                type="password"
                outlined
                class="q-mb-md"
                lazy-rules
                :rules="[(val) => !!val || 'Mot de passe requis']"
              />

              <q-btn
                label="Se connecter"
                type="submit"
                color="primary"
                class="full-width q-mt-md"
              />
            </q-form>

            <!-- Lien vers la page d'inscription -->
            <div class="text-center q-mt-md">
              <span>Pas encore de compte ? </span>
              <q-btn flat color="primary" label="S'inscrire" @click="goRegister" />
            </div>
          </q-card>
        </div>
      </template>
    </q-splitter>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Notify } from 'quasar'
import { loginUser } from 'src/services/auth'

const router = useRouter()
const splitter = ref(50)

const email = ref('')
const password = ref('')

async function login() {
  if (!email.value || !password.value) {
    Notify.create({
      type: 'negative',
      message: 'Veuillez remplir tous les champs',
    })
    return
  }

  try {
    const user = await loginUser(email.value, password.value)

    localStorage.setItem('isLoggedIn', 'true')
    localStorage.setItem('user', JSON.stringify(user))

    Notify.create({
      type: 'positive',
      message: `Bienvenue ${user.username} 🎉`,
    })

    router.push('/dashboard')
  } catch (err) {
    console.error(err)
    Notify.create({
      type: 'negative',
      message: 'Email ou mot de passe incorrect ❌',
    })
  }
}

function goRegister() {
  router.push('/register') // Assure-toi que la route correspond
}
</script>

<style scoped>
.login-page {
  background: #f5f6fa;
}

/* IMAGE */
.image-panel {
  height: 100%;
  background-image: url('src/assets/oui.jpg');
  background-size: cover;
  background-position: center;
  position: relative;
}

.overlay {
  height: 100%;
  background: rgba(0, 0, 0, 0.55);
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.image-text {
  color: white;
  max-width: 400px;
}

/* FORM */
.form-panel {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.login-card {
  width: 420px;
  max-width: 90%;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 12px;
}
</style>
