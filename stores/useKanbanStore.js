import { defineStore } from 'pinia'

export const useKanbanStore = defineStore('kanban', {
  state: () => ({
    columns: [
      { id: 1, title: 'A Fazer', color: '#3b82f6' },
      { id: 2, title: 'Fazendo', color: '#f59e0b' },
      { id: 3, title: 'Feito', color: '#10b981' }
    ],

    tasks: [],

    modalAddColumnOpen: false,
    modalAddTaskOpen: false,

    nextColumnId: 4,
    nextTaskId: 1
  }),

  actions: {
    abrirModalAddColuna() {
      this.modalAddColumnOpen = true
    },

    fecharModalAddColuna() {
      this.modalAddColumnOpen = false
    },

    adicionarColuna({ nome, cor }) {
      this.columns.push({
        id: this.nextColumnId++,
        title: nome,
        color: cor
      })

      this.modalAddColumnOpen = false
    },

    removerColuna(id) {
      this.columns = this.columns.filter((c) => c.id !== id)
    },

    abrirModalAddTarefa() {
      this.modalAddTaskOpen = true
    },

    fecharModalAddTarefa() {
      this.modalAddTaskOpen = false
    },

    adicionarTarefa(dados) {
      const now = new Date()
      const pad = (n) => String(n).padStart(2, '0')
      const date = `${pad(now.getDate())}/${pad(now.getMonth() + 1)}/${now.getFullYear()}`

      this.tasks.push({
        id: this.nextTaskId++,
        title: dados.title,
        description: dados.description || '',
        priority: dados.priority || 'media',
        columnId: dados.columnId,
        createdAt: date
      })
    }
  }
})
