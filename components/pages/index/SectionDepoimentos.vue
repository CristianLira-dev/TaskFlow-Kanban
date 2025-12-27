<template>
  <section class="depoimentos">
    <div class="titulo">
      <h1>Depoimentos</h1>
      <hr />
    </div>
  </section>
</template>

<script setup></script>

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
</style>
