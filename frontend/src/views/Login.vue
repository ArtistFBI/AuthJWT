<template>
  <Transition name="move" mode="out-in" appear>
    <div class="login-page">
      <div class="container">
        <h1 class="title">Login</h1>
        <form @submit.prevent="handleLogin">
          <div class="input-container">
            <label for="username" class="label">Username</label>
            <input type="username" id="username" placeholder="Username" autocomplete="username" v-model.trim="username"
              class="input-field" :class="{ 'input-field-error': errorMessage }" />
          </div>


          
          <div class="input-container">
            <div class="label-align">
              <label for="password" class="label">Password</label>
              <button type="button" @click="showPassword = !showPassword" class="toggle-password">
                {{ showPassword ? 'Hide' : 'Show' }}
              </button>
            </div>
            <input :type="showPassword ? 'text' : 'password'" id="password" placeholder="Password"
              autocomplete="current-password" v-model.trim="password" class="input-field"
              :class="{ 'input-field-error': errorMessage }" />
          </div>
          <div v-if="errorMessage" class="error-message">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24">
              <path fill="currentColor"
                d="M13,13H11V7H13M13,17H11V15H13M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z" />
            </svg>
            <p>{{ errorMessage }}</p>
          </div>

          <div class="buttonWrapper">
            <PrimaryButton :loading="loading">Login</PrimaryButton>
          </div>
        </form>
        <p class="register-link">
          No account yet?
          <span @click="goToRegister" class="register-link-highlight">Register here.</span>
        </p>
        <p class="footerText">Made with
          <!-- SVG for heart icon -->
          <svg id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 122.88 107.39"
            height="12">
            <path fill="#ff4033" class="cls-1"
              d="M60.83,17.18c8-8.35,13.62-15.57,26-17C110-2.46,131.27,21.26,119.57,44.61c-3.33,6.65-10.11,14.56-17.61,22.32-8.23,8.52-17.34,16.87-23.72,23.2l-17.4,17.26L46.46,93.55C29.16,76.89,1,55.92,0,29.94-.63,11.74,13.73.08,30.25.29c14.76.2,21,7.54,30.58,16.89Z" />
          </svg> in
          <!-- SVG for flag icon -->
          <svg xmlns="http://www.w3.org/2000/svg" shape-rendering="geometricPrecision" height="12"
            text-rendering="geometricPrecision" image-rendering="optimizeQuality" fill-rule="evenodd"
            clip-rule="evenodd" viewBox="0 0 43.06 29.96">
            <g fill-rule="nonzero">
              <path fill="#21468B"
                d="M43.06 20v7.59c0 1.3-1.06 2.37-2.37 2.37H2.37C1.06 29.96 0 28.89 0 27.59V20h43.06z" />
              <path fill="#fff" d="M43.06 20H0V2.37C0 1.06 1.06 0 2.37 0h38.32c1.31 0 2.37 1.06 2.37 2.37V20z" />
              <path fill="#AE1C28" d="M43.06 9.96H0V2.37C0 1.06 1.06 0 2.37 0h38.32c1.31 0 2.37 1.06 2.37 2.37v7.59z" />
            </g>
          </svg>
        </p>
        <p class="version">Version 0.0.1</p>
      </div>
    </div>
  </Transition>

</template>


<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { jwtDecode } from 'jwt-decode'
import { loginUser } from '@/api/authApi'
import { useAuthStore } from '@/stores/auth'
import PrimaryButton from '@/components/ui/buttons/PrimaryButton.vue'

const router = useRouter()
const authStore = useAuthStore()
const errorMessage = ref(null)
const showPassword = ref(false)

const username = ref('')
const password = ref('')
const error = ref(null)
const loading = ref(false)

async function handleLogin() {
  error.value = null
  loading.value = true
  try {
    const result = await loginUser(username.value, password.value)
    console.log('Login result:', result) // Log the result for debugging
    const decoded = jwtDecode(result.access_token)
    const userId = decoded.sub
    authStore.login(userId, result.access_token, result.refresh_token)

    router.push('/home') // ✅ use router object
  } catch (err) {
    error.value = err.message
    errorMessage.value = error.value
  } finally {
    loading.value = false
  }
}

function goToRegister() {
  router.push('/register')
}

</script>


<style scoped>
.buttonWrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 2.5rem;
  margin-top: 1rem;
}

.error-message {
  color: #D32F2F;
  border-radius: 1rem;
  display: flex;
  margin-top: 1rem;
  gap: 0.5rem;
}

.login-page {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
}

.container {
  width: 30rem;
  padding: 2rem 3rem;
  background-color: var(--card-bg);
  border: 1px solid #E0E0E0;
  border-radius: 1rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.title {
  font-size: 2rem;
  color: var(--text-color);

  font-weight: 600;
  margin-bottom: 2rem;
  margin-top: 1rem;
  user-select: none;
}

.input-container {
  margin-top: 1rem;
}

.label {
  display: block;
  font-size: 1rem;
  color: #757575;
  margin-bottom: 0.5rem;
  user-select: none;
}

.input-field {
  border: 1px solid #E0E0E0;
  border-radius: 1rem;
  padding: 1rem;
  font-size: 1rem;
  font-family: var(--font-family);
  width: 100%;
}

.input-field-error {
  border: 2px solid #D32F2F !important;
}

.register-link {
  color: black;
  display: block;
  text-align: right;
  margin-top: 1rem;
}

.register-link-highlight {
  color: #0084FF;
  cursor: pointer;
  text-decoration: none;
}

.register-link-highlight:hover {
  text-decoration: underline;
}

.footerText {
  color: rgb(124, 124, 124);
  font-size: 0.85rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding-top: 1.5rem;
}

.version {
  font-size: 0.8rem;
  color: #757575;
  text-align: center;
}

.label-align {
  display: flex;
  justify-content: space-between;
}

.toggle-password {
  background: none;
  border: none;
  color: #0084FF;
  cursor: pointer;
  font-size: 0.9rem;
  padding: 0;
  user-select: none;
}

.toggle-password:hover {
  text-decoration: underline;
}
</style>