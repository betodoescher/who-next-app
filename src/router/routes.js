
const routes = [
  {
    path: '/',
    component: () => import('layouts/MyLayout.vue'),
    children: [
      // { path: 'map', component: () => import('pages/Index.vue') },
      { path: 'chat', component: () => import('pages/Chat'), name: 'Chat', meta: { requiresAuth: true } },
      { path: 'login', component: () => import('pages/Login'), name: 'Login', meta: { requiresAuth: true } },
      { path: 'chats', component: () => import('pages/Chats'), name: 'Chats', meta: { requiresAuth: true } }

    ]
  }
]

// Always leave this as last one
if (process.env.MODE !== 'ssr') {
  routes.push({
    path: '*',
    component: () => import('pages/Error404.vue')
  })
}

export default routes
