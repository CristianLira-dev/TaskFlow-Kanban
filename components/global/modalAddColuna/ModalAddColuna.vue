<template>
  <div v-if="show" class="modal-overlay" @click.self="onCancel">
    <div class="modal-container" @click.stop>
      <header class="modal-header">
        <h2>Adicionar Coluna</h2>
      </header>

      <div class="modal-body">
        <form class="form-config" @submit.prevent="onConfirm">
          <div class="inputs">
            <label>
              <span class="label">Nome da coluna</span>
              <input v-model="form.nome" type="text" placeholder="Ex: Em andamento" />
              <p class="errorMsg">{{ erros.nome }}</p>
            </label>

            <label>
              <span class="label">Cor</span>
              <div class="color-picker-container">
                <div class="color-preview" :style="{ backgroundColor: form.cor }" @click="showColorPicker = !showColorPicker">
                  <div class="color-preview-inner"></div>
                </div>
                <div class="color-input-group">
                  <input v-model="form.cor" type="text" class="color-hex-input" placeholder="#6d28d9" />
                  <input v-model="form.cor" type="color" class="color-input-native" />
                </div>

                <div v-show="showColorPicker" class="color-picker-popup" @click.stop>
                  <div class="color-palette">
                    <button v-for="color in colorPalette" :key="color" type="button" class="color-option" :style="{ backgroundColor: color }" :class="{ selected: form.cor === color }" @click="selectColor(color)">
                      <span v-if="form.cor === color" class="color-check">✓</span>
                    </button>
                  </div>
                  <div class="custom-color-section">
                    <span class="custom-color-label">Cor personalizada</span>
                    <input v-model="form.cor" type="color" class="custom-color-input" />
                  </div>
                </div>
              </div>
            </label>

            <label class="icon-picker-label">
              <span class="label">Ícone</span>
              <div class="icon-selector-container">
                <button type="button" class="icon-selector-btn" :class="{ 'has-icon': form.icon !== null }" @click.prevent="toggleIconPicker">
                  <div class="icon-preview">
                    <div v-if="form.icon !== null" class="icon-display">
                      <svg width="24" height="24" viewBox="0 0 24 24">
                        <rect x="2" y="2" width="20" height="20" :fill="form.cor" rx="4" />
                        <text x="12" y="16" font-size="10" text-anchor="middle" fill="#fff">{{ form.icon + 1 }}</text>
                      </svg>
                    </div>
                    <span v-else class="placeholder-icon">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <rect x="3" y="3" width="18" height="18" rx="4" stroke="currentColor" stroke-width="1.5" />
                        <path d="M12 8V16M8 12H16" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
                      </svg>
                    </span>
                  </div>

                  <span class="btn-label">
                    {{ form.icon !== null ? `Ícone ${form.icon + 1}` : 'Escolher ícone' }}
                  </span>
                  <span class="dropdown-arrow">▼</span>
                </button>
                <p class="errorMsg">{{ erros.icon }}</p>

                <div v-show="showIconPicker" class="icon-picker-modal" @click.stop>
                  <div class="icon-picker-header">
                    <h3>Selecione um ícone</h3>
                    <button type="button" class="close-picker-btn" @click="showIconPicker = false">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
                      </svg>
                    </button>
                  </div>

                  <div class="icon-search-container">
                    <input v-model="iconSearch" type="text" placeholder="Buscar ícones..." class="icon-search-input" />
                  </div>

                  <div class="icons-grid">
                    <button v-for="icon in filteredIcons" :key="icon.id" type="button" class="icon-option" :class="{ selected: form.icon === icon.id }" @click="selectIcon(icon.id)" :title="icon.label">
                      <Svgs :nome="icon.id" />
                      <span class="icon-label">{{ icon.label }}</span>
                    </button>
                  </div>

                  <div class="icon-picker-footer">
                    <button v-if="form.icon !== null" type="button" class="clear-icon-btn" @click="clearIcon">Remover ícone</button>
                    <button type="button" class="confirm-icon-btn" @click="showIconPicker = false">Confirmar</button>
                  </div>
                </div>
              </div>
            </label>
          </div>
        </form>
      </div>

      <footer class="modal-footer">
        <button class="btn-cancel" @click="onCancel">Cancelar</button>
        <button class="btn-confirm" @click="onConfirm">Confirmar</button>
      </footer>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, watch, computed } from 'vue'
import { kanbanIcons } from '../../pages/sistema/icons/kanbanIcons.js'

// props / emits
const props = defineProps({
  show: { type: Boolean, required: true }
})
const emit = defineEmits(['close', 'save'])

// state principal
const form = reactive({
  nome: '',
  cor: '#6d28d9',
  icon: null
})

// erros
const erros = reactive({
  nome: '',
  cor: '',
  icon: ''
})

// controles de UI
const showColorPicker = ref(false)
const showIconPicker = ref(false)
const iconSearch = ref('')

