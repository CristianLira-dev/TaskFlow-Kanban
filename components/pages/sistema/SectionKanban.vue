<template>
  <section class="colunas-container">
    <!-- Debug: Mostra quantidade de colunas -->
    <div v-if="colunas.length === 0" class="debug-message">Adicione uma coluna para começar a sua produtividade!</div>

    <div class="colunas-wrapper" ref="columnsWrapper">
      <div class="colunas" ref="columnsContainer">
        <div v-for="column in colunas" :key="column.id" class="coluna" :style="colunaStyle(column)" :data-column-id="column.id">
          <div class="coluna-cabecalho">
            <div class="coluna-titulo-wrapper">
              <h1 class="coluna-titulo">{{ column.title }}</h1>
            </div>
            <div class="acoes">
              <button class="btn-editar-coluna" @click="editarColuna(column)" title="Editar coluna">
                <Svgs nome="editar" class="icone-editar" />
              </button>
              <button v-if="kanbanStore.columns.length > 1" class="btn-excluir-coluna" @click="emitirExclusaoColuna(column)">
                <Svgs nome="lixeira" class="icone-excluir" />
              </button>
            </div>
          </div>

          <div class="coluna-conteudo">
            <div v-if="tasksByColumn(column.id).length < 1" class="coluna-vazia">
              <p>Adicione Tarefas a esta coluna</p>
            </div>

            <div class="kanban-tasks" :data-column-id="column.id">
              <div class="kanban-card" v-for="task in tasksByColumn(column.id)" :key="task.id" :data-task-id="task.id">
                <div class="header-card">
                  <h4>{{ task.title }}</h4>

                  <div class="actions">
                    <button class="btn-editar-tarefa" @click="emitirEditarTarefa(task)" title="Editar Tarefa">
                      <Svgs nome="editar" class="icone-editar" />
                    </button>
                    <button class="btn-excluir-task" @click="emitirExclusaoTarefa(task)" title="Excluir Tarefa">
                      <Svgs nome="lixeira" class="icone-excluir" />
                    </button>
                  </div>
                </div>
                <p v-if="task.description">{{ task.description }}</p>
                <div class="prioridade-data">
                  <span :class="['priority', getPriorityClass(task.priority)]">{{ formatarPrioridade(task.priority) }}</span>
                  <p class="date">{{ task.createdAt }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="mostrarIndicadoresRolagem" class="indicadores-rolagem">
      <button class="btn-rolagem btn-rolagem-esquerda" :class="{ desabilitado: !podeRolarEsquerda }" @click="rolarEsquerda" aria-label="Rolar para esquerda">
        <Svgs nome="seta-esquerda" class="icone-rolagem" />
      </button>
      <button class="btn-rolagem btn-rolagem-direita" :class="{ desabilitado: !podeRolarDireita }" @click="rolarDireita" aria-label="Rolar para direita">
        <Svgs nome="seta-direita" class="icone-rolagem" />
      </button>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick, watch } from 'vue'
import { useKanbanStore } from '@/stores/useKanbanStore'
import Sortable from 'sortablejs'

const kanbanStore = useKanbanStore()

const emit = defineEmits(['excluir-coluna', 'excluir-tarefa', 'editar-tarefa'])

// ✅ Usar computed para garantir reatividade
const colunas = computed(() => kanbanStore.columns)
const tarefas = computed(() => kanbanStore.tasks)

// Função para emitir evento de exclusão de coluna
const emitirExclusaoColuna = (column) => {
  emit('excluir-coluna', column)
}

// Função para emitir evento de exclusão de tarefa
const emitirExclusaoTarefa = (task) => {
  emit('excluir-tarefa', task)
}

// ✅ NOVO: Função para emitir evento de editar tarefa
const emitirEditarTarefa = (task) => {
  emit('editar-tarefa', task)
}
// Refs para Sortable
const columnsWrapper = ref(null)
const columnsContainer = ref(null)
let columnSortable = null
const taskSortables = new Map()

// Função para obter tasks por coluna com computed
const tasksByColumn = (columnId) => {
  return tarefas.value.filter((task) => task.columnId === columnId)
}

