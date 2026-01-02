<template>
  <section class="colunas-container">
    <div class="colunas-wrapper" ref="columnsWrapper">
      <div class="colunas" ref="columnsContainer">
        <!-- Colunas existentes -->
        <div v-for="column in kanbanStore.columns" :key="column.id" class="coluna" :style="colunaStyle(column)">
          <div class="coluna-cabecalho">
            <div class="coluna-titulo-wrapper">
              <input v-model="column.title" type="text" class="coluna-titulo-input" @focus="handleTitleFocus(column)" @blur="handleTitleBlur(column)" @keyup.enter="$event.target.blur()" />
            </div>
            <button class="btn-excluir-coluna" @click="kanbanStore.removerColuna(column.id)" title="Excluir coluna" v-if="kanbanStore.columns.length > 1">
              <Svgs nome="lixeira" class="icone-excluir" />
            </button>
          </div>

          <div class="coluna-conteudo">
            <!-- Aqui você pode adicionar conteúdo personalizado -->
            <div v-if="kanbanStore.tasks.length < 1" class="coluna-vazia">
              <p>Adicione Tarefas a esta coluna</p>
            </div>

            <div class="kanban-tasks">
              <div class="kanban-card" v-for="task in tasksByColumn(column.id).value" :key="task.id">
                <h4>{{ task.title }}</h4>
                <p v-if="task.description">{{ task.description }}</p>
                <div class="prioridade-data">
                  <span :class="['priority', { 'priority-baixa': task.priority === 'baixa', 'priority-alta': task.priority === 'alta', 'priority-media': task.priority === 'media' }]">Prioridade: {{ task.priority }}</span>
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
import { ref, onMounted, onUnmounted, computed } from 'vue'
import ModalAddColuna from '../../global/modalAddColuna/ModalAddColuna.vue'
import ModalAddTarefa from '../../global/modalAddTarefa/ModalAddTarefa.vue'
import { useKanbanStore } from '@/stores/useKanbanStore'

const kanbanStore = useKanbanStore()

const tasksByColumn = (columnId) => {
  return computed(() => kanbanStore.tasks.filter((task) => task.columnId === columnId))
}

// refs de scroll
const columnsWrapper = ref(null)
const columnsContainer = ref(null)

// modal
const mostrarModal = computed(() => kanbanStore.modalAddColumnOpen)

const fecharModal = () => {
  kanbanStore.fecharModalAddColuna()
}

const salvarNovaColuna = (dados) => {
  kanbanStore.adicionarColuna(dados)
}

// Modal de tarefa
const mostrarModalTarefa = computed(() => kanbanStore.modalAddTaskOpen)

const fecharModalTarefa = () => {
  kanbanStore.fecharModalAddTarefa()
}

const salvarNovaTarefa = (dados) => {
  kanbanStore.adicionarTarefa(dados)
}

// Estado da rolagem
const podeRolarEsquerda = ref(false)
const podeRolarDireita = ref(false)
const mostrarIndicadoresRolagem = ref(false)

// Edição de títulos
const handleTitleFocus = (coluna) => {
  coluna.tituloOriginal = coluna.title
}

// Priority styling is handled via class binding in the template (no DOM access needed)

// Define a variável CSS/valor para cada coluna; prioriza cor personalizada
const getColorVar = (coluna) => {
  const explicit = coluna.color || coluna.colorVar
  if (explicit) return explicit

  const title = (coluna.title || '').toLowerCase()
  if (title.includes('fazer')) return '--cor-azul-claro'
  if (title.includes('fazendo')) return '--cor-amarelo'
  if (title.includes('feito')) return '--cor-verde'
  return '--cor-verde'
}

// Retorna um objeto de estilo inline para a coluna
const colunaStyle = (coluna) => {
  const colorValue = getColorVar(coluna) || '--cor-verde'
  const resolved = typeof colorValue === 'string' && colorValue.startsWith('--') ? `var(${colorValue})` : colorValue
  return {
    background: `linear-gradient(0deg, var(--cor-escuro-2) 10%, ${resolved} 1000%)`,
    borderColor: resolved
  }
}

// Controle de rolagem
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

// Observar mudanças no tamanho
let resizeObserver = null

onMounted(() => {
  verificarRolagem()

  if (columnsWrapper.value) {
    columnsWrapper.value.addEventListener('scroll', verificarRolagem)
  }

  // Observar mudanças de tamanho
  resizeObserver = new ResizeObserver(verificarRolagem)
  if (columnsWrapper.value) {
    resizeObserver.observe(columnsWrapper.value)
  }
  if (columnsContainer.value) {
    resizeObserver.observe(columnsContainer.value)
  }

  // Observar mudanças na janela
  window.addEventListener('resize', verificarRolagem)
})

onUnmounted(() => {
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
  cursor: move

  &.arrastando-sobre
    background: rgba(var(--cor-verde-rgb, 76, 175, 80), 0.1)
    border-color: var(--cor-verde)

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

.btn-excluir-coluna
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
      background-color:  rgba(255, 255, 255, 0.03)

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

// Responsividade
@media (max-width: 768px)
  .coluna
    min-width: 260px
    max-width: 260px

  .adicionar-coluna-container
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

  .adicionar-coluna-container
    min-width: 240px
    max-width: 240px
</style>
