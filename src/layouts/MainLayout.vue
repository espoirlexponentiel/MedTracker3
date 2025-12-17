<template>
  <q-layout view="lHh Lpr lFf">
    <!-- Header -->
    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-btn flat dense round icon="menu" aria-label="Menu" @click="toggleLeftDrawer" />

        <q-toolbar-title>
          MedTracker
        </q-toolbar-title>

        <div class="text-caption">Quasar v{{ $q.version }}</div>
      </q-toolbar>
    </q-header>

    <!-- Drawer (menu latéral) -->
    <q-drawer v-model="leftDrawerOpen" show-if-above bordered class="bg-secondary text-white">
      <q-list>
        <q-item-label header class="text-accent">Navigation</q-item-label>

        <q-item clickable v-ripple to="/">
          <q-item-section avatar>
            <q-icon name="dashboard" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Dashboard</q-item-label>
          </q-item-section>
        </q-item>

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
      </q-list>
    </q-drawer>

    <!-- Contenu principal -->
    <q-page-container class="bg-background">
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref } from 'vue'

const leftDrawerOpen = ref(false)

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value
}
</script>