// Classes de prioridade
const getPriorityClass = (priority) => {
  const classes = {
    baixa: 'priority-baixa',
    media: 'priority-media',
    alta: 'priority-alta'
  }
  return classes[priority] || ''
}

// Formatar prioridade
const formatarPrioridade = (prioridade) => {
  const map = {
    alta: 'Alta',
    media: 'Média',
    baixa: 'Baixa'
  }
  return map[prioridade] || prioridade
}

// Ações
const editarColuna = (column) => {
  kanbanStore.abrirModalAddColuna(column)
}

// Inicialização do Sortable
const initializeSortable = async () => {
  await nextTick()

  if (columnsContainer.value && !columnSortable) {
    columnSortable = new Sortable(columnsContainer.value, {
      animation: 200,
      filter: '.kanban-tasks, .kanban-card, .coluna-titulo-input, .btn-excluir-coluna',
      preventOnFilter: false,
      ghostClass: 'coluna-ghost',
      chosenClass: 'coluna-chosen',
      dragClass: 'coluna-drag',
      direction: 'horizontal',

      onEnd(evt) {
        const columnId = Number(evt.item.dataset.columnId)
        const newIndex = evt.newIndex
        kanbanStore.reordenarColunas(columnId, newIndex)
      }
    })
  }

  const taskContainers = document.querySelectorAll('.kanban-tasks')

  taskContainers.forEach((container) => {
    const columnId = Number(container.dataset.columnId)

    if (taskSortables.has(columnId)) {
      return
    }

    const sortable = new Sortable(container, {
      group: 'kanban-tasks',
      animation: 150,
      ghostClass: 'task-ghost',
      chosenClass: 'task-chosen',
      dragClass: 'task-drag',
      fallbackOnBody: true,
      swapThreshold: 0.65,

      filter: '.coluna-titulo-input, .btn-excluir-coluna',
      preventOnFilter: false,

      onStart(evt) {
        evt.item.classList.add('task-dragging')
      },

      onEnd(evt) {
        evt.item.classList.remove('task-dragging')

        const taskId = Number(evt.item.dataset.taskId)
        const newColumnId = Number(evt.to.dataset.columnId)

        kanbanStore.moverTarefa(taskId, newColumnId)
      },

      onChange(evt) {
        evt.to.classList.add('coluna-drop-target')
        setTimeout(() => {
          evt.to.classList.remove('coluna-drop-target')
        }, 300)
      }
    })
    taskSortables.set(columnId, sortable)
  })
}

// Watch para novas colunas
watch(
  () => kanbanStore.columns.length,
  async (newLength, oldLength) => {
    if (newLength > oldLength) {
      await nextTick()
      initializeSortable()
    }
  }
)

// Estilos das colunas
const getColorVar = (coluna) => {
  if (coluna.color) return coluna.color

  const title = (coluna.title || '').toLowerCase()
  if (title.includes('fazer')) return '#3b82f6'
  if (title.includes('fazendo')) return '#f59e0b'
  if (title.includes('feito')) return '#10b981'
  return '#10b981'
}

const colunaStyle = (coluna) => {
  const color = getColorVar(coluna)
  return {
    background: `linear-gradient(0deg, var(--cor-escuro-2) 10%, ${color} 1000%)`,
    borderColor: color
  }
}

// Controle de rolagem
const podeRolarEsquerda = ref(false)
const podeRolarDireita = ref(false)
const mostrarIndicadoresRolagem = ref(false)

const verificarRolagem = () => {
  if (!columnsWrapper.value || !columnsContainer.value) return

  const wrapper = columnsWrapper.value
  const container = columnsContainer.value

  podeRolarEsquerda.value = wrapper.scrollLeft > 0
  podeRolarDireita.value = wrapper.scrollLeft < container.scrollWidth - wrapper.clientWidth
  mostrarIndicadoresRolagem.value = container.scrollWidth > wrapper.clientWidth
}

const rolarEsquerda = () => {
  if (columnsWrapper.value && podeRolarEsquerda.value) {
    columnsWrapper.value.scrollBy({ left: -300, behavior: 'smooth' })
  }
}

const rolarDireita = () => {
  if (columnsWrapper.value && podeRolarDireita.value) {
    columnsWrapper.value.scrollBy({ left: 300, behavior: 'smooth' })
  }
}

