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

// props / emits
const props = defineProps({
  show: { type: Boolean, required: true }
})
const emit = defineEmits(['close', 'save'])

// state principal
const form = reactive({
  nome: '',
  cor: '#6d28d9'
})

// erros
const erros = reactive({
  nome: '',
  cor: ''
})

// controles de UI
const showColorPicker = ref(false)
const showIconPicker = ref(false)

// paleta de cores
const colorPalette = ['#6d28d9', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#06b6d4', '#8b5cf6', '#f97316', '#14b8a6']

// watchers
watch(
  () => props.show,
  (v) => {
    if (v) {
      form.nome = ''
      form.cor = '#6d28d9'
      erros.nome = ''
      erros.cor = ''
      showColorPicker.value = false
    }
  }
)

const selectColor = (color) => {
  form.cor = color
  showColorPicker.value = false
}

// modal actions
const onCancel = () => {
  emit('close')
}

const onConfirm = () => {
  let temErro = false

  erros.nome = ''

  if (!form.nome.trim()) {
    erros.nome = 'O nome da coluna é obrigatório.'
    temErro = true
  }

  if (temErro) return

  emit('save', {
    nome: form.nome.trim(),
    cor: form.cor
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

          .btn-label
            flex: 1
            text-align: left
            margin-left: 12px
            font-size: 14px

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
