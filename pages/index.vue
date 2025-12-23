<template>
  <SectionHero></SectionHero>
  <SectionImage></SectionImage>
  <SectionDepoimentos></SectionDepoimentos>
</template>

<script setup>
import SectionHero from '../components/pages/index/SectionHero.vue'
import SectionImage from '../components/pages/index/SectionImage.vue'
import SectionDepoimentos from '../components/pages/index/SectionDepoimentos.vue'

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
