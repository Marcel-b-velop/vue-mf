import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios from 'axios'

const IDENTITY_SERVER_BASE_URL = 'http://localhost:5283/api/identity'

interface UserInfo {
  id: string
  email: string
  userName: string
  roles: string[]
  application?: string
}

const authClient = axios.create({
  baseURL: IDENTITY_SERVER_BASE_URL,
  timeout: 10_000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request Interceptor: Token zu Requests hinzufügen
authClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response Interceptor: 401 Handling
authClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('accessToken')
      window.dispatchEvent(new CustomEvent('auth:logout'))
    }
    return Promise.reject(error)
  }
)

export const useAuthStore = defineStore('authWichteln', () => {
  const user = ref<UserInfo | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const isAuthenticated = computed(() => {
    return !!localStorage.getItem('accessToken')
  })

  const isAdmin = computed(() => {
    return user.value?.roles.includes('Admin') ?? false
  })

  function setToken(token: string) {
    localStorage.setItem('accessToken', token)
    fetchUser()
  }

  function clearToken() {
    localStorage.removeItem('accessToken')
    user.value = null
    error.value = null
  }

  async function fetchUser() {
    try {
      if (!isAuthenticated.value) {
        user.value = null
        return
      }
      const response = await authClient.get<UserInfo>('/me')
      user.value = response.data
    } catch (err) {
      user.value = null
      clearToken()
    }
  }

  async function initialize() {
    if (isAuthenticated.value) {
      await fetchUser()
    }
  }

  return {
    user,
    isLoading,
    error,
    isAuthenticated,
    isAdmin,
    setToken,
    clearToken,
    fetchUser,
    initialize,
  }
})