// Lifecycle
let resizeObserver = null

onMounted(() => {
  console.log('SectionKanban montado')
  console.log('Colunas:', kanbanStore.columns)
  console.log('Tarefas:', kanbanStore.tasks)

  initializeSortable()
  verificarRolagem()

  if (columnsWrapper.value) {
    columnsWrapper.value.addEventListener('scroll', verificarRolagem)
  }

  resizeObserver = new ResizeObserver(verificarRolagem)
  if (columnsWrapper.value) {
    resizeObserver.observe(columnsWrapper.value)
  }
  if (columnsContainer.value) {
    resizeObserver.observe(columnsContainer.value)
  }

  window.addEventListener('resize', verificarRolagem)
})

onUnmounted(() => {
  if (columnSortable) {
    columnSortable.destroy()
    columnSortable = null
  }

  taskSortables.forEach((sortable) => {
    if (sortable) sortable.destroy()
  })
  taskSortables.clear()

  if (columnsWrapper.value) {
    columnsWrapper.value.removeEventListener('scroll', verificarRolagem)
  }

  if (resizeObserver) {
    resizeObserver.disconnect()
  }

  window.removeEventListener('resize', verificarRolagem)
})
</script>

<style lang="sass" scoped>
.debug-message
  padding: 20px
  margin: 20px
  background: rgba(255, 193, 7, 0.1)
  border: 2px solid #ffc107
  border-radius: 8px
  color: #ffc107
  font-family: var(--semibold)
  text-align: center

.colunas-container
  position: relative
  width: 100%
  margin-top: 20px

.colunas-wrapper
  overflow-x: auto
  overflow-y: hidden
  scrollbar-width: thin
  scrollbar-color: var(--cor-verde) transparent
  padding-bottom: 8px

  &::-webkit-scrollbar
    height: 6px

  &::-webkit-scrollbar-track
    background: transparent

  &::-webkit-scrollbar-thumb
    background-color: var(--cor-verde)
    border-radius: 3px

.colunas
  display: inline-flex
  gap: 20px
  padding: 0 20px
  min-width: min-content

.coluna
  min-width: 505px
  max-width: 505px
  background: linear-gradient(0deg, var(--cor-escuro-2) 10%, var(--cor-verde) 1000%)
  border-radius: 12px
  padding: 16px
  display: flex
  flex-direction: column
  border: 1px solid var(--cor-verde)
  transition: all 0.3s ease
  cursor: grab

  &:active
    cursor: grabbing

  &.coluna-ghost
    opacity: 0.4
    background: rgba(255, 255, 255, 0.1)

  &.coluna-chosen
    cursor: grabbing

  &.coluna-drag
    opacity: 1
    transform: rotate(3deg)

.coluna-cabecalho
  display: flex
  justify-content: space-between
  align-items: center
  margin-bottom: 16px
  padding-bottom: 12px
  border-bottom: 1px solid rgba(255, 255, 255, 0.1)

.coluna-titulo-wrapper
  display: flex
  align-items: center
  gap: 8px
  flex: 1

.coluna-titulo
  color: var(--cor-branco)
  font-family: var(--semibold)
  font-size: var(--f4)
  max-width: 420px
  white-space: nowrap
  overflow: hidden
  text-overflow: ellipsis
  padding: 4px 8px
  width: 100%
  min-width: 0
  margin: 0

  &:focus
    outline: 1px solid var(--cor-branco)
    background: rgba(255, 255, 255, 0.05)

.acoes
  display: flex
  align-items: center
  gap: 4px

.btn-excluir-coluna, .btn-excluir-task, .btn-editar-tarefa, .btn-editar-coluna
  background: transparent
  border: none
  color: rgba(255, 255, 255, 0.5)
  cursor: pointer
  padding: 4px
  border-radius: 4px
  transition: all 0.2s ease
  display: flex
  align-items: center
  justify-content: center
  width: 24px
  height: 24px

  &:hover
    background: rgba(255, 255, 255, 0.1)

  .icone-excluir,
  .icone-editar
    width: 16px
    height: 16px
    fill: currentColor

  &:has(.icone-excluir)
    &:hover
      color: var(--cor-vermelho)

  &:has(.icone-editar)
    &:hover
      color: var(--cor-azul)

