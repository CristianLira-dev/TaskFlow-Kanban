<template>
  <nav :class="{ aberto: state.menu }">
    <img src="/images/logo-linha.svg" class="logo" alt="logo" />
    <div class="opcoes">
      <a @click="scrollParaSection('.cronograma')">Dia e Horário</a>
      <a @click="scrollParaSection('.aprender')">Conteúdo</a>
      <a @click="scrollParaSection('.duvidas')">Dúvidas</a>
      <a @click="scrollParaSection('#professor')">Seu Professor</a>
    </div>
    <a class="ingresso" @click="scrollParaSection('.comprar')">
      <Svgs nome="ingresso" />
      Garantir Ingresso
    </a>
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
  width: calc(100% - 160px)
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
      border-right: 1px solid var(--cor-escuro-5)
      padding: 0 30px 0 0
      transition: all 0.3s

      &:last-child
        border-right: none
        padding: 0 0 0 0

      &:hover
        color: var(--cor-verde)

  .ingresso
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

@media screen and (max-width: 1000px)
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
      height: 310px

    img.logo
      width: 160px
      margin: 5px 0 0 0

    .opcoes
      display: flex
      flex-direction: column
      align-items: flex-start
      gap: 0
      position: absolute
      top: 50px

      a
        font-size: var(--f2)
        border-right: none
        padding: 12px 0

        &:last-child
          border-right: none
          padding: 15px 0

    .ingresso
      position: absolute
      top: 230px

    button.menu
      display: flex
      align-items: center
      justify-content: center
      width: 30px
      height: 30px
      position: relative
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
