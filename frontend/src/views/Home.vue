<template>
    <div>
        <h2>Welcome to the Portal</h2>
        <p v-if="isLoggedIn">You are logged in with UUID: {{ userId }}</p>
    </div>
    <div class="buttonWrapper">
        <PrimaryButton @click="logout" class="button">Logout</PrimaryButton>
    </div>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth'
import PrimaryButton from '@/components/ui/buttons/PrimaryButton.vue'
const authStore = useAuthStore()

const isLoggedIn = authStore.isLoggedIn
const userId = authStore.userId

const logout = () => {
    authStore.logout()
    window.location.href = '/login' // Redirect to login page after logout
}
</script>

<style scoped>
h2 {
    text-align: center;
    margin-top: 20px;
}

p {
    text-align: center;
    margin-top: 10px;
    font-size: 18px;
}

.buttonWrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 2.5rem;
    margin-top: 1rem;

}

.button {
    width: 10rem;
}
</style>