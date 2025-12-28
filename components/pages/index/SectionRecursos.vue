<template>
  <section class="recursos">
    <div class="text">
      <h1>
        <strong>Recursos</strong>
        Poderosos
      </h1>
      <p>Descubra todas as ferramentas e tecnologias que tornam nossa plataforma única.</p>
    </div>
    <div class="cards">
      <div class="card">
        <div class="icone-container">
          <Svgs nome="mais"></Svgs>
        </div>
        <h2>Crie suas Tarefas</h2>
      </div>
      <div class="card">
        <div class="icone-tarefas-container">
          <Svgs nome="tarefas"></Svgs>
        </div>
        <h2>Arraste Tarefas</h2>
      </div>
      <div class="card">
        <div class="icone-container">
          <Svgs nome="ajustes"></Svgs>
        </div>
        <h2>Personalize o Fluxo</h2>
      </div>
    </div>
    <div class="button">
      <NuxtLink to="login" class="botao">Começar Agora</NuxtLink>
    </div>
  </section>
</template>

<script setup>
import { defineNuxtLink } from 'nuxt/app'
</script>

<style lang="sass" scoped>
.recursos
  background-color: transparent
  display: flex
  flex-direction: column
  align-items: center
  justify-content: center
  width: 100%
  padding: 0 20px 100px 20px
  box-sizing: border-box
  z-index: 10

  .text
    text-align: center
    margin-bottom: 30px
    max-width: 800px
    width: 100%

    h1
      font-family: var(--semibold)
      font-weight: 900
      font-size: var(--f7)
      color: var(--cor-branco)
      line-height: 1.5

      strong
        color: var(--cor-roxo)

    p
      font-family: var(--light)
      font-size: var(--f2)
      color: var(--cor-cinza)
      line-height: 1.5
      margin-top: 10px
      max-width: 500px
      margin-left: auto
      margin-right: auto

  .cards
    display: flex
    align-items: stretch
    justify-content: center
    gap: clamp(20px, 4vw, 40px)
    margin-top: 40px
    flex-wrap: wrap
    width: 100%
    max-width: 1200px

    .card
      display: flex
      flex-direction: column
      align-items: center
      justify-content: flex-start
      width: 100%
      max-width: 300px
      min-width: 200px
      flex: 1 1 250px
      min-height: 237px
      border: solid 1px var(--cor-roxo)
      padding: clamp(20px, 3vw, 25px) clamp(15px, 2vw, 20px)
      background: linear-gradient(130deg, var(--cor-azul-forte) 0%, var(--cor-roxo) 370%)
      border-radius: 24px
      transition: all 0.3s ease
      box-sizing: border-box

      .icone-container
        width: clamp(60px, 10vw, 70px)
        height: clamp(60px, 10vw, 70px)
        min-width: 60px
        min-height: 60px
        aspect-ratio: 1 / 1
        padding: 10px
        background: linear-gradient(130deg, var(--cor-azul-forte) 0%, var(--cor-roxo) 370%)
        border: solid 1px var(--cor-branco)
        border-radius: 50%
        margin: clamp(15px, 3vw, 30px) 0 clamp(10px, 2vw, 15px) 0
        display: flex
        align-items: center
        justify-content: center
        box-sizing: border-box

        svg
          width: 60%
          height: 60%
          max-width: 30px
          max-height: 30px
          fill: var(--cor-branco)

      .icone-tarefas-container
        width: clamp(90px, 15vw, 110px)
        height: clamp(90px, 15vw, 110px)
        min-width: 90px
        min-height: 90px
        aspect-ratio: 1 / 1
        margin: clamp(5px, 1vw, 10px) 0 0 0
        display: flex
        align-items: center
        justify-content: center

        svg
          width: 100%
          height: 100%
          object-fit: contain

      h2
        font-family: var(--semibold)
        font-size: var(--f3)
        color: var(--cor-branco)
        text-align: center
        margin-top: auto
        width: 100%

.botao
  display: flex
  align-items: center
  justify-content: center
  font-size: var(--f2)
  font-family: var(--semibold)
  color: var(--cor-branco)
  border-radius: 40px
  background-color: var(--cor-roxo)
  padding: 16px 44px
  margin-top: clamp(60px, 8vw, 100px)
  transition: all 0.3s
  cursor: pointer
  text-decoration: none
  width: fit-content
  text-align: center

  &:hover
    box-shadow: 0 0 25px var(--cor-roxo)

@media (max-width: 768px)
  .recursos
    padding: 0 15px 60px 15px

    .cards
      gap: 20px

      .card
        flex: 1 1 100%
        max-width: 100%

@media (max-width: 480px)
  .recursos
    padding: 0 10px 40px 10px

    .botao
      padding: 16px 20vw

    .cards
      .card
        min-height: 200px
</style>
