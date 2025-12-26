import { defineStore } from 'pinia'

interface Teilnehmer {
  name: string
  id: number
  aktiv: boolean
}

interface WichtelnProfil {
  id: number
  name: string
  isAdmin: boolean
  gruppe: string
  gruppeId: string
  gruppeAktiv: boolean
  wichtel: string
  wichtelId: number
  wichtelWuensche: string[]
  meineWuensche: string[]
  teilnehmer: string[]
}
export const useWichtelnProfilStore = defineStore('wichtelnProfilStore', {
  state: (): WichtelnProfil => ({
    id: 0,
    name: '',
    isAdmin: false,
    gruppe: '',
    gruppeId: '',
    gruppeAktiv: false,
    wichtel: '',
    wichtelId: 0,
    wichtelWuensche: [],
    meineWuensche: [],
    teilnehmer: [],
  }),
})
