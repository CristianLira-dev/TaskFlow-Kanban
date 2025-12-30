<template>
  <div v-if="show" class="modal-overlay">
    <ModalAutenticacao :show="modalAberto" :title="tituloModal" :message="mensagemModal" @close="modalAberto = false" />
    <div class="modal-container" @click.stop>
      <header class="modal-header">
        <h2>Configuração de perfil</h2>
      </header>

      <div class="modal-body">
        <form class="form-config" @submit.prevent="onConfirm">
          <div class="inputs">
            <label>
              <span class="label">Nome</span>
              <input v-model="form.nome" type="text" />
              <p class="errorMsg">{{ errosData.nome }}</p>
            </label>

            <label>
              <span class="label">Email</span>
              <input v-model="form.email" type="text" />
              <p class="errorMsg">{{ errosData.email }}</p>
            </label>
          </div>

          <div class="avatar-preview">
            <img :src="usuario?.avatar" :alt="usuario?.nome" @click="showLightbox = true" />
          </div>
        </form>
      </div>

      <footer class="modal-footer">
        <button class="btn-cancel" @click="onCancel">Cancelar</button>
        <button class="btn-confirm" @click="onConfirm">Confirmar</button>
      </footer>
    </div>

    <!-- Lightbox: exibido por cima do modal quando o usuário clica na imagem -->
    <div v-if="showLightbox" class="lightbox-overlay" @click="showLightbox = false">
      <button class="lightbox-close" @click.stop="showLightbox = false">✕</button>
      <div class="lightbox-content" @click.stop="showLightbox = false">
        <img :src="usuario?.avatar" :alt="usuario?.nome" @click.stop="showLightbox = true" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, watch, ref } from 'vue'
import ModalAutenticacao from '../global/modalAutenticacao/ModalAutenticacao.vue'

const props = defineProps({
  show: { type: Boolean, required: true },
  usuario: { type: Object, required: false }
})

const emit = defineEmits(['close', 'save'])
const form = reactive({ nome: '', email: '' })

const modalAberto = ref(false)
const mensagemModal = ref('')

watch(
  () => props.show,
  (val) => {
    if (val) {
      form.nome = props.usuario?.nome ?? ''
      form.email = props.usuario?.email ?? ''
    }
  }
)

const errosData = reactive({
  nome: '',
  email: ''
})

const onCancel = () => {
  errosData.nome = ''
  errosData.email = ''
  emit('close')
}

const onConfirm = () => {
  const emailRegex = /^(?!.*\.\.)[a-zA-Z0-9._%+-]+@[a-zA-Z0-9-]+\.[a-zA-Z]{2,}$/
  let temErro = false

  if (!form.nome) {
    errosData.nome = 'O nome é obrigatório.'
    temErro = true
  } else if (form.nome.indexOf(' ') === -1) {
    errosData.nome = 'Por favor, insira seu nome completo.'
    temErro = true
  } else {
    errosData.nome = ''
  }

  if (!form.email) {
    errosData.email = 'O email é obrigatório.'
    temErro = true
  } else if (!emailRegex.test(form.email)) {
    errosData.email = 'Por favor, insira um email válido.'
    temErro = true
  } else {
    errosData.email = ''
  }

  if (temErro) return

  emit('save', { nome: form.nome.trim(), email: form.email.trim() })
  emit('close')
}

// lightbox state and overlay handler
const showLightbox = ref(false)

const overlayClick = () => {
  if (showLightbox.value) {
    showLightbox.value = false
    return
  }
  onCancel()
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

.modal-container
  width: 700px
  max-width: calc(100% - 40px)
  background: var(--cor-escuro-2)
  border-radius: 12px
  padding: 18px
  box-shadow: 0 10px 30px rgba(0,0,0,0.6)
  color: var(--cor-branco)

  .modal-header
    h2
      margin: 0
      font-family: var(--semibold)
      font-size: var(--f4)

  .modal-body
    display: flex
    gap: 20px
    margin-top: 20px

    .form-config
      display: flex
      flex: 1

    .inputs
      display: flex
      flex-direction: column
      gap: 12px
      flex: 1

      label
        display: flex
        flex-direction: column

        .errorMsg
          font-family: var(--light)
          color: var(--cor-vermelho)
          font-size: var(--f1)
          margin: 5px 0 0 5px

        .label
          font-family: var(--semibold)
          font-size: var(--f1)
          margin-bottom: 6px

        input
          padding: 12px
          border-radius: 8px
          border: 1px solid var(--cor-escuro-5)
          background: transparent
          color: var(--cor-branco)
          font-family: var(--light)

    .avatar-preview
      width: 160px
      display: flex
      align-items: center
      justify-content: flex-end

      img
        width: 150px
        height: 150px
        border-radius: 50%
        object-fit: cover
        cursor: pointer

  .modal-footer
    display: flex
    justify-content: flex-end
    gap: 12px
    margin-top: 16px

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

/* Lightbox styles */
.lightbox-overlay
  position: fixed
  inset: 0
  display: flex
  align-items: center
  justify-content: center
  background: rgba(0,0,0,0.88)
  z-index: 1300

.lightbox-close
  position: absolute
  top: 18px
  right: 18px
  background: transparent
  border: none
  color: #fff
  font-size: 26px
  cursor: pointer
  z-index: 1310

.lightbox-content
  max-width: 96%
  max-height: 92%
  display: flex
  align-items: center
  justify-content: center

  img
    max-width: 40%
    max-height: 40%
    object-fit: contain
</style>
