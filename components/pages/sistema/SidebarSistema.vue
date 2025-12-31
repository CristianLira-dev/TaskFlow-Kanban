<template>
  <div class="coluna-perfil">
    <!-- Cabeçalho da coluna lateral -->
    <SidebarHeader :is-collapsed="isCollapsed" @toggle-coluna="$emit('toggle-coluna')" />

    <!-- Menu de navegação -->
    <SidebarMenu :is-collapsed="isCollapsed" :selected-perfil="selectedPerfil" @select-perfil="$emit('select-perfil', $event)" />

    <!-- Perfil do usuário -->
    <SidebarUser :is-collapsed="isCollapsed" :usuario="usuario" @open-settings="$emit('open-settings')" />
  </div>
</template>

<script setup>
import SidebarHeader from './SidebarHeader.vue'
import SidebarMenu from './SidebarMenu.vue'
import SidebarUser from './SidebarUser.vue'

defineProps({
  isCollapsed: {
    type: Boolean,
    required: true
  },
  selectedPerfil: {
    type: String,
    required: true
  },
  usuario: {
    type: Object,
    required: true,
    default: () => ({
      nome: '',
      email: '',
      avatar: ''
    })
  }
})

defineEmits(['toggle-coluna', 'select-perfil', 'open-settings'])
</script>

<style lang="sass" scoped>
.coluna-perfil
  position: fixed
  left: 0
  top: 0
  bottom: 0
  width: 320px
  background-color: var(--cor-escuro-1)
  display: flex
  flex-direction: column
  transition: all 0.3s ease
  z-index: 100
  overflow-y: auto
  overflow-x: hidden

  // Estilos para quando a sidebar estiver recolhida
  &:has(+ .coluna-recolhida) // Nota: Este seletor pode não funcionar em todos os navegadores
    width: 80px
</style>
