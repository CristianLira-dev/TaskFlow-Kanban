<template>
  <nav :class="{ aberto: state.menu }">
    <div class="nav-logo">
      <Svgs nome="taskflow" class="logo" />
      <p>TaskFlow</p>
    </div>
    <div class="opcoes">
      <a @click="scrollParaSection('.recursos')">Recursos</a>
      <a @click="scrollParaSection('.depoimentos')">Depoimentos</a>
    </div>

    <div class="buttons">
      <NuxtLink to="login" class="cadastro">Cadastrar</NuxtLink>
      <NuxtLink to="login" class="entrar">Entrar</NuxtLink>
    </div>

    <button class="menu" @click="state.menu = !state.menu" :class="{ aberto: state.menu }">
      <span class="um"></span>
      <span class="dois"></span>
    </button>
  </nav>
</template>

<script setup>
import { defineNuxtLink } from 'nuxt/app'
import Svgs from '../svgs/Svgs.vue'

const state = reactive({
  menu: false
})

function scrollParaSection(seletor) {
  const elemento = document.querySelector(seletor)
  if (elemento) {
    // calcula offset com base na altura do nav para ajustar posição final
    const navEl = document.querySelector('nav')
    const navHeight = navEl ? navEl.offsetHeight : 70
    const extraOffset = 110 // ajuste fino (px) — altere se necessário
    const offset = navHeight + extraOffset

    const top = elemento.getBoundingClientRect().top + window.pageYOffset - offset
    window.scrollTo({ top, behavior: 'smooth' })
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
  border: 0.5px solid var(--cor-branco)
  z-index: 100

  .nav-logo
    display: flex
    align-items: center
    gap: 7px

    p
      font-size: var(--f5)
      font-weight: bold
      font-family: var(--semibold)
      color: var(--cor-branco)

  .logo
    width: 60px

  .opcoes
    display: flex
    align-items: center
    gap: 30px

    a
      font-size: var(--f2)
      font-family: var(--light)
      color: var(--cor-cinza)
      padding: 0 30px 0 0
      transition: all 0.3s
      cursor: pointer

      &:last-child
        border-right: none
        padding: 0 0 0 0

      &:hover
        color: var(--cor-roxo-claro)

  .buttons
    display: flex
    align-items: center
    gap: 10px

  .cadastro
    display: flex
    align-items: center
    justify-content: center
    gap: 10px
    font-size: var(--f1)
    font-family: var(--semibold)
    color: var(--cor-branco)
    border-radius: 100px
    background: transparent
    border: 0.5px solid var(--cor-branco)
    padding: 15px 40px
    transition: all 0.3s
    cursor: pointer

    &:hover
      background-color: var(--cor-branco)
      color: var(--cor-escuro-1)

  .entrar
    display: flex
    align-items: center
    justify-content: center
    gap: 10px
    font-size: var(--f2)
    font-family: var(--semibold)
    color: var(--cor-branco)
    border-radius: 100px
    background: linear-gradient(90deg, var(--cor-roxo) 0%, var(--cor-roxo-claro) 100%)
    padding: 15px 40px
    transition: all 0.5s
    cursor: pointer

    &:hover
      filter: brightness(1.2)

  button.menu
    display: none

@media screen and (max-width: 1200px)
  nav
    align-items: flex-start
    width: calc(100% - 60px)
    top: 20px
    left: 30px
    height: 60px
    border-radius: 30px
    padding: 0px 30px 0 30px
    transform: translateX(0)
    overflow: hidden
    transition: all 0.3s

    .nav-logo p
      font-size: var(--f4)

    &.aberto
      height: 350px // Aumentei para acomodar os botões

    img.logo
      width: 120px
      margin: 100px 0 0 0

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
