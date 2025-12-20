<template>
  <SectionHero></SectionHero>
</template>

<script setup>
import SectionHero from '../components/pages/index/SectionHero.vue'

definePageMeta({
  layout: 'web'
})

useHead({
  title: 'TaskFlow',
  meta: [
    { name: 'description', content: 'Aprenda na prática a criar um site com NuxtJS ao vivo nos dias 06 e 07 de Dezembro' },
    { property: 'og:title', content: 'TaskFlow' },
    { property: 'og:description', content: 'Aprenda na prática a criar um site com NuxtJS ao vivo nos dias 06 e 07 de Dezembro' }
  ]
})
</script>
