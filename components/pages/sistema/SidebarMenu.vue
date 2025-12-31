<template>
  <!-- Conteúdo expandido -->
  <div class="conteudo-perfil" v-show="!isCollapsed">
    <!-- Seção de tarefas do usuário -->
    <div class="perfil-tarefas">
      <button class="botao-tarefas" :class="{ ativa: selectedPerfil === 'tarefas' }" @click="$emit('select-perfil', 'tarefas')" :aria-pressed="selectedPerfil === 'tarefas'" aria-label="Mostrar tarefas">
        <Svgs nome="task" class="icone-tarefas" />
        <span class="texto-tarefas">Tarefas</span>
      </button>
    </div>

    <div class="perfil-tarefas-ocultas">
      <button class="botao-tarefas" :class="{ ativa: selectedPerfil === 'ocultas' }" @click="$emit('select-perfil', 'ocultas')" :aria-pressed="selectedPerfil === 'ocultas'" aria-label="Mostrar tarefas ocultas">
        <Svgs nome="olho" class="icone-tarefas" />
        <span class="texto-tarefas">Tarefas Ocultas</span>
      </button>
    </div>
  </div>

  <!-- Versão recolhida (apenas ícones) -->
  <div class="coluna-recolhida-conteudo" v-show="isCollapsed">
    <div class="menu-recolhido">
      <button class="botao-recolhido" :class="{ ativa: selectedPerfil === 'tarefas' }" @click="$emit('select-perfil', 'tarefas')" aria-label="Tarefas" title="Tarefas">
        <Svgs nome="task" />
      </button>

      <button class="botao-recolhido" :class="{ ativa: selectedPerfil === 'ocultas' }" @click="$emit('select-perfil', 'ocultas')" aria-label="Tarefas Ocultas" title="Tarefas Ocultas">
        <Svgs nome="olho" />
      </button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  isCollapsed: {
    type: Boolean,
    required: true
  },
  selectedPerfil: {
    type: String,
    required: true
  }
})

defineEmits(['select-perfil'])
</script>

<style lang="sass" scoped>
.conteudo-perfil
  flex: 1
  padding: 20px
  display: flex
  flex-direction: column
  gap: 24px

  .perfil-tarefas, .perfil-tarefas-ocultas
    .botao-tarefas
      display: inline-flex
      align-items: center
      width: 100%
      gap: 10px
      background: transparent
      border: none
      color: var(--cor-branco)
      padding: 8px 12px
      border-radius: 12px
      cursor: pointer
      transition: background-color 0.2s, color 0.2s

      .icone-tarefas
        width: 35px
        height: 35px
        fill: var(--cor-branco)
        color: var(--cor-branco)

      .texto-tarefas
        font-family: var(--semibold)
        font-size: var(--f2)
        color: var(--cor-branco)

      &.ativa
        background-color: var(--cor-branco)
        .texto-tarefas
          color: var(--cor-preto, #000)
        .icone-tarefas
          fill: var(--cor-preto, #000)
          color: var(--cor-preto, #000)

.coluna-recolhida-conteudo
  display: flex
  flex-direction: column
  align-items: center
  padding: 24px 0
  height: 100%

  .menu-recolhido
    display: flex
    flex-direction: column
    gap: 12px
    align-items: center

    .botao-recolhido
      background: transparent
      border: none
      cursor: pointer
      padding: 10px
      border-radius: 10px
      display: inline-flex
      align-items: center
      justify-content: center
      transition: background-color 0.15s, color 0.15s

      svg, .icon-svg
        width: 30px
        height: 30px
        fill: var(--cor-branco)
        color: var(--cor-cinza-claro)

      &:hover
        background-color: rgba(255,255,255,0.05)

      &.ativa
        background-color: var(--cor-branco)

        svg, .icon-svg
          fill: var(--cor-preto, #000)
          color: var(--cor-preto, #000)
</style>
