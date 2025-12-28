<template>
  <section class="depoimentos">
    <div class="titulo">
      <h1>Depoimentos</h1>
      <hr />
    </div>

    <div class="lista-depoimentos">
      <article class="card" v-for="item in depoimentos" :key="item.id">
        <div class="dados">
          <!-- Foto -->
          <img :src="item.imagem" :alt="item.nome" class="avatar" />

          <div class="nome-avaliacao">
            <!-- Nome -->
            <h3>{{ item.nome }}</h3>

            <!-- Estrelas -->
            <div class="estrelas">
              <svg v-for="n in item.avaliacao" :key="n" class="estrela">
                <Svgs nome="estrela"></Svgs>
              </svg>
            </div>
          </div>
        </div>
        <!-- Depoimento -->
        <p>{{ item.depoimento }}</p>
      </article>
    </div>
  </section>
</template>

<script setup>
import depoimentos from '~/assets/data/depoimentos.json'
import Svgs from '~/components/global/svgs/Svgs.vue'
</script>

<style lang="sass" scoped>
.depoimentos
  display: flex
  flex-direction: column
  align-items: center
  justify-content: center
  width: 100%
  padding: 0 20px 100px 20px
  box-sizing: border-box
  z-index: 10

  .titulo
    display: flex
    flex-direction: column
    align-items: center
    justify-content: center
    margin-bottom: 10px

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

  .lista-depoimentos
    display: flex
    align-items: center
    justify-content: center
    gap: clamp(20px, 4vw, 40px)
    margin-top: 40px
    flex-wrap: wrap
    width: 100%

    .card
      background: linear-gradient(130deg, var(--cor-azul-forte) 0%, var(--cor-roxo) 370%)
      border: solid 1px var(--cor-roxo)
      border-radius: 30px
      padding: 20px
      box-sizing: border-box
      max-width: 300px
      width: 100%
      display: flex
      flex-direction: column
      align-items: start
      text-align: start

      .dados
        display: flex
        flex-direction: row
        align-items: center
        justify-content: start
        margin-bottom: 15px

        .nome-avaliacao
          display: flex
          flex-direction: column
          align-items: start
          justify-content: start

      .estrelas
        display: flex
        align-items: center
        justify-content: center
        margin: 10px 0


        .estrela
          width: 10px
          height: 10px
          margin: 0 2px
          fill: var(--cor-amarelo)

      img
        border-radius: 50%
        width: 50px
        height: 50px
        object-fit: cover
        margin: 0 12px 0 0

      h3
        font-family: var(--light)
        font-size: var(--f2)
        color: var(--cor-branco)

      p
        font-family: var(--semibold)
        font-size: var(--f1)
        color: var(--cor-branco)
        line-height: 1.5
</style>
