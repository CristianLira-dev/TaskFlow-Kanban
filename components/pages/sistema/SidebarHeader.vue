<template>
  <div class="cabecalho-coluna">
    <div class="logo-titulo">
      <Svgs v-show="!isCollapsed" nome="taskflow" class="logo" />
      <h1 class="marca" v-show="!isCollapsed">TaskFlow</h1>
    </div>

    <button class="botao-recolher" @click="$emit('toggle-coluna')" :aria-label="isCollapsed ? 'Expandir barra lateral' : 'Recolher barra lateral'">
      <Svgs :nome="isCollapsed ? 'arrow-right' : 'arrow-left'" class="icone-recolher" />
    </button>
  </div>
</template>

<script setup>
defineProps({
  isCollapsed: {
    type: Boolean,
    required: true
  }
})

defineEmits(['toggle-coluna'])
</script>

<style lang="sass" scoped>
.cabecalho-coluna
  display: flex
  justify-content: space-between
  align-items: center
  padding: 24px 20px
  border-bottom: 1px solid var(--cor-escuro-2)

  .logo-titulo
    display: flex
    align-items: center
    gap: 12px

    .logo
      width: 36px
      height: 36px

    .marca
      font-family: var(--semibold)
      font-size: var(--f3)
      color: var(--cor-branco)
      margin: 0

  .botao-recolher
    background: transparent
    border: none
    cursor: pointer
    padding: 10px
    border-radius: 50%
    transition: background-color 0.3s

    &:hover
      background-color: var(--cor-escuro-3)

    svg
      width: 20px
      height: 20px
      fill: var(--cor-branco)
</style>
