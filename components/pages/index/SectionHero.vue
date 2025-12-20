<template>
  <section class="insano">
    <div class="texto">
      <h1 class="titulo um">Menos bagunça,</h1>
      <h1 class="titulo dois">Mais progresso.</h1>
      <p>Planeje, organize e mova suas tarefas com fluidez usando quadros inteligentes.</p>
      <NuxtLink to="/">Aumentar Produtividade</NuxtLink>
    </div>

    <!-- Canvas do notebook 3D -->
    <div class="canvas" ref="canvas3d"></div>

    <div class="blush um"></div>
    <div class="blush dois"></div>
  </section>
</template>

<script setup>
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

const canvas3d = ref(null)

onMounted(() => {
  // ============================================
  // 1. CONFIGURAÇÃO INICIAL DA CENA 3D
  // ============================================
  const scene = new THREE.Scene()
  // Scene é o container principal que contém todos os objetos 3D

  // ============================================
  // 2. CONFIGURAÇÃO DA CÂMERA
  // ============================================
  const camera = new THREE.PerspectiveCamera(
    35, // Campo de visão (FOV) - quanto maior, mais ampla a visão
    canvas3d.value.clientWidth / canvas3d.value.clientHeight, // Proporção da tela
    0.1, // Plano de corte próximo - objetos mais próximos que isto não são renderizados
    1000 // Plano de corte distante - objetos mais distantes não são renderizados
  )
  // Posiciona a câmera: (x, y, z)
  camera.position.set(0, 0, 4)

  // ============================================
  // 3. CONFIGURAÇÃO DO RENDERIZADOR
  // ============================================
  const renderer = new THREE.WebGLRenderer({
    antialias: true, // Suaviza as bordas (anti-aliasing)
    alpha: true // Permite fundo transparente
  })

  // Define o tamanho do renderizador igual ao container
  renderer.setSize(canvas3d.value.clientWidth, canvas3d.value.clientHeight)

  // Otimiza para telas retina, limitando a 2x para performance
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

  // Adiciona o canvas do Three.js ao DOM
  canvas3d.value.appendChild(renderer.domElement)

  // ============================================
  // 4. CONFIGURAÇÃO DAS LUZES
  // ============================================
  const directional = new THREE.DirectionalLight(0xffffff, 0.5)
  // Luz direcional (como o sol) - cor branca, intensidade 0.5
  directional.position.set(-239.91, 383.25, 80.65) // Posição da luz
  scene.add(directional)

  // ============================================
  // 5. CARREGAMENTO DO MODELO 3D
  // ============================================
  const loader = new GLTFLoader()
  let model, screenLid, screenDisplay
  // model: modelo completo do notebook
  // screenLid: tampa/lid do notebook
  // screenDisplay: tela/display LCD

  loader.load('/images/notebookSemfundo.glb', (gltf) => {
    model = gltf.scene // Obtém a cena do modelo

    // ============================================
    // 5.1 AJUSTES GLOBAIS DO MODELO
    // ============================================
    model.scale.set(0.8, 0.8, 0.8) // Escala: 80% do tamanho original
    model.position.set(0, -0.6, 0) // Posição: centroX, abaixoY, centroZ
    model.rotation.y = -0.5 // Rotação inicial no eixo Y

    // ============================================
    // 5.2 LOCALIZAÇÃO DOS OBJETOS PELO NOME
    // ============================================
    // IMPORTANTE: Verifique no Spline os nomes exatos
    // Possíveis nomes: 'Screen', 'Lid', 'Tampa' para a tampa
    // Possíveis nomes: 'screen', 'Display', 'Tela' para o display

    screenLid = model.getObjectByName('Screen') // Tampa (S maiúsculo)
    screenDisplay = model.getObjectByName('screen') // Tela (s minúsculo)

    // ============================================
    // 5.3 DEBUG: VERIFICAÇÃO DOS OBJETOS ENCONTRADOS
    // ============================================
    console.log('=== DEBUG INICIAL ===')
    console.log('Tampa encontrada?', screenLid)
    console.log('Tela encontrada?', screenDisplay)

    if (screenLid) {
      console.log('Posição INICIAL da Tampa:', screenLid.position)
      console.log('Rotação INICIAL da Tampa:', screenLid.rotation)
    }

    if (screenDisplay) {
      console.log('Posição INICIAL da Tela:', screenDisplay.position)
      console.log('Rotação INICIAL da Tela:', screenDisplay.rotation)
    }

    // ============================================
    // 5.4 AJUSTES ESPECÍFICOS - TAMPA E TELA
    // ============================================
    if (screenLid && screenDisplay) {
      console.log('=== APLICANDO AJUSTES ===')

      // ------------------------------------------------------
      // OPÇÃO A: ALINHAMENTO SIMPLES (Experimente primeiro)
      // ------------------------------------------------------
      /*
      // 1. Alinha a tampa com a tela nos eixos X e Y
      screenLid.position.x = screenDisplay.position.x
      screenLid.position.y = screenDisplay.position.y

      // 2. AJUSTE CRÍTICO: Posição Z (profundidade)
      // Valor positivo = tampa mais para trás
      // Valor negativo = tampa mais para frente
      // Experimente valores entre 0.01 e 0.05
      const espessuraTampa = 0.03 // 3cm de espessura
      screenLid.position.z = screenDisplay.position.z - espessuraTampa
      */

      // ------------------------------------------------------
      // OPÇÃO B: ALINHAMENTO COM ROTAÇÃO (Mais preciso)
      // ------------------------------------------------------
      /*
      // Copia toda a transformação da tela para a tampa
      screenLid.position.copy(screenDisplay.position)
      screenLid.rotation.copy(screenDisplay.rotation)
      screenLid.scale.copy(screenDisplay.scale)

      // Ajuste fino apenas no eixo Z
      screenLid.position.z += 0.02 // Move a tampa 2cm para frente
      */

      // ------------------------------------------------------
      // OPÇÃO C: PARENTEAMENTO (Recomendado para animação)
      // ------------------------------------------------------

      // 1. Primeiro, alinha a tampa com a tela
      screenLid.position.x = screenDisplay.position.x
      screenLid.position.y = screenDisplay.position.y - 9
      screenLid.position.z = screenDisplay.position.z - 60 // Ajuste fino

      // 2. Faz a tela ser filha da tampa
      // Isso garante que quando a tampa se mover, a tela acompanhe
      if (screenDisplay.parent !== screenLid) {
        // Guarda a posição/rotação atual da tela
        const posOriginal = screenDisplay.position.clone()
        const rotOriginal = screenDisplay.rotation.clone()
        const scaleOriginal = screenDisplay.scale.clone()

        // Remove a tela do seu pai atual
        if (screenDisplay.parent) {
          screenDisplay.parent.remove(screenDisplay)
        }

        // Adiciona a tela como filha da tampa
        screenLid.add(screenDisplay)

        // Restaura a posição/rotação original (agora relativa à tampa)
        screenDisplay.position.copy(posOriginal)
        screenDisplay.rotation.copy(rotOriginal)
        screenDisplay.scale.copy(scaleOriginal)

        console.log('Tela agora é filha da Tampa')
      }

      // 3. Ajuste final de posição relativa
      // Como agora são pai-filho, podemos ajustar posições relativas
      screenDisplay.position.set(0, 0, 0.01) // Tela 1cm na frente da tampa

      console.log('Ajuste aplicado: Tampa atrás da Tela')
      console.log('Posição FINAL da Tampa:', screenLid.position)
      console.log('Posição FINAL da Tela (relativa):', screenDisplay.position)
    }

    // ============================================
    // 5.5 ADICIONA O MODELO À CENA E INICIA ANIMAÇÃO
    // ============================================
    scene.add(model)
    animate() // Inicia o loop de animação
  })

  // ============================================
  // 6. LOOP DE ANIMAÇÃO
  // ============================================
  function animate() {
    // Solicita o próximo frame (60fps)
    requestAnimationFrame(animate)

    // ============================================
    // 6.1 ANIMAÇÃO DA TAMPA (E DA TELA POR HERANÇA)
    // ============================================
    if (screenLid) {
      // Controle da abertura da tampa
      // Valores para experimentar:
      // -0.5 = pouca abertura
      // -1.0 = abertura média
      // -1.5 = abertura grande
      // -Math.PI/2 = 90 graus (-1.57)
      const target = -1.2 // Ângulo alvo em radianos

      // Interpolação suave (5% por frame)
      screenLid.rotation.x += (target - screenLid.rotation.x) * 0.05

      console.log('Ângulo atual da Tampa:', screenLid.rotation.x.toFixed(3))
    }

    // ============================================
    // 6.2 RENDERIZAÇÃO FINAL
    // ============================================
    renderer.render(scene, camera)
  }

  // ============================================
  // 7. TRATAMENTO DE REDIMENSIONAMENTO DA JANELA
  // ============================================
  window.addEventListener('resize', () => {
    if (!canvas3d.value) return

    // Atualiza proporção da câmera
    camera.aspect = canvas3d.value.clientWidth / canvas3d.value.clientHeight
    camera.updateProjectionMatrix() // Recalcula matriz de projeção

    // Ajusta tamanho do renderizador
    renderer.setSize(canvas3d.value.clientWidth, canvas3d.value.clientHeight)
  })
})
</script>

