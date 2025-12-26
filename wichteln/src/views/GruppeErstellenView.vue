<script setup lang="ts">
import { useForm } from 'vee-validate'
import { defineAsyncComponent, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { string, object } from 'yup'

const router = useRouter();

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
    name: string().required('Name ist erforderlich'),
    gruppe: string().required('Gruppe ist erforderlich'),
    password: string().required('Passwort ist erforderlich'),
  }),
  initialValues: {},
})

onMounted(() => {
  if(props.grp){
    const e = JSON.parse(atob(props.grp)) as WichtelParam
    console.info(e)
  }
})

const [name] = defineField('name')
const [gruppe] = defineField('gruppe')
const [password] = defineField('password')

const BaseInput = defineAsyncComponent(() => import('remote-lib/BaseInput'))

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
  router.push({ name: 'Wichteln - Dein Profil', query: { grp: asBase64 } }).catch(console.error)
})
</script>

<template>
  <h1 class="flex justify-center text-4xl mb-4">Anmeldung</h1>
  <div class="flex justify-center">
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
      <hr />
      <BaseInput
        v-model="gruppe"
        :error-message="errors.gruppe"
        label="Gruppe"
        type="text"
        class="mb-5 mt-2"
      />
      <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        Gruppe erstellen
      </button>
    </form>
  </div>
</template>

<style scoped></style>
