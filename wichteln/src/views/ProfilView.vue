<script setup lang="ts">
import { useForm } from 'vee-validate'
import { defineAsyncComponent, onMounted, reactive, ref } from 'vue'
import { string, object } from 'yup'

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

interface Profil {
  id?: string
}

const gruppenName = ref('')
const props = defineProps<Profil>()
const { handleSubmit, defineField, errors } = useForm<WichtelEvent>({
  validationSchema: object({
    name: string().required('Name ist erforderlich'),
    password: string().required('Passwort ist erforderlich'),
  }),
  initialValues: {},
})

onMounted(() => {
  if (props.id) {
    console.info(props.id)
  }
})

const [name] = defineField('name')
const [password] = defineField('password')

const BaseInput = defineAsyncComponent(() => import('remote-lib/BaseInput'))

const wichtelEvent: WichtelEvent = reactive({
  name: '',
  gruppe: '',
  password: '',
})

const onSubmit = handleSubmit((values) => {
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
  window.location.href = url.toString()
})
</script>

<template>
  <h1 class="flex justify-center text-5xl mb-4">^{{ gruppenName }}^</h1>
  <h2 class="flex justify-center text-4xl mb-4">Anmeldung</h2>
  <div class="flex justify-center">
    {{ id }}
    <form @submit="onSubmit">
      <BaseInput
        v-model="name"
        :error-message="errors.name"
        label="Name"
        type="username"
        class="mb-4"
      />
      <BaseInput
        v-model="password"
        :error-message="errors.password"
        label="Passwort"
        type="password"
        class="mb-5"
      />
      <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        Teilnehmen
      </button>
    </form>
  </div>
</template>

<style scoped></style>
