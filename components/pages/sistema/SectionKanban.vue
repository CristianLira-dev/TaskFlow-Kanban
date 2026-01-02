<template>
  <section class="colunas-container">
    <div class="colunas-wrapper" ref="columnsWrapper">
      <!-- Container das colunas (arrastar colunas inteiras) -->
      <div class="colunas" ref="columnsContainer">
        <div v-for="column in kanbanStore.columns" :key="column.id" class="coluna" :style="colunaStyle(column)" :data-column-id="column.id">
          <div class="coluna-cabecalho">
            <div class="coluna-titulo-wrapper">
              <input v-model="column.title" type="text" class="coluna-titulo-input" @focus="handleTitleFocus(column)" @blur="handleTitleBlur(column)" @keyup.enter="$event.target.blur()" />
            </div>
            <button class="btn-excluir-coluna" @click="kanbanStore.removerColuna(column.id)" title="Excluir coluna" v-if="kanbanStore.columns.length > 1">
              <Svgs nome="lixeira" class="icone-excluir" />
            </button>
          </div>

          <div class="coluna-conteudo">
            <!-- Container de tasks (arrastar cards entre colunas) -->
            <div class="kanban-tasks" :data-column-id="column.id">
              <div class="kanban-card" v-for="task in tasksByColumn(column.id)" :key="task.id" :data-task-id="task.id">
                <div class="title-delete">
                  <h4>{{ task.title }}</h4>
                  <button class="btn-excluir-task" @click="kanbanStore.removerTarefa(task.id)" title="Excluir Tarefa">
                    <Svgs nome="lixeira" class="icone-excluir" />
                  </button>
                </div>
                <p v-if="task.description">{{ task.description }}</p>
                <div class="prioridade-data">
                  <span :class="['priority', getPriorityClass(task.priority)]">Prioridade: {{ task.priority }}</span>
                  <p class="date">{{ task.createdAt }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Indicadores de rolagem -->
    <div v-if="mostrarIndicadoresRolagem" class="indicadores-rolagem">
      <button class="btn-rolagem btn-rolagem-esquerda" :class="{ desabilitado: !podeRolarEsquerda }" @click="rolarEsquerda" aria-label="Rolar para esquerda">
        <Svgs nome="seta-esquerda" class="icone-rolagem" />
      </button>
      <button class="btn-rolagem btn-rolagem-direita" :class="{ desabilitado: !podeRolarDireita }" @click="rolarDireita" aria-label="Rolar para direita">
        <Svgs nome="seta-direita" class="icone-rolagem" />
      </button>
    </div>

    <ModalAddColuna :show="mostrarModal" @close="fecharModal" @save="salvarNovaColuna"></ModalAddColuna>
    <ModalAddTarefa :show="mostrarModalTarefa" @close="fecharModalTarefa" @save="salvarNovaTarefa"></ModalAddTarefa>
  </section>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed, nextTick } from 'vue'
import ModalAddColuna from '../../global/modalAddColuna/ModalAddColuna.vue'
import ModalAddTarefa from '../../global/modalAddTarefa/ModalAddTarefa.vue'
import { useKanbanStore } from '@/stores/useKanbanStore'
import Sortable from 'sortablejs' // ← IMPORTAÇÃO CORRETA

const kanbanStore = useKanbanStore()

// Refs para Sortable
const columnsWrapper = ref(null)
const columnsContainer = ref(null)
let columnSortable = null
const taskSortables = []

// Função para obter tasks por coluna
const tasksByColumn = (columnId) => {
  return kanbanStore.tasks.filter((task) => task.columnId === columnId)
}

// Classes de prioridade
const getPriorityClass = (priority) => {
  return {
    'priority-baixa': priority === 'baixa',
    'priority-media': priority === 'media',
    'priority-alta': priority === 'alta'
  }
}

// ============================================
// INICIALIZAÇÃO DO SORTABLE
// ============================================
const initializeSortable = async () => {
  await nextTick()

  // 1. SORTABLE PARA COLUNAS (arrastar colunas inteiras)
  if (columnsContainer.value && !columnSortable) {
    columnSortable = new Sortable(columnsContainer.value, {
      animation: 200,
      filter: '.kanban-tasks, .kanban-card, .coluna-titulo-input, .btn-excluir-coluna', // Ignora estes elementos
      preventOnFilter: false,
      ghostClass: 'coluna-ghost',
      chosenClass: 'coluna-chosen',
      dragClass: 'coluna-drag',
      direction: 'horizontal',

      onEnd(evt) {
        const columnId = Number(evt.item.dataset.columnId)
        const newIndex = evt.newIndex

        // Atualiza a ordem das colunas na store
        kanbanStore.reordenarColunas(columnId, newIndex)
      }
    })
  }

  // 2. SORTABLE PARA TASKS (arrastar cards entre colunas)
  const taskContainers = document.querySelectorAll('.kanban-tasks')

  // Limpa sortables antigos antes de criar novos
  taskSortables.forEach((sortable) => {
    if (sortable) sortable.destroy()
  })
  taskSortables.length = 0

  taskContainers.forEach((container) => {
    const sortable = new Sortable(container, {
      group: {
        name: 'kanban-tasks', // Permite mover entre colunas
        pull: true, // Pode remover items deste container
        put: true // Pode adicionar items neste container
      },
      animation: 150,
      ghostClass: 'task-ghost',
      chosenClass: 'task-chosen',
      dragClass: 'task-drag',
      fallbackOnBody: true,
      swapThreshold: 0.65,
      forceFallback: false,

      // Previne conflito com o drag da coluna
      filter: '.coluna-titulo-input, .btn-excluir-coluna',
      preventOnFilter: false,

      onStart(evt) {
        // Adiciona classe visual quando começa a arrastar
        evt.item.classList.add('task-dragging')
      },

      onEnd(evt) {
        evt.item.classList.remove('task-dragging')

        const taskId = Number(evt.item.dataset.taskId)
        const oldColumnId = Number(evt.from.dataset.columnId)
        const newColumnId = Number(evt.to.dataset.columnId)

        // Só atualiza se mudou de coluna
        if (oldColumnId !== newColumnId) {
          kanbanStore.moverTarefa(taskId, newColumnId)
          console.log(`Task ${taskId} movida da coluna ${oldColumnId} para ${newColumnId}`)
        }
      },

      // Callback quando o item está sobre uma nova coluna
      onChange(evt) {
        const newColumnId = Number(evt.to.dataset.columnId)
        evt.to.classList.add('coluna-drop-target')

        setTimeout(() => {
          evt.to.classList.remove('coluna-drop-target')
        }, 300)
      }
    })

    taskSortables.push(sortable)
  })
}

