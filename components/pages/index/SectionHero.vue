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
  </section>
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
  const camera = new THREE.PerspectiveCamera(35, canvas3d.value.clientWidth / canvas3d.value.clientHeight, 0.1, 100)
  camera.position.set(0, 0.2, 4)

  /* ===============================
   * RENDERER
   * =============================== */
  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true
  })
  renderer.setSize(canvas3d.value.clientWidth, canvas3d.value.clientHeight)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  canvas3d.value.appendChild(renderer.domElement)

  /* ===============================
   * LUZES
   * =============================== */
  scene.add(new THREE.AmbientLight(0xffffff, 0.6))

  const dirLight = new THREE.DirectionalLight(0xffffff, 1)
  dirLight.position.set(5, 10, 5)
  scene.add(dirLight)

  /* ===============================
   * LOADERS
   * =============================== */
  const gltfLoader = new GLTFLoader()
  const textureLoader = new THREE.TextureLoader()

  let screenLid = null
  let screenMesh = null

  let openProgress = 0
  const targetAngle = -1.3 // ângulo de abertura

  /* ===============================
   * MODELO
   * =============================== */
  gltfLoader.load('/images/macbook_mockup.glb', (gltf) => {
    const model = gltf.scene

    model.scale.set(0.8, 0.8, 0.8)
    model.position.set(0, -0.6, 0)
    model.rotation.y = -0.5

    // --- TAMPA ---
    screenLid = model.getObjectByName('Screen')
    console.log('Screen (tampa):', screenLid)

    // --- BUSCA DA TELA ---
    model.traverse((child) => {
      if (child.isMesh && child.name.toLowerCase().includes('screen')) {
        screenMesh = child
      }
    })

    console.log('screen (tela):', screenMesh)

    /* ===============================
     * APLICA IMAGEM NA TELA
     * =============================== */
    if (screenMesh) {
      textureLoader.load('/images/certificado.webp', (texture) => {
        texture.colorSpace = THREE.SRGBColorSpace
        texture.flipY = false

        screenMesh.material = new THREE.MeshStandardMaterial({
          map: texture,
          emissiveMap: texture,
          emissive: new THREE.Color(0xffffff),
          emissiveIntensity: 0.4,
          roughness: 0.6,
          metalness: 0
        })

        // evita z-fighting com a tampa
        screenMesh.position.z += 0.01
      })
    }

    scene.add(model)
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
  window.addEventListener('resize', () => {
    camera.aspect = canvas3d.value.clientWidth / canvas3d.value.clientHeight
    camera.updateProjectionMatrix()
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
    z-index: 0

    &.um
      top: -1150px
      left: -1150px
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
</style>
