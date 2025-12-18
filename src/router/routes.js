const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        redirect: '/welcome',
      },
      {
        path: 'welcome',
        component: () => import('pages/WelcomePage.vue'),
      },
      {
        path: 'login',
        component: () => import('pages/LoginPage.vue'),
      },
      {
        path: 'register',
        component: () => import('pages/RegisterPage.vue'),
      },
      {
        path: 'dashboard',
        component: () => import('pages/DashboardPage.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: 'add-medicament',
        component: () => import('pages/AddMedicamentPage.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: 'daily-prises',
        component: () => import('pages/DailyPrisesPage.vue'),
        meta: { requiresAuth: true },
      },
    ],
  },
]

export default routes
