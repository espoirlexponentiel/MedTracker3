<template>
  <q-layout view="lHh Lpr lFf">
    <!-- ================= HEADER ================= -->
    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-btn flat dense round icon="menu" aria-label="Menu" @click="toggleLeftDrawer" />

        <q-toolbar-title> MedTracker </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <!-- ================= DRAWER ================= -->
    <q-drawer v-model="leftDrawerOpen" show-if-above bordered class="bg-accent text-white">
      <q-list>
        <q-item-label header class="text-white"> Navigation </q-item-label>

        <!-- 🔹 ACCUEIL (toujours accessible) -->
        <q-item clickable v-ripple to="/welcome">
          <q-item-section avatar>
            <q-icon name="home" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Accueil</q-item-label>
          </q-item-section>
        </q-item>

        <!-- ================= NON CONNECTÉ ================= -->
        <template v-if="!isLoggedIn">
          <q-item clickable v-ripple to="/login">
            <q-item-section avatar>
              <q-icon name="login" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Connexion</q-item-label>
            </q-item-section>
          </q-item>

          <q-item clickable v-ripple to="/register">
            <q-item-section avatar>
              <q-icon name="person_add" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Inscription</q-item-label>
            </q-item-section>
          </q-item>
        </template>

        <!-- ================= CONNECTÉ ================= -->
        <template v-else>
          <q-item clickable v-ripple to="/dashboard">
            <q-item-section avatar>
              <q-icon name="dashboard" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Dashboard</q-item-label>
            </q-item-section>
          </q-item>

          <q-separator class="q-my-sm" />

          <q-item clickable v-ripple @click="logout">
            <q-item-section avatar>
              <q-icon name="logout" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Déconnexion</q-item-label>
            </q-item-section>
          </q-item>
        </template>
      </q-list>
    </q-drawer>

    <!-- ================= CONTENU ================= -->
    <q-page-container class="bg-background">
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { Notify } from 'quasar'

const router = useRouter()
const leftDrawerOpen = ref(false)

/* 🔐 ÉTAT DE CONNEXION */
const isLoggedIn = computed(() => {
  return localStorage.getItem('isLoggedIn') === 'true'
})

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value
}

/* 🚪 DÉCONNEXION */
function logout() {
  localStorage.removeItem('isLoggedIn')
  localStorage.removeItem('user')

  Notify.create({
    type: 'positive',
    message: 'Déconnexion réussie',
  })

  router.push('/login')
}
</script>
