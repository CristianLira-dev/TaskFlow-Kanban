import { defineStore } from 'pinia'

export const useKanbanStore = defineStore('kanban', {
  state: () => ({
    columns: [
      { id: 1, title: 'A Fazer', cor: '#C2C7D2', icon: 1 },
      { id: 2, title: 'Fazendo', cor: '#FFB12B', icon: 2 },
      { id: 3, title: 'Feito', cor: '#007646', icon: 3 }
    ],
    modalAddColumnOpen: false,
    nextColumnId: 4
  }),

  actions: {
    abrirModalAddColuna() {
      this.modalAddColumnOpen = true
    },

    fecharModalAddColuna() {
      this.modalAddColumnOpen = false
    },

    adicionarColuna(dados) {
      this.columns.push({
        id: this.nextColumnId++,
        title: dados.nome,
        cor: dados.cor,
        icon: dados.icon
      })

      this.modalAddColumnOpen = false
    },
    removerColuna(colunaId) {
      const idx = this.columns.findIndex((c) => c.id === colunaId)
      if (idx !== -1) this.columns.splice(idx, 1)
    }
  }
})
