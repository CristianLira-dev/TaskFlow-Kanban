<template>
  <footer>
    <div class="footer-content">
      <!-- Lado esquerdo: Logo + descrição -->
      <div class="left-section">
        <div class="logo">
          <Svgs nome="taskflow" />
          <h6>TaskFlow</h6>
        </div>
        <p class="tagline">
          Sua plataforma para
          <br />
          produtividade sem limites.
        </p>
      </div>

      <!-- Centro: Título gigante -->
      <div class="center-section">
        <Svgs nome="taskflow-footer" class="title-hero" />
      </div>

      <!-- Parte inferior: Copyright + Links -->
      <div class="bottom-section">
        <p class="copyright">TaskFlow © {{ anoAtual }}. Todos os direitos reservados</p>
        <div class="links">
          <NuxtLink to="termos-uso">Termos de Uso</NuxtLink>
          <NuxtLink to="termos-privacidade">Termos de Privacidade</NuxtLink>
        </div>
      </div>
    </div>
    <div class="footer-blush"></div>
  </footer>
</template>

<script setup>
import Svgs from '~/components/global/svgs/Svgs.vue'

const anoAtual = new Intl.DateTimeFormat('pt-BR', {
  year: 'numeric',
  timeZone: 'America/Sao_Paulo'
}).format(new Date())
</script>

<style scoped lang="sass">
footer
  position: relative
  display: flex
  flex-direction: column
  align-items: center
  justify-content: center
  width: 100%
  min-height: 400px
  overflow: hidden
  padding: 60px 20px 40px
  box-sizing: border-box
  background: linear-gradient(130deg, var(--cor-azul-forte) 0%, var(--cor-roxo) 900%)
  border-top: solid 1px var(--cor-roxo)
  box-shadow: var(--cor-roxo) 0px 40px 180px 16px, rgba(0,0,0,0.18) 0px 10px 30px 0px;


  .footer-content
    display: grid
    grid-template-columns: 1fr
    grid-template-rows: auto auto auto
    gap: 40px
    width: 100%
    max-width: 1400px
    position: relative
    z-index: 1

    // Lado esquerdo: Logo + Tagline
    .left-section
      display: flex
      flex-direction: column
      align-items: flex-start
      gap: 12px
      grid-row: 1

      .logo
        display: flex
        flex-direction: row
        align-items: center
        gap: 12px

        svg
          width: clamp(40px, 5vw, 60px)
          height: clamp(40px, 5vw, 60px)
          fill: var(--cor-branco)
          margin: 0 0 0 -7px

        h6
          font-family: var(--semibold)
          font-weight: 900
          font-size: clamp(var(--f3), 3vw, var(--f5))
          color: var(--cor-branco)
          margin: 0
          letter-spacing: -0.02em

      .tagline
        font-family: var(--light)
        font-size: clamp(var(--f1), 1.8vw, var(--f2))
        color: rgba(255, 255, 255, 0.7)
        line-height: 1.5
        margin: 0

    // Centro: Título Hero
    .center-section
      display: flex
      align-items: center
      justify-content: center
      grid-row: 2


    // Parte inferior: Copyright + Links
    .bottom-section
      display: flex
      flex-direction: row
      align-items: center
      grid-row: 3
      border-top: 1px solid rgba(168, 85, 247, 0.2)
      padding-top: 30px

      .copyright
        font-family: var(--light)
        font-size: clamp(var(--f1), 1.5vw, var(--f2))
        color: rgba(255, 255, 255, 0.5)
        margin: 0
        text-align: center

      .links
        display: flex
        flex-direction: row
        align-items: center
        gap: clamp(20px, 4vw, 40px)
        flex-wrap: wrap
        justify-content: center

        a
          font-family: var(--light)
          font-size: clamp(var(--f1), 1.5vw, var(--f2))
          color: rgba(255, 255, 255, 0.7)
          text-decoration: none
          position: relative
          transition: color 0.3s cubic-bezier(0.4, 0, 0.2, 1)

          &::after
            content: ''
            position: absolute
            bottom: -4px
            left: 0
            width: 0
            height: 2px
            background: linear-gradient(90deg, var(--cor-roxo) 0%, #a855f7 100%)
            transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1)

          &:hover
            color: var(--cor-branco)

            &::after
              width: 100%

// Responsividade Desktop (> 1024px)
@media (min-width: 1024px)
  footer
    min-height: 450px
    padding: 20px 40px 50px

    .footer-content
      grid-template-columns: 1fr 2fr 1fr
      grid-template-rows: 1fr auto
      gap: 60px
      align-items: center

      .left-section
        grid-column: 1
        grid-row: 1
        align-self: end

      .center-section
        grid-column: 2 / 4
        grid-row: 1 / 3
        display: flex
        align-items: start
        justify-content: flex-end
        pointer-events: none
        padding: 0 0 40px 0

        .title-hero
          width: 100%
          max-width: 900px
          height: auto
          min-height: 60px
          aspect-ratio: 3 / 1

      .bottom-section
        grid-column: 1 / -1
        grid-row: 2
        flex-direction: row
        justify-content: space-between
        padding-top: 40px

        .copyright
          text-align: left

        .links
          justify-content: flex-end

// Responsividade Tablet (768px - 1023px)
@media (min-width: 768px) and (max-width: 1023px)
  footer
    min-height: 420px
    padding: 70px 30px 45px

    .footer-content
      grid-template-columns: 1fr
      grid-template-rows: auto auto auto
      gap: 50px

      .left-section
        align-items: center
        text-align: center

        .tagline
          text-align: center

      .center-section
        .title-hero
          font-size: clamp(4rem, 15vw, 8rem)

      .bottom-section
        flex-direction: column-reverse
        gap: 20px

// Responsividade Mobile (< 768px)
@media (max-width: 767px)
  footer
    min-height: 380px
    padding: 50px 20px 35px

    .footer-content
      gap: 35px

      .left-section
        align-items: center
        text-align: center

        .logo
          flex-direction: column
          gap: 8px

        .tagline
          text-align: center
          br
            display: none

      .center-section
        .title-hero
          font-size: clamp(2.5rem, 18vw, 5rem)

      .bottom-section
        gap: 18px
        padding-top: 25px
        flex-direction: column-reverse

        .links
          flex-direction: column
          gap: 12px
</style>
