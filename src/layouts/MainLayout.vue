<template>
  <q-layout view="lHh Lpr lFf">
    <!-- ================= DASHBOARD BAR UNIQUEMENT ================= -->
    <q-header v-if="isDashboard" elevated class="bg-primary text-white">
      <q-toolbar class="q-px-md">
        <!-- Nom de l'app -->
        <q-toolbar-title> MedTracker </q-toolbar-title>

        <!-- Bouton déconnexion -->
        <q-btn flat icon="logout" label="Déconnexion" @click="logout" />
      </q-toolbar>
    </q-header>

    <!-- ================= CONTENU ================= -->
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { Notify } from 'quasar'

const router = useRouter()
const route = useRoute()

/* 📍 VÉRIFIE SI ON EST SUR LE DASHBOARD */
const isDashboard = computed(() => route.path === '/dashboard')

/* 🚪 DÉCONNEXION */
function logout() {
  localStorage.removeItem('isLoggedIn')
  localStorage.removeItem('user')

  Notify.create({
    type: 'info',
    message: 'Déconnexion réussie',
  })

  router.replace('/login')
}
</script>
