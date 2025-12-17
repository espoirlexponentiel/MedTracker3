const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/DashboardPage.vue') },
      { path: 'login', component: () => import('pages/LoginPage.vue') },
      { path: 'register', component: () => import('pages/RegisterPage.vue') },
      { path: 'add-medicament', component: () => import('pages/AddMedicamentPage.vue') },    
      { path: 'daily-prises', component: () => import('pages/DailyPrisesPage.vue') } 
    ]
  }
]

export default routes
