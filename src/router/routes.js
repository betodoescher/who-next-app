
const routes = [
  {
    path: '/',
    component: () => import('layouts/MyLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Login') },
      { path: 'chat', component: () => import('pages/Chat'), props: true, name: 'Chat', meta: { requiresAuth: true } },
      { path: 'chat/:id', component: () => import('pages/Chat'), props: true, name: 'Chat', meta: { requiresAuth: true } },
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
