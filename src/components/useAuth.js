import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Notify } from 'quasar'

const isLoggedIn = ref(localStorage.getItem('isLoggedIn') === 'true')
const user = ref(localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null)

export function useAuth() {
  const router = useRouter()

  function login(userData) {
    isLoggedIn.value = true
    user.value = userData
    localStorage.setItem('isLoggedIn', 'true')
    localStorage.setItem('user', JSON.stringify(userData))
    Notify.create({ type: 'positive', message: '✅ Connexion réussie' })
  }

  function logout() {
    isLoggedIn.value = false
    user.value = null
    localStorage.removeItem('isLoggedIn')
    localStorage.removeItem('user')
    Notify.create({ type: 'info', message: '👋 Déconnexion effectuée' })
    router.push('/login')
  }

  function checkAuth() {
    if (!isLoggedIn.value) {
      Notify.create({
        type: 'negative',
        message: '⚠️ Vous devez être connecté pour accéder à cette page.',
      })
      return false
    }
    return true
  }

  return {
    isLoggedIn,
    user,
    login,
    logout,
    checkAuth,
  }
}
