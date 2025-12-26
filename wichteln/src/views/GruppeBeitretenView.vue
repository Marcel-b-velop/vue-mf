<script setup lang="ts">
import { useForm } from 'vee-validate'
import { defineAsyncComponent, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { string, object } from 'yup'

const router = useRouter();

interface WichtelEvent {
  name: string
}

interface WichtelParam {
  gruppe: string
  isAdmin: boolean
  name: string
  time: string
}

interface Gruppe {
  grp?: string
}

const gruppenName = ref('')
const adminName = ref('')

const props = defineProps<Gruppe>()
const { handleSubmit, defineField, errors } = useForm<WichtelEvent>({
  validationSchema: object({
    name: string().required('Name ist erforderlich'),
  }),
  initialValues: {},
})

onMounted(() => {
  if (props.grp) {
    const e = JSON.parse(atob(props.grp)) as WichtelParam
    gruppenName.value = e.gruppe
    adminName.value = e.name
    console.info(e)
  }
})

const [name] = defineField('name')

const BaseInput = defineAsyncComponent(() => import('remote-lib/BaseInput'))

const onSubmit = handleSubmit((values) => {
  console.info('Speichern', { ...values, grp: props.grp })
  // TODO Profil speicher und mit der ID dorthin
  const id = 2;
  router.push({name: "Wichteln - Gruppe", params: { id }}).catch(console.error)

})
</script>

<template>
  <h1 class="flex justify-center text-5xl mb-4">&gt;-= {{ gruppenName }} =-&lt;</h1>
  <h2 class="flex justify-center text mb-4">
    {{ adminName }} lädt dich in die Wichtelgruppe {{ gruppenName }} ein. Bitte gib deinen Namen ein und bestätige mit Teilnehmen!
  </h2>
  <div class="flex justify-center">
    <form @submit="onSubmit">
      <div class="flex gap-4">
        <div>
          <BaseInput
            v-model="name"
            :error-message="errors.name"
            label="Name"
            type="username"
            class="mb-4"
          />
        </div>
        <div class="items-end content-center">
          <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Teilnehmen
          </button>
        </div>
      </div>
    </form>
  </div>
</template>

<style scoped></style>
