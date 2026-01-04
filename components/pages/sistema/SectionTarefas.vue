<template>
  <section class="tarefas">
    <SectionButtons v-model="viewAtual" />

    <SectionKanban v-if="viewAtual === 'kanban'" key="kanban" @excluir-coluna="abrirModalExclusaoColuna" @excluir-tarefa="abrirModalExclusaoTarefa" @editar-tarefa="abrirModalEditarTarefa" />
    <SectionTabela v-else-if="viewAtual === 'tabela'" key="tabela" @excluir-tarefa="abrirModalExclusaoTarefa" @editar-tarefa="abrirModalEditarTarefa" />

    <ModalAddColuna :show="kanbanStore.modalAddColumnOpen" @close="kanbanStore.fecharModalAddColuna" @save="salvarOuEditarColuna" />
    <ModalAddTarefa :show="kanbanStore.modalAddTaskOpen" @close="kanbanStore.fecharModalAddTarefa" @save="salvarOuEditarTarefa" />

    <ModalExclusao :show="showDeleteModal" :item="itemParaExcluir" :type="tipoExclusao" @close="fecharModalExclusao" @confirm="confirmarExclusao" />
  </section>
</template>

<script setup>
import { ref } from 'vue'
import SectionButtons from './SectionButtons.vue'
import SectionKanban from './SectionKanban.vue'
import SectionTabela from './SectionTabela.vue'
import ModalAddColuna from '../../global/modalAddColuna/ModalAddColuna.vue'
import ModalAddTarefa from '../../global/modalAddTarefa/ModalAddTarefa.vue'
import ModalExclusao from '../../global/modalExclusao/ModalExclusao.vue'
import { useKanbanStore } from '@/stores/useKanbanStore'

const kanbanStore = useKanbanStore()
const viewAtual = ref('kanban')

const showDeleteModal = ref(false)
const itemParaExcluir = ref(null)
const tipoExclusao = ref('coluna') // 'coluna' ou 'tarefa'

// Função para abrir o modal de exclusão para coluna
const abrirModalExclusaoColuna = (coluna) => {
  itemParaExcluir.value = coluna
  tipoExclusao.value = 'coluna'
  showDeleteModal.value = true
}

// Função para abrir o modal de exclusão para tarefa
const abrirModalExclusaoTarefa = (tarefa) => {
  itemParaExcluir.value = tarefa
  tipoExclusao.value = 'tarefa'
  showDeleteModal.value = true
}

// ✅ NOVO: Função para abrir o modal de editar tarefa
const abrirModalEditarTarefa = (tarefa) => {
  kanbanStore.abrirModalAddTarefa(tarefa)
}

// Fechar o modal
const fecharModalExclusao = () => {
  showDeleteModal.value = false
  setTimeout(() => {
    itemParaExcluir.value = null
    tipoExclusao.value = 'coluna'
  }, 300)
}

// Confirmar exclusão
const confirmarExclusao = () => {
  fecharModalExclusao()
}

// ✅ ATUALIZADO: Função para salvar ou editar coluna
const salvarOuEditarColuna = (dados) => {
  if (dados.id) {
    // Se tem ID, é uma edição
    console.log('Editando coluna:', dados)
    kanbanStore.editarColuna(dados)
  } else {
    // Se não tem ID, é uma nova coluna
    console.log('Adicionando nova coluna:', dados)
    kanbanStore.adicionarColuna(dados)
  }
}

// ✅ NOVO: Função para salvar ou editar tarefa
const salvarOuEditarTarefa = (dados) => {
  if (dados.id) {
    // Se tem ID, é uma edição
    console.log('Editando tarefa:', dados)
    kanbanStore.editarTarefa(dados)
  } else {
    // Se não tem ID, é uma nova tarefa
    console.log('Adicionando nova tarefa:', dados)
    kanbanStore.adicionarTarefa(dados)
  }
}
</script>

<style lang="sass" scoped>
.tarefas
  width: 100%
  min-height: 100vh
</style>
