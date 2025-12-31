<template>
  <section class="colunas-container">
    <div class="colunas-wrapper" ref="columnsWrapper">
      <div class="colunas" ref="columnsContainer">
        <!-- Colunas existentes -->
        <div v-for="column in kanbanStore.columns" :key="column.id" class="coluna" :class="{ 'arrastando-sobre': column.id === dragOverColumn }" @dragover.prevent="handleDragOver(column.id)" @dragleave="handleDragLeave" @drop="handleDrop(column.id)">
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
            <div class="coluna-vazia">
              <p>Adicione Tarefas a esta coluna</p>
            </div>
          </div>
        </div>

        <!-- Botão para adicionar nova coluna moved to SectionButtons -->
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
  </section>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import ModalAddColuna from '../../global/modalAddColuna/ModalAddColuna.vue'
import { useKanbanStore } from '@/stores/useKanbanStore'

const kanbanStore = useKanbanStore()

// Dados das colunas
const columns = ref([
  { id: 1, title: 'A Fazer' },
  { id: 2, title: 'Fazendo' },
  { id: 3, title: 'Feito' }
])

// Referências do DOM
const columnsWrapper = ref(null)
const columnsContainer = ref(null)

// Estado do drag & drop
const draggedColumn = ref(null)
const dragOverColumn = ref(null)

// Estado da rolagem
const podeRolarEsquerda = ref(false)
const podeRolarDireita = ref(false)
const mostrarIndicadoresRolagem = ref(false)

// Gerenciamento de colunas
let proximoIdColuna = 4

const adicionarNovaColuna = () => {
  const novaColuna = {
    id: proximoIdColuna++,
    title: 'Teste'
  }
  columns.value.push(novaColuna)

  // Focar no título da nova coluna após renderização
  nextTick(() => {
    const ultimaColuna = document.querySelectorAll('.coluna-titulo-input')[columns.value.length - 1]
    if (ultimaColuna) ultimaColuna.focus()
  })
}

// expose function to parent so external components can add columns
defineExpose({ adicionarNovaColuna })

const excluirColuna = (colunaId) => {
  const index = columns.value.findIndex((col) => col.id === colunaId)
  if (index !== -1) {
    columns.value.splice(index, 1)
  }
}

// Drag & Drop para reordenar colunas
const handleDragStart = (colunaId) => {
  draggedColumn.value = colunaId
}

const handleDragOver = (colunaId) => {
  if (draggedColumn.value !== colunaId) {
    dragOverColumn.value = colunaId
  }
}

const handleDragLeave = () => {
  dragOverColumn.value = null
}

const handleDragEnd = () => {
  dragOverColumn.value = null
  draggedColumn.value = null
}

const handleDrop = (paraColunaId) => {
  if (!draggedColumn.value || draggedColumn.value === paraColunaId) return

  const deIndex = columns.value.findIndex((col) => col.id === draggedColumn.value)
  const paraIndex = columns.value.findIndex((col) => col.id === paraColunaId)

  if (deIndex !== -1 && paraIndex !== -1) {
    const [colunaMovida] = columns.value.splice(deIndex, 1)
    columns.value.splice(paraIndex, 0, colunaMovida)
  }

  dragOverColumn.value = null
}

// Edição de títulos
const handleTitleFocus = (coluna) => {
  coluna.tituloOriginal = coluna.title
}

const handleTitleBlur = (coluna) => {
  if (!coluna.title.trim()) {
    coluna.title = coluna.tituloOriginal || 'Nova Coluna'
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
  min-width: 280px
  max-width: 280px
  background: linear-gradient(0deg, var(--cor-escuro-2) 10%, var(--cor-verde) 500%)
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
    outline: 2px solid var(--cor-verde)
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
    color: #ff4444
    background: rgba(255, 68, 68, 0.1)

.icone-excluir
  width: 16px
  height: 16px
  fill: currentColor

.coluna-conteudo
  flex: 1
  min-height: 200px
  display: flex
  align-items: center
  justify-content: center

.coluna-vazia
  text-align: center
  color: rgba(255, 255, 255, 0.3)
  font-family: var(--light)
  font-size: var(--f1)
  padding: 20px

.adicionar-coluna-container
  min-width: 280px
  max-width: 280px
  display: flex
  align-items: flex-start
  padding-top: 16px

.btn-adicionar-coluna
  display: flex
  align-items: center
  justify-content: center
  gap: 12px
  width: 100%
  padding: 20px
  background: rgba(255, 255, 255, 0.05)
  border: 2px dashed rgba(255, 255, 255, 0.2)
  border-radius: 12px
  color: rgba(255, 255, 255, 0.7)
  cursor: pointer
  transition: all 0.3s ease
  font-family: var(--semibold)
  font-size: var(--f2)

  &:hover
    background: rgba(var(--cor-verde-rgb, 76, 175, 80), 0.1)
    border-color: var(--cor-verde)
    color: var(--cor-verde)

    .icone-adicionar-coluna
      fill: var(--cor-verde)

.icone-adicionar-coluna
  width: 20px
  height: 20px
  fill: rgba(255, 255, 255, 0.7)
  transition: fill 0.3s ease

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
