<template>
  <section class="tarefas">
    <SectionButtons></SectionButtons>
    <SectionKanban ref="kanbanRef"></SectionKanban>

    <ModalAddColuna :show="kanbanStore.modalAddColumnOpen" @close="kanbanStore.fecharModalAddColuna()" @save="kanbanStore.adicionarColuna" />
  </section>
</template>

<script setup>
import SectionButtons from './SectionButtons.vue'
import SectionKanban from './SectionKanban.vue'
import { ref } from 'vue'
import { useKanbanStore } from '@/stores/useKanbanStore'

const kanbanStore = useKanbanStore()

const kanbanRef = ref(null)
</script>

<style lang="sass" scoped></style>
