import { boot } from 'quasar/wrappers'
import { Loading } from 'quasar'

export default boot(({ router }) => {
  router.beforeEach((to, from, next) => {
    Loading.show({
      spinnerColor: 'primary',
      message: 'Chargement...',
    })
    next()
  })

  router.afterEach(() => {
    Loading.hide()
  })
})