// ============================================
// MODAL COLUNA
// ============================================
const mostrarModal = computed(() => kanbanStore.modalAddColumnOpen)

const fecharModal = () => {
  kanbanStore.fecharModalAddColuna()
}

const salvarNovaColuna = async (dados) => {
  kanbanStore.adicionarColuna(dados)
  await nextTick()
  initializeSortable() // Reinicializa para incluir nova coluna
}

// ============================================
// MODAL TAREFA
// ============================================
const mostrarModalTarefa = computed(() => kanbanStore.modalAddTaskOpen)

const fecharModalTarefa = () => {
  kanbanStore.fecharModalAddTarefa()
}

const salvarNovaTarefa = async (dados) => {
  kanbanStore.adicionarTarefa(dados)
  await nextTick()
  initializeSortable() // Reinicializa para incluir nova task
}

// ============================================
// EDIÇÃO DE TÍTULOS
// ============================================
const handleTitleFocus = (coluna) => {
  coluna.tituloOriginal = coluna.title
}

const handleTitleBlur = (coluna) => {
  // Aqui você pode adicionar validação ou salvamento
}

// ============================================
// ESTILOS DAS COLUNAS
// ============================================
const getColorVar = (coluna) => {
  const explicit = coluna.color
  if (explicit) return explicit

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

// ============================================
// CONTROLE DE ROLAGEM
// ============================================
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

// ============================================
// LIFECYCLE
// ============================================
let resizeObserver = null

onMounted(() => {
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
  // Limpa Sortable das colunas
  if (columnSortable) {
    columnSortable.destroy()
  }

  // Limpa Sortable das tasks
  taskSortables.forEach((sortable) => sortable.destroy())

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
  min-width: 400px
  max-width: 400px
  background: linear-gradient(0deg, var(--cor-escuro-2) 10%, var(--cor-verde) 1000%)
  border-radius: 12px
  padding: 16px
  display: flex
  flex-direction: column
  border: 1px solid var(--cor-verde)
  transition: all 0.3s ease
  cursor: grab // Indica que pode arrastar a coluna

  &:active
    cursor: grabbing

  // Estados do Sortable para colunas
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

.coluna-titulo-input
  background: transparent
  border: none
  color: var(--cor-branco)
  font-family: var(--semibold)
  font-size: var(--f3)
  padding: 4px 8px
  border-radius: 4px
  width: 100%
  min-width: 0

  &:focus
    outline: 1px solid var(--cor-branco)
    background: rgba(255, 255, 255, 0.05)

.btn-excluir-coluna, .btn-excluir-task
  background: transparent
  border: none
  color: rgba(255, 255, 255, 0.5)
  cursor: pointer
  padding: 4px
  border-radius: 4px
  transition: all 0.2s ease
  margin-left: 8px

  &:hover
    color: var(--cor-vermelho)
    background: rgba(255, 68, 68, 0.1)

.icone-excluir
  width: 16px
  height: 16px
  fill: currentColor

.coluna-conteudo
  flex: 1
  min-height: 200px

.kanban-tasks
  min-height: 100px // Para facilitar drop em colunas vazias
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

  // Estados do Sortable para tasks
  &.task-ghost
    opacity: 0.4
    background: rgba(255, 255, 255, 0.1)
    border-style: dashed

  &.task-chosen
    transform: scale(1.02)
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.6)

  &.task-drag
    opacity: 1
    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.8)
    z-index: 1000

  &.task-dragging
    cursor: grabbing
    opacity: 0.9

  .title-delete
    display: flex
    justify-content: space-between
    align-items: center

    button
      margin: 0 0 5px

  h4
    margin: 0 0 6px 6px
    font-size: var(--f3)
    font-family: var(--semibold)
    color: var(--cor-branco)

  p
    margin: 0
    padding: 8px
    color: var(--cor-branco)
    font-family: var(--light)
    font-size: var(--f1)
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
      background: rgba(255,255,255,0.04)
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