<style lang="sass" scoped>
section.insano
  display: flex
  flex-direction: row
  align-items: center
  justify-content: space-between
  width: 100%
  min-height: 100dvh
  background: linear-gradient(0deg, #0F1119, #090F26)
  position: relative
  overflow: hidden

  .canvas
    position: absolute
    width: 55%
    height: 140%
    right: 0
    bottom: 0
    z-index: 4

  .texto
    display: flex
    flex-direction: column
    align-items: flex-start
    width: 60%
    padding: 0 0 0 180px
    z-index: 5

    .titulo
      font-family: var(--semibold)
      font-weight: 900
      font-size: var(--f10)
      color: var(--cor-branco)

      &.dois
        color: var(--cor-roxo)

    p
      font-family: var(--light)
      font-size: 20px
      color: var(--cor-cinza)
      line-height: 1.5
      margin: 15px 0 25px 0

    a
      font-family: var(--semibold)
      font-size: 20px
      color: var(--cor-branco)
      background-color: var(--cor-roxo)
      padding: 20px 40px
      border-radius: 50px
      transition: all 0.3s

      &:hover
        background-color: var(--cor-branco)
        color: var(--cor-roxo)
        box-shadow: 0 0 25px var(--cor-roxo)

  .blush
    position: absolute
    width: 2000px
    height: 2000px
    border-radius: 50%
    background: radial-gradient(circle at center, #6200EA, #6200EA00 60%)
    z-index: 2

    &.um
      top: -1150px
      left: -1150px
      opacity: 0.5

    &.dois
      bottom: -1150px
      right: -1150px

@media screen and (max-width: 1000px)
  section.insano
    flex-direction: column

    .canvas.um
      width: 600px
      height: 600px
      right: auto

    .canvas.dois
      position: absolute
      width: 100%
      height: 50%
      right: 0
      bottom: auto
      top: 0
      z-index: 4

    .texto
      align-items: center
      text-align: center
      width: 100%
      padding: 150px 30px 0 30px

      .titulo
        font-size: var(--f7)

      p
        font-size: var(--f3)
        max-width: 500px

    .blush
      width: 1000px
      height: 1000px

      &.um
          top: -500px
          left: -500px

      &.dois
          bottom: -500px
          right: -500px
</style>
