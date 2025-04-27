import { createRouter, createWebHistory } from 'vue-router'

import { useAuthStore } from '@/stores/auth'

const routes = [
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
    name: 'register',
    component: () => import('@/views/Register.vue'), // Lazy load RegisterView component
    meta: { requiresAuth: false }, // Route does not require authentication
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

router.beforeEach((to, from, next) => {
  // Check if the route requires authentication
  // and if the user is logged in
  // If the route requires authentication and the user is not logged in, redirect to login
  // Otherwise, proceed to the route  
  const authStore = useAuthStore()
  console.log("Is logged in " + authStore.isLoggedIn)
  if (to.meta.requiresAuth && !authStore.isLoggedIn) { // Check if logged in
    console.log("Should be here if not logged in.")
    next({ name: 'Login' }) // Redirect to login if not authenticated
  } else if (to.name === 'Login' && authStore.isLoggedIn) {
    next({ name: 'Home' }) // Redirect to home if already logged in
  } else {
    next() // Proceed to the route
  }
})

export default router
