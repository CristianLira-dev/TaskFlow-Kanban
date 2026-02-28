import { defineStore } from 'pinia'

const STORAGE_KEY = 'taskflow-kanban-data'

const getDefaultColumns = () => [
  { id: 1, title: 'A Fazer', color: '#3b82f6', order: 1 },
  { id: 2, title: 'Fazendo', color: '#f59e0b', order: 2 },
  { id: 3, title: 'Feito', color: '#10b981', order: 3 }
]

const toNumber = (value, fallback = 0) => {
  const n = Number(value)
  return Number.isFinite(n) ? n : fallback
}

export const useKanbanStore = defineStore('kanban', {
  state: () => ({
    columns: getDefaultColumns(),

    tasks: [],

    modalAddColumnOpen: false,
    modalAddTaskOpen: false,
    colunaParaEditar: null,
    tarefaParaEditar: null,

    nextColumnId: 4,
    nextColumnOrder: 4,
    nextTaskId: 1
  }),

  getters: {
    getTasksByColumn: (state) => (columnId) => {
      return state.tasks
        .filter((task) => task.columnId === columnId)
        .sort((a, b) => toNumber(a.order, 0) - toNumber(b.order, 0))
    },

    getColumnById: (state) => (columnId) => {
      return state.columns.find((col) => col.id === columnId)
    },

    estaEditandoColuna: (state) => {
      return state.colunaParaEditar !== null
    },

    estaEditandoTarefa: (state) => {
      return state.tarefaParaEditar !== null
    }
  },

  actions: {
    initializeFromStorage() {
      if (!process.client) return

      try {
        const savedData = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null')

        if (!savedData) return

        this.columns = Array.isArray(savedData.columns) && savedData.columns.length
          ? savedData.columns.sort((a, b) => toNumber(a.order, 0) - toNumber(b.order, 0))
          : getDefaultColumns()

        this.tasks = Array.isArray(savedData.tasks)
          ? savedData.tasks.map((task) => ({ ...task, order: toNumber(task.order, 1) }))
          : []

        this.nextColumnId = toNumber(savedData.nextColumnId, this.columns.length + 1)
        this.nextColumnOrder = toNumber(savedData.nextColumnOrder, this.columns.length + 1)
        this.nextTaskId = toNumber(savedData.nextTaskId, this.tasks.length + 1)
      } catch {
        this.columns = getDefaultColumns()
        this.tasks = []
      }
    },

    persistData() {
      if (!process.client) return

      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          columns: this.columns,
          tasks: this.tasks,
          nextColumnId: this.nextColumnId,
          nextColumnOrder: this.nextColumnOrder,
          nextTaskId: this.nextTaskId
        })
      )
    },

    // ============================================
    // AÇÕES DE MODAL - COLUNA
    // ============================================
    abrirModalAddColuna(coluna = null) {
      if (coluna) {
        this.colunaParaEditar = { ...coluna }
      } else {
        this.colunaParaEditar = null
      }

      this.modalAddColumnOpen = true
    },

    fecharModalAddColuna() {
      this.modalAddColumnOpen = false
      this.colunaParaEditar = null
    },

    // ============================================
    // AÇÕES DE MODAL - TAREFA
    // ============================================
    abrirModalAddTarefa(tarefa = null) {
      if (tarefa) {
        this.tarefaParaEditar = { ...tarefa }
      } else {
        this.tarefaParaEditar = null
      }

      this.modalAddTaskOpen = true
    },

    fecharModalAddTarefa() {
      this.modalAddTaskOpen = false
      this.tarefaParaEditar = null
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
      this.persistData()
      this.fecharModalAddColuna()
    },

    editarColuna({ id, nome, cor }) {
      const index = this.columns.findIndex((c) => c.id === id)

      if (index !== -1) {
        this.columns[index].title = nome
        this.columns[index].color = cor
        this.persistData()
      }

      this.fecharModalAddColuna()
    },

    removerColuna(id) {
      const index = this.columns.findIndex((c) => c.id === id)

      if (index !== -1) {
        this.columns.splice(index, 1)
        this.tasks = this.tasks.filter((task) => task.columnId !== id)
        this.persistData()
      }
    },

    reordenarColunas(columnId, newIndex) {
      const columnIndex = this.columns.findIndex((c) => c.id === columnId)

      if (columnIndex !== -1) {
        const [column] = this.columns.splice(columnIndex, 1)
        this.columns.splice(newIndex, 0, column)

        this.columns.forEach((col, idx) => {
          col.order = idx + 1
        })

        this.nextColumnOrder = this.columns.length + 1
        this.persistData()
      }
    },

    // ============================================
    // CRUD - TAREFAS
    // ============================================
    adicionarTarefa(dados) {
      const now = new Date()
      const pad = (n) => String(n).padStart(2, '0')
      const date = `${pad(now.getDate())}/${pad(now.getMonth() + 1)}/${now.getFullYear()}`
      const columnId = dados.columnId || this.columns[0]?.id || 1
      const maxOrder = this.tasks
        .filter((task) => task.columnId === columnId)
        .reduce((max, task) => Math.max(max, toNumber(task.order, 0)), 0)

      const novaTarefa = {
        id: this.nextTaskId++,
        title: dados.title,
        description: dados.description || '',
        priority: dados.priority || 'media',
        columnId,
        order: maxOrder + 1,
        createdAt: date
      }

      this.tasks.push(novaTarefa)
      this.persistData()
      this.fecharModalAddTarefa()
    },

    editarTarefa(dados) {
      const index = this.tasks.findIndex((t) => t.id === dados.id)

      if (index !== -1) {
        const colunaAnterior = this.tasks[index].columnId
        const novaColuna = dados.columnId || this.columns[0]?.id || 1

        this.tasks[index].title = dados.title
        this.tasks[index].description = dados.description || ''
        this.tasks[index].priority = dados.priority || 'media'
        this.tasks[index].columnId = novaColuna

        if (colunaAnterior !== novaColuna) {
          const maxOrder = this.tasks
            .filter((task) => task.columnId === novaColuna && task.id !== dados.id)
            .reduce((max, task) => Math.max(max, toNumber(task.order, 0)), 0)

          this.tasks[index].order = maxOrder + 1
          this.reordenarPorColunaInterno(colunaAnterior)
        }

        this.reordenarPorColunaInterno(novaColuna)
        this.persistData()
      }

      this.fecharModalAddTarefa()
    },

    removerTarefa(taskId) {
      const index = this.tasks.findIndex((t) => t.id === taskId)

      if (index !== -1) {
        const colunaRemovida = this.tasks[index].columnId
        this.tasks.splice(index, 1)
        this.reordenarPorColunaInterno(colunaRemovida)
        this.persistData()
      }
    },

    moverTarefa(taskId, novaColumnId) {
      const task = this.tasks.find((t) => t.id === taskId)

      if (task) {
        task.columnId = novaColumnId
      }
    },

    reordenarPorColunaInterno(columnId) {
      const tarefasDaColuna = this.tasks
        .filter((task) => task.columnId === columnId)
        .sort((a, b) => toNumber(a.order, 0) - toNumber(b.order, 0))

      tarefasDaColuna.forEach((task, idx) => {
        task.order = idx + 1
      })
    },

    reordenarTarefas(columnId, taskIds) {
      taskIds.forEach((taskId, idx) => {
        const task = this.tasks.find((item) => item.id === taskId)

        if (task) {
          task.columnId = columnId
          task.order = idx + 1
        }
      })

      this.persistData()
    }
  }
})
