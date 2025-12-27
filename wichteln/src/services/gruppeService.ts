import axios from 'axios'
import { useAuthStore } from '@/stores/authStore'

const API_BASE_URL = 'http://localhost:5282/api'

interface CreateGruppeRequest {
  grp: string
}

interface CreateGruppeResponse {
  id: number
  message: string
}

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10_000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request Interceptor: Token zu Requests hinzufügen
apiClient.interceptors.request.use(
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

export function useGruppeService() {
  const authStore = useAuthStore()

  const createGruppe = async (gruppenName: string): Promise<CreateGruppeResponse> => {
    try {
      // Base64-String erstellen (wie im View)
      const grpBase64 = btoa(
        JSON.stringify({
          gruppe: gruppenName,
          isAdmin: false,
          adminName: authStore.user?.userName || '',
          time: new Date().toUTCString(),
        })
      )

      const response = await apiClient.post<CreateGruppeResponse>(
        '/gruppen',
        {
          grp: grpBase64,
        } as CreateGruppeRequest
      )

      return response.data
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        'Fehler beim Erstellen der Gruppe'
      throw new Error(errorMessage)
    }
  }

  return {
    createGruppe,
  }
}

