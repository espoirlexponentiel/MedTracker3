<template>
  <q-page class="register-page">
    <q-splitter v-model="splitter" style="height: 100vh" separator-class="bg-transparent">
      <!-- 🖼️ IMAGE -->
      <template #before>
        <div class="image-panel">
          <div class="overlay">
            <div class="image-text">
              <h4>Rejoignez MedTracker</h4>
              <p>Créez un compte pour gérer vos médicaments</p>
            </div>
          </div>
        </div>
      </template>

      <!-- 📝 FORMULAIRE -->
      <template #after>
        <div class="form-panel flex flex-center">
          <q-card class="register-card q-pa-lg">
            <q-card-section>
              <div class="text-h6 text-primary text-center">Inscription</div>
            </q-card-section>

            <q-form @submit.prevent="register">
              <q-input
                v-model="username"
                label="Nom d'utilisateur"
                outlined
                class="q-mb-md"
                lazy-rules
                :rules="[(val) => !!val || 'Nom requis']"
              />

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

              <q-btn label="S'inscrire" type="submit" color="primary" class="full-width q-mt-md" />
            </q-form>

            <!-- Lien vers la page login -->
            <div class="text-center q-mt-md">
              <span>Vous avez déjà un compte ? </span>
              <q-btn flat color="primary" label="Connexion" @click="goLogin" />
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
import { registerUser } from 'src/services/auth'

const router = useRouter()
const splitter = ref(50)

const username = ref('')
const email = ref('')
const password = ref('')

async function register() {
  if (!username.value || !email.value || !password.value) {
    Notify.create({
      type: 'negative',
      message: 'Veuillez remplir tous les champs',
    })
    return
  }

  try {
    await registerUser({
      username: username.value,
      email: email.value,
      password: password.value,
    })

    Notify.create({
      type: 'positive',
      message: 'Inscription réussie ✅',
    })

    router.push('/login')
  } catch (err) {
    console.error(err)
    Notify.create({
      type: 'negative',
      message: err.message || 'Erreur lors de l’inscription',
    })
  }
}

function goLogin() {
  router.push('/login')
}
</script>

<style scoped>
.register-page {
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

.register-card {
  width: 450px;
  max-width: 90%;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 12px;
}
</style>
