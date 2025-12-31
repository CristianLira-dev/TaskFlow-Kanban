<template>
  <!-- Perfil expandido -->
  <div class="perfil-usuario" v-show="!isCollapsed">
    <div class="avatar">
      <img :src="usuario.avatar" :alt="usuario.nome" />
    </div>
    <div class="info-usuario">
      <h3>{{ usuario.nome }}</h3>
      <p>{{ usuario.email }}</p>
    </div>
    <button class="botao-config" @click="$emit('open-settings')">
      <Svgs nome="settings" />
    </button>
  </div>

  <!-- Avatar recolhido -->
  <div class="avatar-recolhida" v-show="isCollapsed">
    <button class="botao-avatar" aria-label="Perfil do usuário">
      <img :src="usuario.avatar" :alt="usuario.nome" />
    </button>
  </div>
</template>

<script setup>
defineProps({
  isCollapsed: {
    type: Boolean,
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

defineEmits(['open-settings'])
</script>

<style lang="sass" scoped>
.perfil-usuario
  margin-top: auto
  display: flex
  align-items: center
  gap: 12px
  padding: 16px
  background: var(--cor-escuro-1)
  border-top: 1px solid var(--cor-escuro-2)

  .avatar
    width: 50px
    height: 50px
    border-radius: 50%
    overflow: hidden

    img
      width: 100%
      height: 100%
      object-fit: cover

  .info-usuario
    flex: 1

    h3
      font-family: var(--semibold)
      font-size: var(--f2)
      color: var(--cor-branco)
      margin: 0 0 4px 0
      max-width: 142px
      white-space: nowrap
      overflow: hidden
      text-overflow: ellipsis

    p
      font-family: var(--light)
      font-size: var(--f1)
      color: var(--cor-cinza)
      margin: 0
      max-width: 142px
      white-space: nowrap
      overflow: hidden
      text-overflow: ellipsis

  .botao-config
    background: none
    border: none
    cursor: pointer
    padding: 6px 6px 4px 6px
    border-radius: 6px
    transition: background-color 0.2s

    &:hover
      background-color: var(--cor-escuro-3)

    svg
      width: 20px
      height: 20px
      fill: var(--cor-cinza-claro)

.avatar-recolhida
  margin-top: auto
  padding: 20px 0 20px 15px

  .botao-avatar
    background: transparent
    border: none
    cursor: pointer
    width: 48px
    height: 48px
    padding: 0
    border-radius: 50%
    overflow: hidden

    img
      width: 100%
      height: 100%
      object-fit: cover
</style>
