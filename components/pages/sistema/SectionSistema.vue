<template>
  <section :class="['sistema-page', { 'coluna-recolhida': isCollapsed }]">
    <!-- Sidebar unificada -->
    <SidebarSistema :is-collapsed="isCollapsed" :selected-perfil="selectedPerfil" :usuario="usuario" @toggle-coluna="toggleColuna" @select-perfil="selectPerfil" @open-settings="modalSettingsOpen = true" />

    <div class="page-tarefas">
      <slot class="section-tarefas">
        <SectionTarefas v-if="selectedPerfil === 'tarefas'" />
      </slot>
    </div>

    <ModalSettings :show="modalSettingsOpen" :usuario="usuario" @close="modalSettingsOpen = false" @save="onSaveSettings" />
    <ModalAutenticacao class="modalSucessSettings" :show="modalAutenticacaoOpen" :title="tituloModal" :message="mensagemModal" @close="modalAutenticacaoOpen = false" />
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import ModalSettings from '../../modalSettings/ModalSettings.vue'
import SectionTarefas from './SectionTarefas.vue'
import SidebarSistema from './SidebarSistema.vue'

const isCollapsed = ref(false)

// Perfil selecionado ('tarefas' | 'ocultas')
const selectedPerfil = ref('tarefas')

const STORAGE_USERS_KEY = 'taskflow-users'
const STORAGE_SESSION_KEY = 'taskflow-session'
const STORAGE_CURRENT_USER_KEY = 'taskflow-current-user'

const getUsers = () => {
  if (!process.client) return []

  try {
    return JSON.parse(localStorage.getItem(STORAGE_USERS_KEY) || '[]')
  } catch {
    return []
  }
}

const getSession = () => {
  if (!process.client) return null

  try {
    return JSON.parse(sessionStorage.getItem(STORAGE_SESSION_KEY) || 'null')
  } catch {
    return null
  }
}

const getProfileByEmail = (email) => {
  if (!process.client || !email) return null

  try {
    return JSON.parse(localStorage.getItem(`taskflow-user-profile:${email.toLowerCase()}`) || 'null')
  } catch {
    return null
  }
}

const saveProfileByEmail = (email, profile) => {
  if (!process.client || !email) return
  localStorage.setItem(`taskflow-user-profile:${email.toLowerCase()}`, JSON.stringify(profile))
}

const usuario = ref({
  nome: 'Cristian Albertino de Lira',
  email: 'cristianfilho@email.com',
  avatar: '/images/dog.jpg'
})

const toggleColuna = () => {
  isCollapsed.value = !isCollapsed.value
}

const selectPerfil = (nome) => {
  selectedPerfil.value = nome
}

const modalSettingsOpen = ref(false)

// estado do modal de sucesso (ModalAutenticacao)
const modalAutenticacaoOpen = ref(false)
const mensagemModal = ref('')
const tituloModal = ref('Sucesso')

const onSaveSettings = (dados) => {
  const emailAtual = usuario.value.email.toLowerCase()
  const novoEmail = dados.email.toLowerCase()
  const users = getUsers()

  const emailConflitante = users.some((user) => user.email === novoEmail && user.email !== emailAtual)

  if (emailConflitante) {
    mensagemModal.value = 'Este e-mail já está em uso por outra conta.'
    tituloModal.value = 'Atenção'
    modalAutenticacaoOpen.value = true
    return
  }

  const profileAtualizado = {
    ...usuario.value,
    nome: dados.nome,
    email: novoEmail
  }

  usuario.value = profileAtualizado

  const userIndex = users.findIndex((user) => user.email === emailAtual)
  if (userIndex !== -1) {
    users[userIndex] = {
      ...users[userIndex],
      nome: dados.nome,
      email: novoEmail
    }
    localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(users))
  }

  saveProfileByEmail(novoEmail, profileAtualizado)
  if (novoEmail !== emailAtual) {
    localStorage.removeItem(`taskflow-user-profile:${emailAtual}`)
  }

  sessionStorage.setItem(
    STORAGE_SESSION_KEY,
    JSON.stringify({
      email: novoEmail,
      loggedAt: new Date().toISOString()
    })
  )
  localStorage.setItem(STORAGE_CURRENT_USER_KEY, novoEmail)

  modalSettingsOpen.value = false

  // abrir modal de sucesso
  tituloModal.value = 'Sucesso'
  mensagemModal.value = 'Configurações salvas com sucesso!'
  modalAutenticacaoOpen.value = true
}

onMounted(() => {
  const sessao = getSession()
  const fallbackEmail = process.client ? localStorage.getItem(STORAGE_CURRENT_USER_KEY) : null
  const emailUsuario = (sessao?.email || fallbackEmail || '').toLowerCase()

  if (!emailUsuario) {
    navigateTo('/Login')
    return
  }

  const profile = getProfileByEmail(emailUsuario)
  const user = getUsers().find((item) => item.email === emailUsuario)

  if (profile) {
    usuario.value = {
      nome: profile.nome,
      email: profile.email,
      avatar: profile.avatar || '/images/dog.jpg'
    }
    return
  }

  if (user) {
    usuario.value = {
      nome: user.nome,
      email: user.email,
      avatar: user.avatar || '/images/dog.jpg'
    }
    saveProfileByEmail(emailUsuario, usuario.value)
    return
  }

  navigateTo('/Login')
})
</script>

<style lang="sass" scoped>
.sistema-page
  display: flex
  height: 100dvh
  transition: all 0.3s ease
  background-color: var(--cor-escuro-3)

  .modalSucessSettings
    margin: 0 0 0 20px

  &.coluna-recolhida
    .coluna-perfil
      width: 80px

    .page-tarefas
      margin-left: 80px

  .page-tarefas
    flex: 1
    height: 100%
    background-color: var(--cor-escuro-3)
    margin-left: 320px
    transition: margin-left 0.3s ease
    overflow-y: auto
</style>
