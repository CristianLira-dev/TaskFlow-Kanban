<template>
  <section class="tarefas">
    <SectionButtons v-model="viewAtual" />

    <SectionKanban v-if="viewAtual === 'kanban'" key="kanban" />
    <SectionTabela v-else-if="viewAtual === 'tabela'" key="tabela" />

    <!-- ✅ Modais movidos para o componente pai -->
    <ModalAddColuna :show="kanbanStore.modalAddColumnOpen" @close="kanbanStore.fecharModalAddColuna" @save="salvarNovaColuna" />

    <ModalAddTarefa :show="kanbanStore.modalAddTaskOpen" @close="kanbanStore.fecharModalAddTarefa" @save="salvarNovaTarefa" />
  </section>
</template>

<script setup>
import { ref } from 'vue'
import SectionButtons from './SectionButtons.vue'
import SectionKanban from './SectionKanban.vue'
import SectionTabela from './SectionTabela.vue'
import ModalAddColuna from '../../global/modalAddColuna/ModalAddColuna.vue'
import ModalAddTarefa from '../../global/modalAddTarefa/ModalAddTarefa.vue'
import { useKanbanStore } from '@/stores/useKanbanStore'

const kanbanStore = useKanbanStore()
const viewAtual = ref('kanban')

// ✅ Handlers centralizados no componente pai
const salvarNovaColuna = (dados) => {
  kanbanStore.adicionarColuna(dados)
}

const salvarNovaTarefa = (dados) => {
  kanbanStore.adicionarTarefa(dados)
}
</script>

<style lang="sass" scoped>
.tarefas
  width: 100%
  min-height: 100vh
</style>
