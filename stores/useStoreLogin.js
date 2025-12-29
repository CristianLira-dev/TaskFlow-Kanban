import { defineStore } from 'pinia'

export const useStoreLogin = defineStore('storeLogin', {
  state: () => ({
    class: ''
  }),

  actions: {
    // Inicializa lendo do localStorage
    inicializarClass() {
      if (!process.client) return

      const classSalva = localStorage.getItem('class-login')
      if (classSalva) {
        this.class = classSalva
      }
    },

    setClass(novaClass) {
      this.class = novaClass
      if (process.client) {
        localStorage.setItem('class-login', novaClass)
      }
    }
  }
})