.coluna-conteudo
  flex: 1
  min-height: 200px

.kanban-tasks
  min-height: 100px
  transition: background-color 0.3s ease
  border-radius: 8px
  padding: 4px

  &.coluna-drop-target
    background-color: rgba(255, 255, 255, 0.08)
    outline: 2px dashed rgba(255, 255, 255, 0.3)
    outline-offset: 4px

.kanban-card
  background-color: rgba(255, 255, 255, 0.03)
  border: 1px solid var(--cor-branco)
  padding: 16px
  border-radius: 8px
  margin-bottom: 14px
  width: 100%
  color: var(--cor-branco)
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.45)
  cursor: grab
  transition: transform 0.2s ease, box-shadow 0.2s ease

  &:active
    cursor: grabbing

  &.task-ghost
    opacity: 0.4
    background: rgba(255, 255, 255, 0.1)
    border-style: dashed

  &.task-chosen
    transform: scale(1.02)
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.6)

  &.task-drag
    opacity: 1
    transform: rotate(2deg) scale(1.05)
    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.8)
    z-index: 1000

  &.task-dragging
    cursor: grabbing
    opacity: 0.9

  .header-card
    display: flex
    justify-content: space-between
    align-items: center
    margin: 0 0 6px 0

    .actions
      display: flex
      justify-content: space-between
      align-items: center


  h4
    margin: 0 0 0 6px
    font-size: var(--f3)
    font-family: var(--semibold)
    color: var(--cor-branco)

  p
    margin: 0
    padding: 8px
    color: var(--cor-branco)
    font-family: var(--light)
    font-size: var(--f2)
    border-radius: 16px
    background-color: rgba(255, 255, 255, 0.03)

  .prioridade-data
    display: flex
    justify-content: space-between
    align-items: center
    margin-top: 8px
    padding: 10px 0 0 0
    border-radius: 999px
    font-size: var(--f1)
    font-family: var(--semibold)
    color: var(--cor-branco)

    .priority
      display: inline-block
      padding: 4px 10px
      border-radius: 999px
      font-size: 12px
      background: rgba(255, 255, 255, 0.04)
      color: var(--cor-branco)

    .priority-baixa
      background: rgba(161, 166, 255, 0.3)
      border: solid 1px var(--cor-azul)
      color: var(--cor-branco)

    .priority-alta
      background: rgba(201, 6, 19, 0.3)
      border: solid 1px var(--cor-vermelho)
      color: var(--cor-branco)

    .priority-media
      background: rgba(255, 196, 46, 0.3)
      border: solid 1px var(--cor-amarelo)
      color: var(--cor-branco)

    .date
      font-size: var(--f1)
      color: rgba(255, 255, 255, 0.5)
      margin: 0

.coluna-vazia
  text-align: center
  color: rgba(255, 255, 255, 0.3)
  font-family: var(--light)
  font-size: var(--f1)
  padding: 20px

.indicadores-rolagem
  position: absolute
  top: 50%
  left: 0
  right: 0
  transform: translateY(-50%)
  display: flex
  justify-content: space-between
  pointer-events: none
  padding: 0 8px

.btn-rolagem
  pointer-events: auto
  background: rgba(0, 0, 0, 0.7)
  border: 1px solid rgba(255, 255, 255, 0.2)
  border-radius: 50%
  width: 40px
  height: 40px
  display: flex
  align-items: center
  justify-content: center
  cursor: pointer
  transition: all 0.3s ease

  &:hover:not(.desabilitado)
    background: var(--cor-verde)
    border-color: var(--cor-verde)

  &.desabilitado
    opacity: 0.3
    cursor: not-allowed

.icone-rolagem
  width: 20px
  height: 20px
  fill: var(--cor-branco)

@media (max-width: 768px)
  .coluna
    min-width: 260px
    max-width: 260px

@media (max-width: 480px)
  .colunas
    gap: 12px
    padding: 0 12px

  .coluna
    min-width: 240px
    max-width: 240px
    padding: 12px
</style>
