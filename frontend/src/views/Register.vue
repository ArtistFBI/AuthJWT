<template>
    <Transition name="move" mode="out-in" appear>
      <div class="login-page">
        <div class="container">
          <template v-if="!registrationSuccess">
            <!-- ✏️ Your Registration Form -->
            <h1 class="title">Register</h1>
            <form @submit.prevent="handleRegister">
              <div class="input-container">
                <label for="username" class="label">Username</label>
                <input type="text" id="username" placeholder="Username" autocomplete="username"
                  v-model.trim="username" class="input-field"
                  :class="{ 'input-field-error': errorMessage }" />
              </div>
  
              <div class="input-container">
                <label for="password" class="label">Password</label>
                <input type="password" id="password" placeholder="Password" autocomplete="current-password"
                  v-model.trim="password" class="input-field"
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
                <PrimaryButton :loading="loading" @click="handleRegister">Register</PrimaryButton>
              </div>
            </form>
  
            <p class="register-link">
              Do you have an account?
              <span @click="goToLogin" class="register-link-highlight">Login here.</span>
            </p>
          </template>
  
          <template v-else>
            <!-- ✅ Success screen after registration -->
            <h1 class="title">Account Created 🎉</h1>
            <p class="confirmation-message">Your account has been successfully created!</p>
  
            <div class="buttonWrapper">
              <PrimaryButton @click="goToLogin">Go to Login</PrimaryButton>
            </div>
          </template>
        </div>
      </div>
    </Transition>
  </template>
  
  <script setup>
  import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
  import { useRouter } from 'vue-router'
  import { registerUser } from '@/api/authApi'
  import PrimaryButton from '@/components/ui/buttons/PrimaryButton.vue'
  
  const router = useRouter()
  const errorMessage = ref(null)
  
  const username = ref('')
  const password = ref('')
  const error = ref(null)
  const loading = ref(false)
  const registrationSuccess = ref(false)
  
  async function handleRegister() {
    error.value = null
    loading.value = true
    try {
      await registerUser(username.value, password.value)
      registrationSuccess.value = true
    } catch (err) {
      error.value = err.message
      errorMessage.value = error.value
    } finally {
      loading.value = false
    }
  }
  
  function goToLogin() {
    router.push('/login')
  }
  
  // 🆕 Handle pressing Enter after successful registration
  function handleKeydown(e) {
    if (e.key === 'Enter' && registrationSuccess.value) {
      e.preventDefault()
      goToLogin()
    }
  }
  
  // 🆕 Attach and remove event listeners
  onMounted(() => {
    window.addEventListener('keydown', handleKeydown)
  })
  
  onBeforeUnmount(() => {
    window.removeEventListener('keydown', handleKeydown)
  })
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
    /* Red color for errors */
    border-radius: 1rem;
    /* Space before the next input field */
    display: flex;
    margin-top: 1rem;
    gap: 0.5rem;
}


.loader {
    border: 2px solid #f3f3f3;
    /* Light grey border */
    border-top: 2px solid #3498db;
    /* Blue border for the spinner */
    border-radius: 50%;
    width: 20px;
    height: 20px;

    animation: spin 1s linear infinite;
    position: absolute;
    /* Position absolutely within the button */
    left: calc(50% - 10px);
    /* Center the spinner horizontally */
    top: calc(50% - 10px);
    /* Center the spinner vertically */
}

.forgot-password-link,
.register-link {
    color: #0084FF;
    text-align: right;
    user-select: none;
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

.forgot-password-link {
    margin: 0.25rem 0;
    cursor: pointer;
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
    /* Optional, removes underline */
}

.register-link-highlight:hover {
    text-decoration: underline;
    /* Underline on hover */
}

.register-link {
    display: block;
    margin-top: 1rem;
}

.forgot-password-link:hover {
    text-decoration: underline;
}


@keyframes spin {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
}

.submit-button:disabled {
    background-color: #ccc;
    /* Light grey background to indicate it's disabled */
    cursor: not-allowed;
    /* Cursor to indicate the button is not clickable */
}

.login-page {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100vh;
}

.container {
    width: 30rem;
    /* Adjusted width for better alignment */
    padding-left: 3rem;
    padding-right: 3rem;
    padding-top: 2rem;
    padding-bottom: 2rem;
    background-color: var(--card-bg);
    border: 1px solid #E0E0E0;
    border-radius: 1rem;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.title {
    font-size: 2rem;
    /* Larger font size for title */
    color: var(--text-color);

    font-weight: 600;
    /* Soft text color */
    margin-bottom: 2rem;
    margin-top: 1rem;
    user-select: none;

}

.form {
    display: flex;
    flex-direction: column;
}

.input-container {
    margin-top: 1rem;
}

.label {
    display: block;
    font-size: 1rem;
    color: #757575;
    /* Label color similar to example */
    margin-bottom: 0.5rem;
    user-select: none;
}

.input-field {
    border: 1px solid #E0E0E0;
    /* Input border color */
    border-radius: 1rem;
    padding: 1rem;
    font-size: 1rem;
    font-family: var(--font-family);
    width: 100%;
}

.input-field-error {
    border: 2px solid #D32F2F !important;

}

.submit-button {
    position: relative;
    background-color: #0084FF;
    /* Button color from original theme */
    color: #FFF;
    border: none;
    border-radius: 1rem;
    padding: 1rem;
    font-size: 1rem;
    cursor: pointer;
    box-shadow: none;
    /* No shadow for a flat design */
    margin-top: 1rem;
    height: 1.5rem;
}

.footer {
    margin-top: 2rem;
    font-size: 1rem;
    color: #757575;
    /* Footer text color */
}

.signup-link {
    color: #0084FF;
    text-decoration: none;
}

.version {
    font-size: 0.8rem;
    color: #757575;
    /* Footer text color */
    text-align: center;
}

.confirmation-message {
    text-align: center;
    padding: 1rem;
    background-color: #e8f4e9;
    /* Light green background */
    color: #34a853;
    /* Darker green text */
    border-radius: 1rem;
    margin: 1rem 0;
}

.label-align {
    display: flex;
    justify-content: space-between;
}
</style>