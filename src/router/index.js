import { defineRouter } from '#q-app/wrappers'
import {
  createRouter,
  createMemoryHistory,
  createWebHistory,
  createWebHashHistory,
} from 'vue-router'
import routes from './routes'

export default defineRouter(function () {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : process.env.VUE_ROUTER_MODE === 'history'
      ? createWebHistory
      : createWebHashHistory

  const router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,
    history: createHistory(process.env.VUE_ROUTER_BASE),
  })

  // 🔐 GUARD GLOBAL D'AUTHENTIFICATION
  router.beforeEach((to, from, next) => {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true'

    // Route protégée et utilisateur NON connecté
    if (to.meta.requiresAuth && !isLoggedIn) {
      next('/login')
      return
    }

    // Empêcher accès à login/register si déjà connecté
    if ((to.path === '/login' || to.path === '/register') && isLoggedIn) {
      next('/')
      return
    }

    next()
  })

  return router
})
