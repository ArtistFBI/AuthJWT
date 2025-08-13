<template>
    <div class="buttonWrapper">
      <p class="register-link">
        <span @click="goToRegister" class="register-link-highlight">Зарегистрировать</span>
      </p>
      <PrimaryButton @click="logout" class="button">Выйти</PrimaryButton>
    </div>
  <a href="http://pkm.sphera-it.space">ПК МКС</a>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth'
import PrimaryButton from '@/components/ui/buttons/PrimaryButton.vue'
import {useRouter} from "vue-router";
import VueCookies from "vue-cookies";

const router = useRouter()
const authStore = useAuthStore()

const logout = () => {
    authStore.logout()
    VueCookies.remove("uid", '/','.sphera-it.space')
    VueCookies.remove("access_token",  '/', '.sphera-it.space')
    VueCookies.remove("refresh_token",  '/', '.sphera-it.space')
    window.location.href = '/login' // Redirect to login page after logout
}

const goToRegister = () => {
    router.push('/register') // Redirect to register page
}
</script>

<style scoped>
h2 {
    text-align: center;
    margin-top: 20px;
}

p {
    text-align: center;
    margin-right: 10px;
    font-size: 18px;
}

.buttonWrapper {
    display: flex;
    justify-content: right;
    height: 2.5rem;
    margin-top: 1rem;
    margin-right: 1rem;
}

.button {
    width: 10rem;
}

.register-link {
  color: black;
  display: block;
  text-align: right;
  margin-top: 0.5rem;
}

.register-link-highlight {
  color: #0084FF;
  cursor: pointer;
  text-decoration: none;
}

.register-link-highlight:hover {
  text-decoration: underline;
}
</style>