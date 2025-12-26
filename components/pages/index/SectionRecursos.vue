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

<script setup></script>

<style lang="sass" scoped>
.recursos
  display: flex
  flex-direction: column
  align-items: center
  justify-content: center
  width: 100%
  padding: 0 20px 100px 20px

  .text
    text-align: center
    margin-bottom: 30px

    h1
      font-family: var(--semibold)
      font-weight: 900
      font-size: var(--f8)
      color: var(--cor-branco)

      strong
        color: var(--cor-roxo)

    p
      font-family: var(--light)
      font-size: var(--f2)
      color: var(--cor-cinza)
      line-height: 1.5
      margin-top: 10px

  .cards
    display: flex
    align-items: center
    justify-content: center
    gap: 40px
    margin-top: 40px
    flex-wrap: wrap

    .card
      display: flex
      flex-direction: column
      align-items: center
      width: clamp(195px, 20vw, 278px)
      height: clamp(166px, 17vw, 237px)
      border: solid 0.5px var(--cor-roxo)
      gap: 10px
      background: linear-gradient(130deg, var(--cor-azul-forte) 0%, var(--cor-roxo) 370%)
      padding: 23px
      border-radius: 24px
      transition: all 0.3s ease

      .icone-container
        width: 70px
        height: 70px
        padding: 10px
        background-color: var(--cor-azul-forte)
        border-radius: 100%
        margin: 30px 0 15px 0
        display: flex
        align-items: center
        justify-content: center

        svg
          width: 30px
          height: 30px
          fill: var(--cor-branco)

      .icone-tarefas-container
        width: 100px
        height: 80px
        margin: 30px 0 0 0
        display: flex
        align-items: center
        justify-content: center

        svg
          width: 100px
          height: 100px

      h2
        font-family: var(--semibold)
        font-size: var(--f3)
        color: var(--cor-branco)
        text-align: center

.botao
  display: flex
  align-items: center
  justify-content: center
  font-size: var(--f4)
  font-family: var(--semibold)
  color: var(--cor-branco)
  border-radius: 40px
  background-color: var(--cor-roxo)
  padding: 15px 30px
  margin-top: 107px
  transition: all 0.3s
  cursor: pointer
  text-decoration: none

  &:hover
    box-shadow: 0 0 25px var(--cor-roxo)
</style>
