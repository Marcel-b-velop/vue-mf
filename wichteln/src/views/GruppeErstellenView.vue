<script setup lang="ts">
import { useForm } from 'vee-validate'
import { defineAsyncComponent, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { string, object } from 'yup'
import { useUserService } from '@/services/userService'
import { useAuthStore } from '@/stores/authStore'

const router = useRouter();
const { createAdminUser } = useUserService()
const authStore = useAuthStore()

interface WichtelEvent {
  name: string
  gruppe: string
  password: string
}

interface WichtelParam {
  gruppe: string
  isAdmin: boolean
  adminName: string
  time: string
}

interface Gruppe {
  grp?: string
}

const props = defineProps<Gruppe>()
const { handleSubmit, defineField, errors } = useForm<WichtelEvent>({
  validationSchema: object({
    name: string()
      .required('Name ist erforderlich')
      .min(2, 'Der Benutzername muss mindestens 2 Zeichen lang sein'),
    gruppe: string().required('Gruppe ist erforderlich'),
    password: string()
      .required('Passwort ist erforderlich')
      .min(4, 'Passwort muss mindestens 4 Zeichen lang sein')
      .matches(/[0-9]/, 'Passwort muss mindestens eine Ziffer enthalten')
      .matches(/[a-zA-Z]/, 'Passwort muss mindestens einen Buchstaben enthalten'),
  }),
  initialValues: {},
})

onMounted(() => {
  if (props.grp) {
    const e = JSON.parse(atob(props.grp)) as WichtelParam
    console.info(e)
  }
})

const [name] = defineField('name')
const [gruppe] = defineField('gruppe')
const [password] = defineField('password')

const BaseInput = defineAsyncComponent(() => import('remote-lib/BaseInput'))

const onSubmit = handleSubmit(async (values) => {
  try {
    const others = btoa(
      JSON.stringify({
        gruppe: values.gruppe,
        isAdmin: false,
        adminName: values.name,
        time: new Date().toUTCString(),
      }),
    )
    const asBase64 = btoa(JSON.stringify(values))
    // asBase64 in der DB speicher, als Gruppe
    const url = new URL(window.location.href)
    url.searchParams.set('grp', others)
    
    // Admin-User erstellen und Gruppe erstellen (Token wird automatisch im Auth-Store gespeichert)
    await createAdminUser({ 
      userName: values.name, 
      password: values.password,
      gruppenName: values.gruppe
    });
    console.info('Admin-User und Gruppe erstellt')
    
    router.push({ name: 'Wichteln - Dein Profil', query: { grp: asBase64 } }).catch(console.error)
  } catch (err: any) {
    console.error('Fehler beim Erstellen des Admin-Users:', err.message)
  }
})
</script>

<template>
  <h1 class="flex justify-center text-4xl mb-4">Anmeldung</h1>
  <div class="flex justify-center">
    <form @submit="onSubmit">
      <BaseInput v-model="name" :error-message="errors.name" label="Name" type="username" class="mb-4" />
      <BaseInput v-model="password" :error-message="errors.password" label="Passwort" type="password" class="mb-5" />
      <hr />
      <BaseInput v-model="gruppe" :error-message="errors.gruppe" label="Gruppe" type="text" class="mb-5 mt-2" />
      <div v-if="authStore.error" class="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
        {{ authStore.error }}
      </div>
      <button 
        type="submit"
        :disabled="authStore.isLoading"
        class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {{ authStore.isLoading ? 'Wird erstellt...' : 'Gruppe erstellen' }}
      </button>
    </form>
  </div>
</template>

<style scoped></style>
