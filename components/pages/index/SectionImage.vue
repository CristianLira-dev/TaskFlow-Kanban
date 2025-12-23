<template>
  <div class="mask-divider" aria-hidden="true"></div>
</template>

<script setup></script>

<style lang="sass" scoped>
.mask-divider
  width: 100%
  // Altura responsiva com clamp() - igual à solução anterior
  height: clamp(100px, 20vw, 400px)

  // 1. O Gradiente de Fundo (As cores que você quer na onda)
  background: linear-gradient(90deg, #7000ff, #00d4ff)

  // 2. A Máscara CSS
  // Aponta para o seu arquivo de imagem preto e branco
  -webkit-mask-image: url('/images/mask-wave.png')
  mask-image: url('/images/mask-wave.png')

  // Faz a máscara cobrir toda a área sem repetir
  -webkit-mask-size: cover
  mask-size: cover

  // Posiciona a máscara na parte inferior central
  -webkit-mask-position: center bottom
  mask-position: center bottom

  // Garante que não repita
  -webkit-mask-repeat: no-repeat
  mask-repeat: no-repeat

  // Ajuste fino para telas UltraWide (opcional)
  // Se ficar muito cortado em telas gigantes, mude para '100% auto'
  @media (min-width: 2000px)
    -webkit-mask-size: 100% auto
    mask-size: 100% auto
</style>
