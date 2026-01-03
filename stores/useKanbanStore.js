import { defineStore } from 'pinia'

export const useKanbanStore = defineStore('kanban', {
  state: () => ({
    columns: [
      { id: 1, title: 'A Fazer', color: '#3b82f6', order: 1 },
      { id: 2, title: 'Fazendo', color: '#f59e0b', order: 2 },
      { id: 3, title: 'Feito', color: '#10b981', order: 3 }
    ],

    tasks: [],

    modalAddColumnOpen: false,
    modalAddTaskOpen: false,

    nextColumnId: 4,
    nextColumnOrder: 4,
    nextTaskId: 4
  }),

  getters: {
    // Getter para obter tarefas por coluna
    getTasksByColumn: (state) => (columnId) => {
      return state.tasks.filter((task) => task.columnId === columnId)
    },

    // Getter para obter coluna por ID
    getColumnById: (state) => (columnId) => {
      return state.columns.find((col) => col.id === columnId)
    }
  },

  actions: {
    // ============================================
    // AÇÕES DE MODAL - COLUNA
    // ============================================
    abrirModalAddColuna(coluna = null) {
      this.modalAddColumnOpen = true
      // Se passar uma coluna, você pode guardar para edição
      if (coluna) {
        console.log('Editando coluna:', coluna)
        // Adicionar lógica de edição aqui se necessário
      }
    },

    fecharModalAddColuna() {
      this.modalAddColumnOpen = false
    },

    // ============================================
    // AÇÕES DE MODAL - TAREFA
    // ============================================
    abrirModalAddTarefa() {
      this.modalAddTaskOpen = true
    },

    fecharModalAddTarefa() {
      this.modalAddTaskOpen = false
    },

    // ============================================
    // CRUD - COLUNAS
    // ============================================
    adicionarColuna({ nome, cor }) {
      const novaColuna = {
        id: this.nextColumnId++,
        order: this.nextColumnOrder++,
        title: nome,
        color: cor || '#10b981'
      }

      this.columns.push(novaColuna)
      this.fecharModalAddColuna()

      console.log('Coluna adicionada:', novaColuna)
      console.log('Total de colunas:', this.columns.length)
    },

    removerColuna(id) {
      const index = this.columns.findIndex((c) => c.id === id)

      if (index !== -1) {
        // Remove a coluna
        this.columns.splice(index, 1)

        // Remove todas as tarefas dessa coluna
        this.tasks = this.tasks.filter((task) => task.columnId !== id)

        console.log('Coluna removida:', id)
        console.log('Total de colunas:', this.columns.length)
      }
    },

    reordenarColunas(columnId, newIndex) {
      const columnIndex = this.columns.findIndex((c) => c.id === columnId)

      if (columnIndex !== -1) {
        // Remove a coluna da posição antiga
        const [column] = this.columns.splice(columnIndex, 1)

        // Insere na nova posição
        this.columns.splice(newIndex, 0, column)

        // Atualiza a propriedade order
        this.columns.forEach((col, idx) => {
          col.order = idx + 1
        })

        console.log(
          'Colunas reordenadas:',
          this.columns.map((c) => c.title)
        )
      }
    },

    // ============================================
    // CRUD - TAREFAS
    // ============================================
    adicionarTarefa(dados) {
      const now = new Date()
      const pad = (n) => String(n).padStart(2, '0')
      const date = `${pad(now.getDate())}/${pad(now.getMonth() + 1)}/${now.getFullYear()}`

      const novaTarefa = {
        id: this.nextTaskId++,
        title: dados.title,
        description: dados.description || '',
        priority: dados.priority || 'media',
        columnId: dados.columnId || this.columns[0]?.id || 1,
        createdAt: date
      }

      this.tasks.push(novaTarefa)
      this.fecharModalAddTarefa()

      console.log('Tarefa adicionada:', novaTarefa)
      console.log('Total de tarefas:', this.tasks.length)
    },

    removerTarefa(taskId) {
      const index = this.tasks.findIndex((t) => t.id === taskId)

      if (index !== -1) {
        this.tasks.splice(index, 1)
        console.log('Tarefa removida:', taskId)
        console.log('Total de tarefas:', this.tasks.length)
      }
    },

    moverTarefa(taskId, novaColumnId) {
      const task = this.tasks.find((t) => t.id === taskId)

      if (task) {
        task.columnId = novaColumnId
        console.log(`Tarefa ${taskId} movida para coluna ${novaColumnId}`)
      }
    },

    reordenarTarefas(columnId, taskIds) {
      // Implementar se necessário ordenação dentro da coluna
      console.log(`Tarefas reordenadas na coluna ${columnId}:`, taskIds)
    }
  }
})
