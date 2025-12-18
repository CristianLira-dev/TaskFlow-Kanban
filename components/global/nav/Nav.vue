<template>
  <!-- Seu template permanece igual -->
  <nav :class="{ aberto: state.menu }">
    <img src="/images/logo-linha.svg" class="logo" alt="logo" />
    <div class="opcoes">
      <a @click="scrollParaSection('.recursos')">Recursos</a>
      <a @click="scrollParaSection('.depoimentos')">Depoimentos</a>
    </div>

    <div class="buttons">
      <a class="botao" href="login"">Cadastrar</a>
      <a class="botao" href="login"">Entrar</a>
    </div>

    <button class="menu" @click="state.menu = !state.menu" :class="{ aberto: state.menu }">
      <span class="um"></span>
      <span class="dois"></span>
    </button>
  </nav>
</template>

<script setup>
const state = reactive({
  menu: false
})

function scrollParaSection(seletor) {
  const elemento = document.querySelector(seletor)
  if (elemento) {
    elemento.scrollIntoView({ behavior: 'smooth' })
    state.menu = false
  }
}
</script>

<style scoped lang="sass">
nav
  display: flex
  align-items: center
  justify-content: space-between
  width: calc(100% - 360px)
  max-width: 1920px
  position: fixed
  top: 20px
  left: 50%
  transform: translateX(-50%)
  height: 70px
  border-radius: 100px
  padding: 0 15px 0 35px
  background-color: var(--cor-escuro-3-transparente)
  backdrop-filter: blur(15px)
  z-index: 10

  img.logo
    width: 200px

  .opcoes
    display: flex
    align-items: center
    gap: 30px

    a
      font-size: var(--f1)
      font-family: var(--light)
      color: var(--cor-cinza)
      padding: 0 30px 0 0
      transition: all 0.3s
      cursor: pointer

      &:last-child
        border-right: none
        padding: 0 0 0 0

      &:hover
        color: var(--cor-verde)

  .buttons
    display: flex
    align-items: center
    gap: 10px

  .botao
    display: flex
    align-items: center
    justify-content: center
    gap: 10px
    font-size: var(--f1)
    font-family: var(--semibold)
    color: var(--cor-verde)
    border-radius: 100px
    background: linear-gradient(90deg, var(--cor-verde-escuro-3) 0%, var(--cor-verde-escuro-2) 100%)
    padding: 15px 30px
    transition: all 0.3s
    cursor: pointer

    svg
      width: 15px
      fill: var(--cor-verde)

    &:hover
      filter: brightness(1.2)

  button.menu
    display: none

@media screen and (max-width: 1100px)
  nav
    align-items: flex-start
    width: calc(100% - 60px)
    top: 20px
    left: 30px
    height: 60px
    border-radius: 30px
    padding: 15px 30px 0 30px
    transform: translateX(0)
    overflow: hidden
    transition: all 0.3s

    &.aberto
      height: 350px // Aumentei para acomodar os botões

    img.logo
      width: 160px
      margin: 5px 0 0 0

    .opcoes
      display: flex
      flex-direction: column
      align-items: flex-start
      gap: 0
      position: absolute
      top: 80px
      left: 30px
      right: 30px

      a
        font-size: var(--f3)
        border-right: none
        padding: 12px 0
        width: 100%

        &:last-child
          border-right: none
          padding: 15px 0

    .buttons
      position: absolute
      top: 200px // Posiciona abaixo das opções
      display: flex
      flex-direction: column // Empilha os botões verticalmente
      justify-content: start
      gap: 15px
      opacity: 0
      transition: opacity 0.3s ease

    &.aberto .buttons
      opacity: 1 // Mostra os botões apenas quando o menu está aberto

    .botao
      justify-content: center
      text-align: center

    button.menu
      display: flex
      align-items: center
      justify-content: center
      width: 30px
      height: 30px
      position: absolute
      right: 30px
      top: 15px
      background-color: transparent

      &.aberto
        span
          background-color: var(--cor-vermelho)

          &.um
            transform: rotate(45deg)
            top: 13px

          &.dois
            transform: rotate(-45deg)
            width: 30px
            bottom: 13px

      span
        height: 3px
        border-radius: 20px
        background-color: var(--cor-branco)
        right: 0
        position: absolute
        transition: all 0.3s

        &.um
          width: 30px
          top: 7px

        &.dois
          width: 20px
          bottom: 7px
</style>
