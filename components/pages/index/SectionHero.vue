<template>
  <section class="insano">
    <div class="texto">
      <h1 class="titulo um">Menos bagunça,</h1>
      <h1 class="titulo dois">Mais progresso.</h1>
      <p>Planeje, organize e mova suas tarefas com fluidez usando quadros inteligentes.</p>
      <NuxtLink to="login">Aumentar Produtividade</NuxtLink>
    </div>
    <!-- Canvas do notebook 3D -->
    <div class="canvas" ref="canvas3d"></div>
  </section>
  <div class="blush um"></div>
  <div class="blush dois"></div>
</template>

<script setup>
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

const canvas3d = ref(null)

onMounted(() => {
  /* ===============================
   * CENA
   * =============================== */
  const scene = new THREE.Scene()

  /* ===============================
   * CÂMERA
   * =============================== */
  const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100)
  camera.position.set(0, 0.2, 4)

  /* ===============================
   * RENDERER
   * =============================== */
  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true
  })
  canvas3d.value.appendChild(renderer.domElement)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

  /* ===============================
   * LUZES
   * =============================== */
  scene.add(new THREE.AmbientLight(0xffffff, 0.6))

  const dirLight = new THREE.DirectionalLight(0xffffff, 1)
  dirLight.position.set(5, 10, 5)
  scene.add(dirLight)

  /* ===============================
   * VIDEO
   * =============================== */
  const video = document.createElement('video')
  video.src = '/videos/video_fofo.mp4'
  video.muted = true
  video.loop = true
  video.playsInline = true
  video.autoplay = true

  const videoTexture = new THREE.VideoTexture(video)
  videoTexture.colorSpace = THREE.SRGBColorSpace
  videoTexture.flipY = true

  /* ===============================
   * VARIÁVEIS
   * =============================== */
  const gltfLoader = new GLTFLoader()

  let macbookModel = null
  let screenLid = null
  let screenMesh = null

  let openProgress = 0
  const targetAngle = -1.4

  /* ===============================
   * RESPONSIVO (JS)
   * =============================== */
  function updateResponsive() {
    if (!canvas3d.value) return

    const isMobile = window.innerWidth < 1000

    if (isMobile) {
      // canvas abaixo do texto
      canvas3d.value.style.position = 'relative'
      canvas3d.value.style.width = '100%'
      canvas3d.value.style.height = '380px'
      canvas3d.value.style.padding = '0 20px'

      camera.position.set(0, 0.15, 3)

      if (macbookModel) {
        macbookModel.scale.set(1, 1, 1)
        macbookModel.position.set(-0.27, -0.6, 0)
        macbookModel.rotation.y = -0.5
      }
    } else {
      // desktop
      canvas3d.value.style.position = 'absolute'
      canvas3d.value.style.width = '55%'
      canvas3d.value.style.height = '140%'
      canvas3d.value.style.padding = '0'
      canvas3d.value.style.marginTop = '0'

      camera.position.set(0, 0.2, 4)

      if (macbookModel) {
        macbookModel.scale.set(0.8, 0.8, 0.8)
        macbookModel.position.set(-0.2, -0.7, 0)
        macbookModel.rotation.y = -0.6
      }
    }

    const width = canvas3d.value.clientWidth
    const height = canvas3d.value.clientHeight

    renderer.setSize(width, height)
    camera.aspect = width / height
    camera.updateProjectionMatrix()
  }

  /* ===============================
   * MODELO
   * =============================== */
  gltfLoader.load('/images/invert_macbook_mockup.glb', (gltf) => {
    macbookModel = gltf.scene

    // tampa
    screenLid = macbookModel.getObjectByName('tracking_node_placeholder_69')

    // tela
    screenMesh = macbookModel.getObjectByName('Object_123')

    // base / teclado
    const floor = macbookModel.getObjectByName('floor')
    if (floor) {
      floor.rotation.x = -3.1
      floor.rotation.y = -0.34
      floor.rotation.z = 24.91
    }

    // aplica vídeo na tela
    if (screenMesh && screenMesh.isMesh) {
      screenMesh.material = new THREE.MeshStandardMaterial({
        map: videoTexture,
        emissiveMap: videoTexture,
        emissive: new THREE.Color(0xffffff),
        emissiveIntensity: 0.6,
        roughness: 0.5,
        metalness: 0
      })

      screenMesh.position.z += 0.002
    }

    scene.add(macbookModel)

    video.play()
    updateResponsive()
    animate()
  })

  /* ===============================
   * ANIMAÇÃO
   * =============================== */
  function animate() {
    requestAnimationFrame(animate)

    if (screenLid && openProgress < 1) {
      openProgress += 0.02
      const eased = 1 - Math.pow(1 - openProgress, 3)
      screenLid.rotation.x = targetAngle * eased
    }

    renderer.render(scene, camera)
  }

  /* ===============================
   * RESIZE
   * =============================== */
  window.addEventListener('resize', updateResponsive)
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
  position: relative
  overflow: hidden

  .canvas
    position: absolute
    width: 55%
    height: 140%
    right: 0
    bottom: 0
    z-index: 10

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
      transition: all 0.4s

      &:hover
        box-shadow: 0 0 25px var(--cor-roxo)

.blush
  position: absolute
  width: 2000px
  height: 2000px
  border-radius: 50%
  background: radial-gradient(circle at center, #6200EA, #6200EA00 60%)
  z-index: 0

  &.um
    top: -1150px
    left: -1150px
    opacity: 0.5

  &.dois
    bottom: -1150px
    right: -1150px
    opacity: 0.5

@media screen and (max-width: 1000px)
  section.insano
    flex-direction: column

    .canvas
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
