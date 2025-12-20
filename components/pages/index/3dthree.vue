<template>
  <section class="hero">
    <div class="elemento" ref="canvasContainer"></div>
  </section>
</template>

<script setup>
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

const canvasContainer = ref(null)

function criar3d() {
  const width = canvasContainer.value.clientWidth
  const height = canvasContainer.value.clientHeight

  const scene = new THREE.Scene()

  const camera = new THREE.PerspectiveCamera(4, width / height, 0.1, 500)
  camera.position.set(0, 0, 4)

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
  renderer.setSize(width, height)
  canvasContainer.value.appendChild(renderer.domElement)

  // Posição base do modelo
  const posicaoBase = { x: 1, y: 1, z: 3 }
  const rotacaoBase = { x: 1, y: -0.2, z: 0 }

  // Posição alvo baseada no mouse
  const mouseTarget = { x: 0, y: 0 }
  const mouseSmooth = { x: 0, y: 0 }

  let model, directionalLight

  const loader = new GLTFLoader()
  loader.load('/images/pata3d.glb', (gltf) => {
    model = gltf.scene
    scene.add(model)
    scene.add(new THREE.AmbientLight(0xffffff, 0.2))

    directionalLight = new THREE.DirectionalLight(0xffffff, 0.5)
    scene.add(directionalLight)
  })

  // Evento de movimento do mouse
  const handleMouseMove = (event) => {
    const rect = canvasContainer.value.getBoundingClientRect()
    // Normalizar coordenadas do mouse para -1 a 1
    mouseTarget.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
    mouseTarget.y = -((event.clientY - rect.top) / rect.height) * 2 + 1
  }

  canvasContainer.value.addEventListener('mousemove', handleMouseMove)

  let time = 0
  const animate = () => {
    requestAnimationFrame(animate)
    time += 0.01

    // Suavizar movimento do mouse (lerp)
    const smoothFactor = 0.03
    mouseSmooth.x += (mouseTarget.x - mouseSmooth.x) * smoothFactor
    mouseSmooth.y += (mouseTarget.y - mouseSmooth.y) * smoothFactor

    if (model) {
      // Aplicar deslocamento baseado no mouse
      const moveRange = 0.5
      model.position.x = posicaoBase.x + mouseSmooth.x * moveRange
      model.position.y = posicaoBase.y + mouseSmooth.y * moveRange
      model.position.z = posicaoBase.z

      // Rotação baseada no mouse + animação sutil
      model.rotation.x = rotacaoBase.x + mouseSmooth.y * 0.3 + Math.sin(time * 0.1) * 0.05
      model.rotation.y = rotacaoBase.y - mouseSmooth.x * 0.4 + Math.cos(time * 0.5) * 0.1
      model.rotation.z = rotacaoBase.z + mouseSmooth.x * 0.2 + Math.sin(time * 1) * 0.05
    }

    // Câmera orbital suave
    const radius = 1.2 + Math.sin(time * 0.3) * 0.5
    const angle = time * 0.2
    const verticalAngle = Math.sin(time * 0.25) * Math.PI * 0.2
    const elevation = Math.sin(time * 0.2) * 0.2
    const baseZoom = 3
    const zoomVariation = Math.sin(time * 0.15) * 0.1

    const horizontalRadius = radius * Math.cos(verticalAngle)
    const verticalRadius = radius * Math.sin(verticalAngle)

    const centerX = posicaoBase.x + mouseSmooth.x * 0.3
    const centerY = posicaoBase.y + mouseSmooth.y * 0.3
    const centerZ = posicaoBase.z

    camera.position.x = centerX + Math.cos(angle) * horizontalRadius
    camera.position.y = centerY + elevation + verticalRadius
    camera.position.z = centerZ + Math.sin(angle) * horizontalRadius + baseZoom + zoomVariation

    camera.lookAt(centerX, centerY, centerZ)

    renderer.render(scene, camera)
  }
  animate()

  window.addEventListener('resize', () => {
    const newWidth = canvasContainer.value.clientWidth
    const newHeight = canvasContainer.value.clientHeight
    camera.aspect = newWidth / newHeight
    camera.updateProjectionMatrix()
    renderer.setSize(newWidth, newHeight)
  })
}

onMounted(() => {
  criar3d()
})
</script>

<style lang="sass" scoped>
section.hero
  display: flex

  .elemento
    width: 100%
    height: 100dvh
    cursor: pointer

@media screen and (max-width: 1000px)
</style>
