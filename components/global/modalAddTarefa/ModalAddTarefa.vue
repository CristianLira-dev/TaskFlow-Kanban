<template>
  <div v-if="show" class="modal-overlay" @click.self="onCancel">
    <div class="modal-container" @click.stop>
      <header class="modal-header">
        <h2>Adicionar Tarefa</h2>
      </header>

      <div class="modal-body">
        <form class="form-config" @submit.prevent="onConfirm">
          <div class="inputs">
            <label>
              <span class="label">Título da tarefa</span>
              <input v-model="form.titulo" type="text" placeholder="Ex: Corrigir bug" />
              <p class="errorMsg">{{ erros.titulo }}</p>
            </label>

            <label>
              <span class="label">Descrição</span>
              <input type="text" v-model="form.descricao" rows="4" placeholder="Descrição da tarefa"></input>
              <p class="errorMsg">{{ erros.descricao }}</p>
            </label>

            <div class="inputs-coluna-prioridade">
              <!-- Dropdown personalizado para Coluna -->
              <div class="dropdown-wrapper">
                <span class="label">Coluna</span>
                <button
                  type="button"
                  class="dropdown-toggle"
                  :class="{ 'dropdown-active': showColumnDropdown }"
                  @click="toggleColumnDropdown"
                >
                  {{ columnLabel }}
                </button>
                <div v-if="showColumnDropdown" class="dropdown-menu">
                  <button
                    type="button"
                    v-for="col in kanbanStore.columns"
                    :key="col.id"
                    class="dropdown-item"
                    @click="selectColumn(col.id, col.title)"
                  >
                    {{ col.title }}
                  </button>
                </div>
                <p class="errorMsg">{{ erros.colunaId }}</p>
              </div>

              <!-- Dropdown personalizado para Prioridade -->
              <div class="dropdown-wrapper">
                <span class="label">Prioridade</span>
                <button
                  type="button"
                  class="dropdown-toggle"
                  :class="{ 'dropdown-active': showPriorityDropdown }"
                  @click="togglePriorityDropdown"
                >
                  {{ priorityLabel }}
                </button>
                <div v-if="showPriorityDropdown" class="dropdown-menu">
                  <button
                    type="button"
                    v-for="priority in priorities"
                    :key="priority.value"
                    class="dropdown-item"
                    @click="selectPriority(priority.value, priority.label)"
                  >
                    {{ priority.label }}
                  </button>
                </div>
                <p class="errorMsg">{{ erros.priority }}</p>
              </div>
            </div>
          </div>
        </form>
      </div>

      <footer class="modal-footer">
        <button class="btn-cancel" @click="onCancel">Cancelar</button>
        <button class="btn-confirm" @click="onConfirm">Adicionar</button>
      </footer>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, watch } from 'vue'
import { useKanbanStore } from '@/stores/useKanbanStore'

const props = defineProps({ show: { type: Boolean, required: true } })
const emit = defineEmits(['close', 'save'])

const kanbanStore = useKanbanStore()

// Estados para controlar a visibilidade dos dropdowns
const showColumnDropdown = ref(false)
const showPriorityDropdown = ref(false)

// Opções de prioridade
const priorities = [
  { value: 'baixa', label: 'Baixa' },
  { value: 'media', label: 'Média' },
  { value: 'alta', label: 'Alta' }
]

// Labels para os botões
const columnLabel = ref('Selecione uma das Opções')
const priorityLabel = ref('Selecione uma das Opções')

const form = reactive({
  titulo: '',
  descricao: '',
  colunaId: null,
  priority: null
})

const erros = reactive({ titulo: '', descricao: '', colunaId: '', priority: '' })

// Fecha dropdowns quando clicar fora
const closeAllDropdowns = () => {
  showColumnDropdown.value = false
  showPriorityDropdown.value = false
}

// Toggle para dropdown de coluna
const toggleColumnDropdown = () => {
  showColumnDropdown.value = !showColumnDropdown.value
  if (showColumnDropdown.value) {
    showPriorityDropdown.value = false
  }
}

// Toggle para dropdown de prioridade
const togglePriorityDropdown = () => {
  showPriorityDropdown.value = !showPriorityDropdown.value
  if (showPriorityDropdown.value) {
    showColumnDropdown.value = false
  }
}

// Selecionar coluna
const selectColumn = (colunaId, colunaTitle) => {
  form.colunaId = colunaId
  columnLabel.value = colunaTitle
  showColumnDropdown.value = false
}

// Selecionar prioridade
const selectPriority = (priorityValue, priorityText) => {
  form.priority = priorityValue
  priorityLabel.value = priorityText
  showPriorityDropdown.value = false
}

// Quando o modal abre
watch(
  () => props.show,
  (v) => {
    if (v) {
      form.titulo = ''
      form.descricao = ''
      form.colunaId = null
      form.priority = null
      columnLabel.value = 'Selecione uma das Opções'
      priorityLabel.value = 'Selecione uma das Opções'
      erros.titulo = ''
      erros.descricao = ''
      erros.colunaId = ''
      erros.priority = ''
      closeAllDropdowns()
    }
  }
)

const onCancel = () => {
  closeAllDropdowns()
  emit('close')
}