// paleta de cores
const colorPalette = ['#6d28d9', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#06b6d4', '#8b5cf6', '#f97316', '#14b8a6']

// ícones filtrados (usando kanbanIcons)
const filteredIcons = computed(() => {
  if (!iconSearch.value) return kanbanIcons

  const search = iconSearch.value.toLowerCase()
  return kanbanIcons.filter((icon) => icon.label.toLowerCase().includes(search))
})

// watchers
watch(
  () => props.show,
  (v) => {
    if (v) {
      form.nome = ''
      form.cor = '#6d28d9'
      form.icon = null
      erros.nome = ''
      erros.cor = ''
      erros.icon = ''
      showColorPicker.value = false
      showIconPicker.value = false
      iconSearch.value = ''
    }
  }
)

// actions
const toggleIconPicker = () => {
  showIconPicker.value = !showIconPicker.value
  if (showIconPicker.value) iconSearch.value = ''
}

const selectColor = (color) => {
  form.cor = color
  showColorPicker.value = false
}

const selectIcon = (id) => {
  form.icon = id
  erros.icon = ''
  showIconPicker.value = false
}

const clearIcon = () => {
  form.icon = null
}

// modal actions
const onCancel = () => {
  emit('close')
}

const onConfirm = () => {
  let temErro = false

  erros.nome = ''
  erros.icon = ''

  if (!form.nome.trim()) {
    erros.nome = 'O nome da coluna é obrigatório.'
    temErro = true
  }

  if (!form.icon) {
    erros.icon = 'Por favor, escolha um ícone.'
    temErro = true
  }

  if (temErro) return

  emit('save', {
    nome: form.nome.trim(),
    cor: form.cor,
    icon: form.icon
  })

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
      gap: 20px

      label
        display: flex
        flex-direction: column

        .errorMsg
          color: #ef4444
          font-family: var(--semibold)
          font-size: var(--f1)
          margin: 8px 0 0 4px

        .label
          font-family: var(--semibold)
          font-size: var(--f2)
          margin-bottom: 8px
          color: rgba(255, 255, 255, 0.9)

        input[type="text"]
          padding: 12px 16px
          border-radius: 10px
          border: 1px solid rgba(255, 255, 255, 0.1)
          background: rgba(255, 255, 255, 0.05)
          color: var(--cor-branco)
          font-size: 14px
          transition: all 0.2s ease

          &:focus
            outline: none
            border-color: rgba(109, 40, 217, 0.5)
            box-shadow: 0 0 0 3px rgba(109, 40, 217, 0.1)
            background: rgba(255, 255, 255, 0.08)

    .color-picker-container
      position: relative
      display: flex
      align-items: center
      gap: 12px

      .color-preview
        width: 44px
        height: 44px
        border-radius: 12px
        cursor: pointer
        display: flex
        align-items: center
        justify-content: center
        border: 2px solid rgba(255, 255, 255, 0.1)
        transition: all 0.2s ease
        overflow: hidden

        &:hover
          transform: scale(1.05)
          border-color: rgba(255, 255, 255, 0.2)

        .color-preview-inner
          width: 100%
          height: 100%

      .color-input-group
        flex: 1
        display: flex
        gap: 8px
        align-items: center

        .color-hex-input
          flex: 1
          padding: 10px 12px
          border-radius: 8px
          border: 1px solid rgba(255, 255, 255, 0.1)
          background: rgba(255, 255, 255, 0.05)
          color: var(--cor-branco)
          font-family: monospace
          font-size: 14px

          &:focus
            outline: none
            border-color: rgba(109, 40, 217, 0.5)

        .color-input-native
          width: 40px
          height: 40px
          border: none
          border-radius: 8px
          cursor: pointer
          background: transparent

          &::-webkit-color-swatch-wrapper
            padding: 0

          &::-webkit-color-swatch
            border: none
            border-radius: 6px
            border: 2px solid rgba(255, 255, 255, 0.1)

      .color-picker-popup
        position: absolute
        top: 56px
        left: 0
        right: 0
        background: var(--cor-escuro-1)
        border-radius: 12px
        padding: 16px
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.6)
        z-index: 1250
        border: 1px solid rgba(255, 255, 255, 0.1)

        .color-palette
          display: grid
          grid-template-columns: repeat(5, 1fr)
          gap: 10px
          margin-bottom: 16px

          .color-option
            width: 32px
            height: 32px
            border-radius: 8px
            border: 2px solid transparent
            cursor: pointer
            transition: all 0.2s ease
            display: flex
            align-items: center
            justify-content: center
            position: relative

            &:hover
              transform: scale(1.1)
              box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3)

            &.selected
              border-color: white
              box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.5)

            .color-check
              color: white
              font-size: 12px
              font-weight: bold
              text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5)

        .custom-color-section
          display: flex
          align-items: center
          justify-content: space-between
          padding-top: 12px
          border-top: 1px solid rgba(255, 255, 255, 0.1)

          .custom-color-label
            font-size: 12px
            color: rgba(255, 255, 255, 0.7)

          .custom-color-input
            width: 32px
            height: 32px
            border: none
            border-radius: 6px
            cursor: pointer
            background: transparent

            &::-webkit-color-swatch-wrapper
              padding: 0

            &::-webkit-color-swatch
              border: none
              border-radius: 6px
              border: 2px solid rgba(255, 255, 255, 0.2)

    .icon-picker-label
      .icon-selector-container
        position: relative

        .icon-selector-btn
          width: 100%
          display: flex
          align-items: center
          justify-content: space-between
          padding: 12px 16px
          border-radius: 10px
          border: 1px solid rgba(255, 255, 255, 0.1)
          background: rgba(255, 255, 255, 0.05)
          color: var(--cor-branco)
          cursor: pointer
          transition: all 0.2s ease

          &:hover
            background: rgba(255, 255, 255, 0.08)
            border-color: rgba(255, 255, 255, 0.2)

          &.has-icon
            border-color: rgba(109, 40, 217, 0.5)
            background: rgba(109, 40, 217, 0.1)

          .icon-preview
            display: flex
            align-items: center
            gap: 12px

            .icon-display
              display: flex
              align-items: center
              justify-content: center

            .placeholder-icon
              color: rgba(255, 255, 255, 0.5)

          .btn-label
            flex: 1
            text-align: left
            margin-left: 12px
            font-size: 14px

          .dropdown-arrow
            color: rgba(255, 255, 255, 0.5)
            font-size: 12px
            transition: transform 0.2s ease

        .icon-picker-modal
          position: absolute
          top: -300%
          left: 0
          right: 0
          background: var(--cor-escuro-1)
          border-radius: 12px
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.7)
          z-index: 1250
          border: 1px solid rgba(255, 255, 255, 0.1)
          overflow: hidden

          .icon-picker-header
            display: flex
            align-items: center
            justify-content: space-between
            padding: 16px
            border-bottom: 1px solid rgba(255, 255, 255, 0.1)

            h3
              margin: 0
              font-size: 14px
              font-family: var(--semibold)
              color: rgba(255, 255, 255, 0.9)

            .close-picker-btn
              background: none
              border: none
              color: rgba(255, 255, 255, 0.6)
              cursor: pointer
              padding: 4px
              border-radius: 4px

              &:hover
                background: rgba(255, 255, 255, 0.1)

          .icon-search-container
            padding: 12px 16px
            border-bottom: 1px solid rgba(255, 255, 255, 0.1)

            .icon-search-input
              width: 100%
              padding: 10px 12px
              border-radius: 8px
              border: 1px solid rgba(255, 255, 255, 0.1)
              background: rgba(255, 255, 255, 0.05)
              color: var(--cor-branco)
              font-size: 13px

              &:focus
                outline: none
                border-color: rgba(109, 40, 217, 0.5)

          .icons-grid
            padding: 16px
            display: grid
            grid-template-columns: repeat(5, 1fr)
            gap: 12px
            max-height: 300px
            overflow-y: auto

            .icon-option
              background: transparent
              border: 2px solid transparent
              border-radius: 10px
              padding: 12px
              cursor: pointer
              transition: all 0.2s ease

              &:hover
                background: rgba(255, 255, 255, 0.05)
                transform: translateY(-2px)

              &.selected
                border-color: rgba(109, 40, 217, 0.8)
                background: rgba(109, 40, 217, 0.15)

              .icon-option-content
                display: flex
                flex-direction: column
                align-items: center
                gap: 8px

                svg
                  width: 32px
                  height: 32px

                .icon-number
                  font-size: 11px
                  color: rgba(255, 255, 255, 0.7)

          .icon-picker-footer
            padding: 16px
            border-top: 1px solid rgba(255, 255, 255, 0.1)
            display: flex
            justify-content: space-between
            gap: 12px

            .clear-icon-btn
              padding: 8px 16px
              border-radius: 8px
              border: 1px solid rgba(239, 68, 68, 0.3)
              background: rgba(239, 68, 68, 0.1)
              color: #ef4444
              cursor: pointer
              font-size: 13px
              transition: all 0.2s ease

              &:hover
                background: rgba(239, 68, 68, 0.2)

            .confirm-icon-btn
              padding: 8px 20px
              border-radius: 8px
              border: none
              background: linear-gradient(135deg, #6d28d9, #8b5cf6)
              color: white
              cursor: pointer
              font-size: 13px
              font-family: var(--semibold)
              transition: all 0.2s ease

              &:hover
                transform: translateY(-1px)
                box-shadow: 0 4px 12px rgba(109, 40, 217, 0.4)

  .modal-footer
    display: flex
    justify-content: flex-end
    gap: 12px
    margin-top: 32px
    padding-top: 24px
    border-top: 1px solid rgba(255, 255, 255, 0.1)

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
