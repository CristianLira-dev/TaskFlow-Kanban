<template>
  <SectionHero></SectionHero>
  <SectionImage></SectionImage>
  <SectionRecursos></SectionRecursos>
  <SectionDepoimentos></SectionDepoimentos>
</template>

<script setup>
import SectionHero from '../components/pages/index/SectionHero.vue'
import SectionImage from '../components/pages/index/SectionImage.vue'
import SectionDepoimentos from '../components/pages/index/SectionDepoimentos.vue'
import SectionRecursos from '../components/pages/index/SectionRecursos.vue'

definePageMeta({
  layout: 'web'
})

useHead({
  title: 'TaskFlow',
  meta: [
    { name: 'description', content: 'TaskFlow é um gerenciador de tarefas visual com quadros Kanban, drag & drop e organização simples para aumentar sua produtividade.' },
    { property: 'og:title', content: 'TaskFlow' },
    { property: 'og:description', content: 'TaskFlow é um gerenciador de tarefas visual com quadros Kanban, drag & drop e organização simples para aumentar sua produtividade.' }
  ]
})
</script>
