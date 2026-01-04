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
import { ref } from 'vue'
import ModalSettings from '../../modalSettings/ModalSettings.vue'
import SectionTarefas from './SectionTarefas.vue'
import SidebarSistema from './SidebarSistema.vue'

const isCollapsed = ref(false)

// Perfil selecionado ('tarefas' | 'ocultas')
const selectedPerfil = ref('tarefas')

// Dados de exemplo
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
  // Atualiza os dados do usuário com os valores do modal
  usuario.value = { ...usuario.value, ...dados }
  modalSettingsOpen.value = false

  // abrir modal de sucesso
  mensagemModal.value = 'Configurações salvas com sucesso!'
  modalAutenticacaoOpen.value = true
}
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
