<template>
  <div v-if="show" class="modal-overlay" @click.self="onCancel">
    <div class="modal-container" @click.stop>
      <header class="modal-header">
        <h2>{{ title }}</h2>
      </header>

      <div class="modal-body">
        <div class="delete-content">
          <div class="delete-icon">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 9V11M12 15H12.01M5.07183 19H18.9282C20.4678 19 21.4301 17.3333 20.6603 16L13.7321 4C12.9623 2.66667 11.0377 2.66667 10.2679 4L3.33975 16C2.56995 17.3333 3.5322 19 5.07183 19Z" stroke="#ef4444" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </div>

          <!-- Título dinâmico baseado no tipo -->
          <h3 class="delete-title">{{ subtitle }}</h3>

          <!-- Mensagem dinâmica baseada no tipo -->
          <p class="delete-message">{{ message }}</p>
        </div>
      </div>

      <footer class="modal-footer">
        <button class="btn-cancel" @click="onCancel">Cancelar</button>
        <button class="btn-confirm" @click="onConfirm">Deletar</button>
      </footer>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits, computed } from 'vue'
import { useKanbanStore } from '../../../stores/useKanbanStore'

// ✅ CORREÇÃO: Chamar a store como função
const kanbanStore = useKanbanStore()

// props - agora recebendo item genérico e tipo
const props = defineProps({
  show: { type: Boolean, required: true },
  item: {
    type: Object,
    default: () => ({
      id: null,
      title: '',
      color: '',
      order: null
    })
  },
  type: {
    type: String,
    default: 'coluna', // 'coluna' ou 'tarefa'
    validator: (value) => ['coluna', 'tarefa'].includes(value)
  }
})

// emits
const emit = defineEmits(['close', 'confirm'])

const title = computed(() => {
  return props.type === 'tarefa' ? 'Excluir Tarefa' : 'Deletar Coluna'
})

const subtitle = computed(() => {
  const itemTitle = props.item?.title || 'Sem título'
  if (props.type === 'tarefa') {
    return `Deletar mesmo a tarefa "${itemTitle}"?`
  } else {
    return `Deletar mesmo a coluna "${itemTitle}"?`
  }
})

const message = computed(() => {
  if (props.type === 'tarefa') {
    return 'Essa ação não será desfeita e a tarefa será excluída permanentemente.'
  } else {
    return 'Essa ação não será desfeita e todas as tarefas atribuídas a essa coluna serão deletadas permanentemente.'
  }
})

const itemId = computed(() => {
  return props.item?.id || null
})

// ações do modal
const onCancel = () => {
  emit('close')
}

const onConfirm = () => {
  if (itemId.value) {
    if (props.type === 'tarefa') {
      kanbanStore.removerTarefa(itemId.value)
    } else {
      kanbanStore.removerColuna(itemId.value)
    }
    emit('confirm')
  }
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
  width: 500px
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
      color: #ef4444

  .modal-body
    margin-top: 24px
    text-align: center

    .delete-content
      display: flex
      flex-direction: column
      align-items: center
      gap: 16px

      .delete-icon
        margin-bottom: 8px

        svg
          filter: drop-shadow(0 4px 12px rgba(239, 68, 68, 0.3))

      .delete-title
        font-family: var(--semibold)
        font-size: var(--f3)
        color: rgba(255, 255, 255, 0.95)
        margin: 0
        line-height: 1.4

      .delete-message
        font-family: var(--light)
        font-size: var(--f2)
        color: rgba(255, 255, 255, 0.7)
        line-height: 1.6
        margin: 0
        max-width: 90%

  .modal-footer
    display: flex
    justify-content: flex-end
    gap: 12px
    margin-top: 32px
    padding-top: 24px
    border-top: 1px solid rgba(255, 255, 255, 0.1)

    .btn-cancel
      font-family: var(--semibold)
      background-color: var(--cor-escuro-2)
      color: var(--cor-branco)
      padding: 12px 24px
      border-radius: 12px
      cursor: pointer
      transition: all 0.3s
      border: solid 1px var(--cor-branco)
      font-size: var(--f2)
      min-width: 120px

      &:hover
        transform: scale(1.05)

      &:active
        transform: scale(0.98)


    .btn-confirm
      font-family: var(--semibold)
      background: linear-gradient(130deg, #7f1d1d 0%, #ef4444 120%)
      color: var(--cor-branco)
      padding: 12px 24px
      border-radius: 10px
      cursor: pointer
      transition: all 0.3s
      border: none
      font-size: var(--f2)
      min-width: 120px
      box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3)

      &:hover
        transform: scale(1.05)
        box-shadow: 0 6px 20px rgba(239, 68, 68, 0.4)

      &:active
        transform: scale(0.98)

// Responsividade
@media (max-width: 600px)
  .modal-container
    padding: 24px
    width: 90%

    .modal-footer
      flex-direction: column-reverse

      .btn-cancel,
      .btn-confirm
        width: 100%
        min-width: auto
</style>
