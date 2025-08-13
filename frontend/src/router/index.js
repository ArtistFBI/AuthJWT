import { createRouter, createWebHistory } from 'vue-router'

import { useAuthStore } from '@/stores/auth.js'
import VueCookies from 'vue-cookies'

const routes = [
  {
    path: '/',
    name: 'Start',
    component: () => import('@/views/Home.vue'), // Default page
    meta: { requiresAuth: true }, // Route requires authentication
  },
  {
    path: '/home',
    name: 'Home',
    component: () => import('@/views/Home.vue'), // Lazy load HomeView component
    meta: { requiresAuth: true }, // Route requires authentication
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login.vue'), // Lazy load LoginView component
    meta: { requiresAuth: false }, // Route does not require authentication
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('@/views/Register.vue'), // Lazy load RegisterView component
    meta: { requiresAuth: true }, // Route does not require authentication
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/404.vue'), // Lazy load NotFoundView component
  },

]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

const uuid = VueCookies.get('uid'),
    accessToken = VueCookies.get("access_token"),
    refreshToken = VueCookies.get("refresh_token"),
    auth = useAuthStore();
if (!accessToken || !refreshToken || !uuid) auth.logout();

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  if (to.meta.requiresAuth && !authStore.isLoggedIn) { // Check if logged in
    next({ name: 'Login' }) // Redirect to login if not authenticated
  } else if (to.name === 'Login' && authStore.isLoggedIn) {
    next({ name: 'Home' }) // Redirect to home if already logged in
  } else {
    next() // Proceed to the route
  }
})

export default router
