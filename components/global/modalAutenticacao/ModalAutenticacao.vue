<template>
  <transition name="fade">
    <div v-if="show" class="modal-overlay" @click.self="emitClose">
      <div class="modal">
        <Svgs nome="correto" />
        <h1 class="modal-message">{{ message }}</h1>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { watch, onBeforeUnmount } from 'vue'

const props = defineProps({
  show: {
    type: Boolean,
    required: true
  },
  title: {
    type: String,
    default: 'Aviso'
  },
  message: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['close'])

function emitClose() {
  emit('close')
}

let autoCloseTimer = null

watch(
  () => props.show,
  (val) => {
    if (val) {
      // fecha automaticamente após 5 segundos
      autoCloseTimer = setTimeout(() => {
        emit('close')
      }, 5000)
    } else {
      if (autoCloseTimer) {
        clearTimeout(autoCloseTimer)
        autoCloseTimer = null
      }
    }
  }
)

onBeforeUnmount(() => {
  if (autoCloseTimer) clearTimeout(autoCloseTimer)
})
</script>

<style scoped lang="sass">
.modal-overlay
  position: fixed
  top: 3%
  display: flex
  align-items: center
  justify-content: center
  z-index: 9999

.modal
  display: flex
  align-items: center
  justify-content: center
  gap: 20px
  background: linear-gradient(130deg, var(--cor-verde-escuro-3) 0%, var(--cor-verde) 120%)
  padding: 24px
  border-radius: 16px
  max-width: 1000px
  width: 100%
  text-align: center

  svg
    width: 30px
    height: 30px

  &-message
    font-family: var(--semibold)
    color: var(--cor-branco)
    font-size: var(--f2)
/* animação */
.fade-enter-active,
.fade-leave-active
  transition: opacity 0.3s ease

.fade-enter-from,
.fade-leave-to
  opacity: 0
</style>
