<template>
  <router-view v-slot="{ Component, route }">
    <!-- If we're on login or register, show page directly -->
    <component :is="Component" v-if="route.path === '/login' || route.path === '/register'" />
    <div v-else>
      <component :is="Component" />
    </div>
  </router-view>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import { watch } from 'vue'

const auth = useAuthStore()
const router = useRouter()

watch(() => auth.token, (newToken) => {
  if (!newToken) {
    router.push('/login')
  }
})
</script>

<style scoped>
html,
body {
  margin: 0;
  padding: 0;
  overflow-x: hidden;
}
</style>
