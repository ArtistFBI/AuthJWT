import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    isLoggedIn: false,
    userId: null,
    token: null,
    refreshToken: null,
  }),
  actions: {
    login(uuid, token, refreshToken) {
      this.isLoggedIn = true
      this.userId = uuid
      this.token = token
      this.refreshToken = refreshToken
    },
    logout() {
      this.isLoggedIn = false
      this.userId = null
      this.token = null
      this.refreshToken = null
    },
    updateToken(newToken) { 
      this.token = newToken
    }
  },
  persist: {
    enabled: true,
    beforeRestore: (context) => {
      console.log('State is being restored:', context)
    },
    afterRestore: (context) => {
      console.log('State has been restored:', context)
    },
  },
})