const onConfirm = () => {
  let temErro = false
  erros.titulo = ''
  erros.colunaId = ''
  erros.priority = ''

  if (!form.titulo.trim()) {
    erros.titulo = 'O título é obrigatório.'
    temErro = true
  }

  if (!form.colunaId) {
    erros.colunaId = 'Selecione uma coluna.'
    temErro = true
  }

  if (!form.priority) {
    erros.priority = 'Selecione uma prioridade.'
    temErro = true
  }

  if (temErro) return

  emit('save', {
    title: form.titulo.trim(),
    description: form.descricao.trim(),
    priority: form.priority,
    columnId: form.colunaId
  })

  closeAllDropdowns()
  emit('close')
}
</script>

<style lang="sass" scoped>
.modal-overlay
  position: fixed
  inset: 0
  background: rgba(0,0,0,0.6)
  display: flex
  align-items: center
  justify-content: center
  z-index: 1200
  backdrop-filter: blur(4px)

.modal-container
  width: 560px
  max-width: calc(100% - 32px)
  background: var(--cor-escuro-2)
  border-radius: 16px
  padding: 32px
  color: var(--cor-branco)
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5)
  border: 1px solid rgba(255, 255, 255, 0.1)

  .modal-header
    h2
      margin: 0
      font-family: var(--semibold)
      font-size: var(--f4)
      border-bottom: 1px solid rgba(255, 255, 255, 0.1)
      padding-bottom: 16px

  .modal-body
    margin-top: 24px

    .form-config
      display: flex
      flex-direction: column

    .inputs
      font-family: var(--light)
      display: flex
      flex-direction: column
      gap: 16px

      .inputs-coluna-prioridade
        display: flex
        align-items: flex-start
        justify-content: space-between
        gap: 20px

        @media (max-width: 480px)
          flex-direction: column
          gap: 16px

      label
        display: flex
        flex-direction: column

        .errorMsg
          color: var(--cor-vermelho)
          font-family: var(--semibold)
          font-size: var(--f1)
          margin: 8px 0 0 4px

        .label
          font-family: var(--semibold)
          font-size: var(--f2)
          margin-bottom: 8px
          color: rgba(255, 255, 255, 0.9)

        input
          padding: 10px 12px
          border-radius: 8px
          border: 1px solid rgba(255, 255, 255, 0.08)
          background: rgba(255, 255, 255, 0.03)
          color: var(--cor-branco)
          font-size: 14px

          &:focus
            outline: none
            border-color: rgba(109, 40, 217, 0.5)
            box-shadow: 0 0 0 3px rgba(109, 40, 217, 0.06)

      .dropdown-wrapper
        flex: 1
        position: relative
        display: flex
        flex-direction: column

        .label
          font-family: var(--semibold)
          font-size: var(--f2)
          margin-bottom: 8px
          color: rgba(255, 255, 255, 0.9)

        .dropdown-toggle
          padding: 10px 20px
          border-radius: 8px
          border: 1px solid rgba(255, 255, 255, 0.08)
          background: rgba(255, 255, 255, 0.03)
          color: var(--cor-branco)
          font-size: 14px
          text-align: left
          cursor: pointer
          transition: all 0.3s
          position: relative
          font-family: inherit

          &::after
            content: 'V'
            position: absolute
            right: 15px
            top: 50%
            transform: translateY(-50%)
            font-size: 10px
            opacity: 0.7
            transition: transform 0.3s

          &.dropdown-active
            border-color: rgba(109, 40, 217, 0.5)
            box-shadow: 0 0 0 3px rgba(109, 40, 217, 0.06)

            &::after
              transform: translateY(-50%) rotate(180deg)

          &:hover
            border-color: rgba(255, 255, 255, 0.2)
            background: rgba(255, 255, 255, 0.05)

        .dropdown-menu
          position: absolute
          top: 100%
          left: 0
          right: 0
          margin-top: 4px
          background: var(--cor-escuro-2)
          border: 1px solid rgba(255, 255, 255, 0.08)
          border-radius: 8px
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3)
          z-index: 100
          overflow: hidden
          max-height: 200px
          overflow-y: auto

          .dropdown-item
            width: 100%
            padding: 12px 20px
            text-align: left
            background: transparent
            border: none
            color: var(--cor-branco)
            font-size: 14px
            cursor: pointer
            transition: all 0.2s
            font-family: inherit

            &:hover
              background: rgba(255, 255, 255, 0.05)
              color: var(--cor-roxo-claro)

            &:not(:last-child)
              border-bottom: 1px solid rgba(255, 255, 255, 0.05)

        .errorMsg
          color: var(--cor-vermelho)
          font-family: var(--semibold)
          font-size: var(--f1)
          margin: 8px 0 0 4px

.modal-footer
  display: flex
  justify-content: flex-end
  gap: 12px
  margin-top: 24px
  padding-top: 12px
  border-top: 1px solid rgba(255, 255, 255, 0.06)

  .btn-cancel
    font-family: var(--semibold)
    background: transparent
    border: 1px solid rgba(255,255,255,0.08)
    color: var(--cor-branco)
    padding: 8px 14px
    border-radius: 8px
    cursor: pointer
    transition: all 0.3s

    &:hover
      background-color: var(--cor-vermelho)
      transform: scale(1.03)

  .btn-confirm
    font-family: var(--semibold)
    background: linear-gradient(130deg, var(--cor-verde-escuro-3) 0%, var(--cor-verde) 120%)
    color: var(--cor-branco)
    padding: 8px 14px
    border-radius: 8px
    cursor: pointer
    transition: all 0.3s

    &:hover
      transform: scale(1.04)
</style>
