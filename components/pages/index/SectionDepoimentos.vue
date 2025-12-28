<template>
  <section class="depoimentos">
    <div class="titulo">
      <h1>Depoimentos</h1>
      <hr />
    </div>

    <div class="carousel-container">
      <div class="lista-depoimentos" ref="carouselTrack" @mouseenter="pauseAnimation" @mouseleave="resumeAnimation" @touchstart.passive="pauseAnimation" @touchend="resumeAnimation">
        <!-- Cards originais -->
        <article class="card" v-for="item in depoimentos" :key="`original-${item.id}`">
          <div class="dados">
            <img :src="item.imagem" :alt="item.nome" class="avatar" />
            <div class="nome-avaliacao">
              <h3>{{ item.nome }}</h3>
              <div class="estrelas">
                <svg v-for="n in item.avaliacao" :key="n" class="estrela">
                  <Svgs nome="estrela"></Svgs>
                </svg>
              </div>
            </div>
          </div>
          <p>{{ item.depoimento }}</p>
        </article>

        <!-- Cards duplicados para loop infinito -->
        <article class="card" v-for="item in depoimentos" :key="`clone-${item.id}`">
          <div class="dados">
            <img :src="item.imagem" :alt="item.nome" class="avatar" />
            <div class="nome-avaliacao">
              <h3>{{ item.nome }}</h3>
              <div class="estrelas">
                <svg v-for="n in item.avaliacao" :key="n" class="estrela">
                  <Svgs nome="estrela"></Svgs>
                </svg>
              </div>
            </div>
          </div>
          <p>{{ item.depoimento }}</p>
        </article>
      </div>
    </div>

    <div class="blush um"></div>
  </section>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import depoimentos from '~/assets/data/depoimentos.json'
import Svgs from '~/components/global/svgs/Svgs.vue'

const carouselTrack = ref(null)
let animationId = null
let currentPosition = 0
let isPaused = false
let targetSpeed = 0.5 // pixels por frame
let currentSpeed = 0.5
const easeSpeed = 0.08 // velocidade de transição suave

const animate = () => {
  if (!carouselTrack.value || isPaused) {
    // Durante pausa, mantém requestAnimationFrame para retomar suavemente
    if (isPaused) {
      animationId = requestAnimationFrame(animate)
    }
    return
  }

  // Easing suave na velocidade
  currentSpeed += (targetSpeed - currentSpeed) * easeSpeed

  currentPosition += currentSpeed

  // Largura de um conjunto completo de cards
  const trackWidth = carouselTrack.value.scrollWidth / 2

  // Reset suave quando completar um loop
  if (currentPosition >= trackWidth) {
    currentPosition = 0
  }

  carouselTrack.value.style.transform = `translate3d(-${currentPosition}px, 0, 0)`

  animationId = requestAnimationFrame(animate)
}

const pauseAnimation = () => {
  isPaused = true
  targetSpeed = 0 // desacelera suavemente até parar
}

const resumeAnimation = () => {
  isPaused = false
  targetSpeed = 0.5 // acelera suavemente até velocidade normal
}

onMounted(() => {
  if (carouselTrack.value) {
    animate()
  }
})

onUnmounted(() => {
  if (animationId) {
    cancelAnimationFrame(animationId)
  }
})
</script>

<style lang="sass" scoped>
.depoimentos
  display: flex
  flex-direction: column
  align-items: center
  justify-content: center
  width: 100%
  padding: 0 0 100px 0
  margin: 0 0 80px 0
  box-sizing: border-box
  z-index: 10
  position: relative

  .blush
    position: absolute
    width: 50vw
    height: 50vw
    max-width: 2000px
    max-height: 2000px
    min-width: 800px
    min-height: 800px
    border-radius: 50%
    background: radial-gradient(circle at center, #6200EA, #6200EA00 60%)
    z-index: 0
    pointer-events: none

    &.um
      top: -25vw
      left: -25vw
      opacity: 0.45

  .titulo
    display: flex
    flex-direction: column
    align-items: center
    justify-content: center
    margin-bottom: 10px
    z-index: 3

    h1
      font-family: var(--semibold)
      font-weight: 900
      font-size: var(--f8)
      color: var(--cor-branco)
      line-height: 1.5

    hr
      width: 120px
      height: 4px
      border: none
      border-radius: 5px
      background-color: var(--cor-branco)
      margin-top: 10px

  .carousel-container
    width: 100%
    overflow: hidden
    margin-top: 40px
    position: relative
    z-index: 2

    // Máscaras de fade nas bordas para efeito premium
    &::before,
    &::after
      content: ''
      position: absolute
      top: 0
      bottom: 0
      width: 100px
      z-index: 2
      pointer-events: none

  .lista-depoimentos
    display: flex
    align-items: stretch
    gap: clamp(20px, 4vw, 40px)
    width: fit-content
    will-change: transform

    .card
      background: linear-gradient(130deg, var(--cor-azul-forte) 0%, var(--cor-roxo) 370%)
      border: solid 1px var(--cor-roxo)
      border-radius: 30px
      padding: 20px
      box-sizing: border-box
      width: 350px
      min-width: 350px
      height: 200px
      display: flex
      flex-direction: column
      align-items: start
      text-align: start
      flex-shrink: 0
      transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.3s ease

      .dados
        display: flex
        flex-direction: row
        align-items: center
        justify-content: start
        margin-bottom: 15px
        width: 100%

        .nome-avaliacao
          display: flex
          flex-direction: column
          align-items: start
          justify-content: start
          flex: 1
          min-width: 0

      .estrelas
        display: flex
        align-items: center
        justify-content: start
        margin: 8px 0

        .estrela
          width: 12px
          height: 12px
          margin: 0 2px
          fill: var(--cor-amarelo)

      img
        border-radius: 50%
        width: 50px
        height: 50px
        min-width: 50px
        object-fit: cover
        margin: 0 12px 0 0

      h3
        font-family: var(--light)
        font-size: var(--f2)
        color: var(--cor-branco)
        margin: 0
        white-space: nowrap
        overflow: hidden
        text-overflow: ellipsis
        width: 100%

      p
        font-family: var(--semibold)
        font-size: var(--f1)
        color: var(--cor-branco)
        line-height: 1.6
        margin: 0
        flex: 1
        overflow: hidden
        display: -webkit-box
        -webkit-line-clamp: 5
        -webkit-box-orient: vertical


@media screen and (max-width: 1000px)
  .depoimentos
    .blush
      width: 80vw
      height: 80vw
      min-width: 600px
      min-height: 600px

      &.um
        top: -40vw
        left: -40vw

@media screen and (max-width: 768px)
  .depoimentos
    .blush
      width: 100vw
      height: 100vw
      min-width: 500px
      min-height: 500px

      &.um
        top: -50vw
        left: -50vw

// Responsividade
@media (max-width: 768px)
  .depoimentos
    .carousel-container
      &::before,
      &::after
        width: 40px

    .lista-depoimentos
      .card
        width: 280px
        min-width: 280px
        height: 260px
</style>
