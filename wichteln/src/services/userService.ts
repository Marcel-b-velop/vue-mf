import axios from 'axios'
import { useAuthStore } from '@/stores/authStore'
import { useGruppeService } from './gruppeService'

const IDENTITY_SERVER_BASE_URL = 'http://localhost:5283/api/identity'

interface CreateAdminUserRequest {
  userName: string
  password: string
  gruppenName: string
}

interface AuthResponse {
  token: string
  email: string
  userId: string
}

export function useUserService() {
  const authStore = useAuthStore()
  const gruppeService = useGruppeService()

  const createAdminUser = async (request: CreateAdminUserRequest): Promise<void> => {
    try {
      authStore.isLoading = true
      authStore.error = null

      // E-Mail-Adresse aus userName generieren, falls keine gültige E-Mail vorhanden
      let email = request.userName
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(request.userName)) {
        // Wenn kein @ vorhanden ist, füge @wichteln.local hinzu
        email = `${request.userName}@wichteln.local`
      }

      // Admin-User direkt mit Admin-Rolle erstellen
      const registerResponse = await axios.post<AuthResponse>(
        `${IDENTITY_SERVER_BASE_URL}/register-admin`,
        {
          email: email,
          password: request.password,
          userName: request.userName,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )

      const { token } = registerResponse.data
      
      // Token im Auth-Store speichern
      authStore.setToken(token)
      
      // Warten, bis der User geladen ist (für die Gruppe-Erstellung benötigt)
      await authStore.fetchUser()
      
      // Gruppe erstellen mit dem Token
      await gruppeService.createGruppe(request.gruppenName)
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.errors?.join(', ') ||
        err.message ||
        'Fehler beim Erstellen des Admin-Users'
      authStore.error = errorMessage
      throw new Error(errorMessage)
    } finally {
      authStore.isLoading = false
    }
  }

  return {
    createAdminUser,
  }
}

