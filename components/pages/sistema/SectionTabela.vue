<template>
  <section class="tabela-container">
    <div class="tabela-header-info">
      <span>Exibindo {{ tarefas.length }} tarefas</span>
    </div>

    <div class="table-responsive">
      <table class="tabela-custom" v-if="tarefas.length > 0">
        <thead>
          <tr>
            <th scope="col">Status</th>
            <th scope="col" class="col-tarefa">Tarefa</th>
            <th scope="col">Descrição</th>
            <th scope="col">Prioridade</th>
            <th scope="col">Data</th>
            <th scope="col" class="text-right">Ações</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="task in tarefas" :key="task.id">
            <td>
              <span class="badge status" :style="getStatusStyle(task.columnId)">
                <span class="dot"></span>
                {{ getColumnTitle(task.columnId) }}
              </span>
            </td>

            <td class="col-tarefa">
              <div class="tarefa-info">
                <span class="nome-tarefa">{{ task.title }}</span>
              </div>
            </td>

            <td>
              <span v-if="task.description" class="descricao-texto">{{ task.description }}</span>
              <span v-else class="descricao-vazia">-</span>
            </td>

            <td>
              <span class="badge prioridade" :class="getPriorityClass(task.priority)">
                {{ formatarPrioridade(task.priority) }}
              </span>
            </td>

            <td class="data-prazo">
              {{ task.createdAt }}
            </td>

            <td class="text-right">
              <button class="btn-icon-action" aria-label="Editar" title="Editar tarefa" @click="editarTarefa(task)">
                <Svgs nome="editar" />
              </button>
              <button class="btn-icon-action" @click="removerTarefa(task.id)" title="Excluir tarefa">
                <Svgs nome="lixeira" />
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <div v-if="tarefas.length === 0" class="empty-state">
        <p>Nenhuma tarefa encontrada.</p>
        <p class="empty-subtitle">Adicione tarefas para visualizá-las aqui.</p>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useKanbanStore } from '@/stores/useKanbanStore'

const kanbanStore = useKanbanStore()

// ✅ Usar computed para garantir reatividade
const tarefas = computed(() => kanbanStore.tasks)
const colunas = computed(() => kanbanStore.columns)

// Obtém o título da coluna pelo ID
const getColumnTitle = (columnId) => {
  const column = colunas.value.find((col) => col.id === columnId)
  return column ? column.title : 'Sem Status'
}

// Obtém a cor da coluna pelo ID
const getColumnColor = (columnId) => {
  const column = colunas.value.find((col) => col.id === columnId)
  if (!column) return '#10b981'

  if (column.color) return column.color

  const title = (column.title || '').toLowerCase()
  if (title.includes('fazer')) return '#3b82f6'
  if (title.includes('fazendo')) return '#f59e0b'
  if (title.includes('feito')) return '#10b981'
  return '#10b981'
}

// Estilo do badge de status
const getStatusStyle = (columnId) => {
  const color = getColumnColor(columnId)
  return {
    background: `rgba(${hexToRgb(color)}, 0.15)`,
    color: color,
    border: `1px solid rgba(${hexToRgb(color)}, 0.3)`
  }
}

// Converte hex para rgb
const hexToRgb = (hex) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  if (!result) return '16, 185, 129'
  return `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
}

// Classes de prioridade
const getPriorityClass = (priority) => {
  return {
    'priority-baixa': priority === 'baixa',
    'priority-media': priority === 'media',
    'priority-alta': priority === 'alta'
  }
}

// Formatar texto da prioridade
const formatarPrioridade = (prioridade) => {
  const map = {
    alta: 'Alta',
    media: 'Média',
    baixa: 'Baixa'
  }
  return map[prioridade] || prioridade
}

// Ações
const editarTarefa = (task) => {
  console.log('Editar tarefa:', task)
  // Implementar lógica de edição
}

const removerTarefa = (taskId) => {
  if (confirm('Deseja realmente excluir esta tarefa?')) {
    kanbanStore.removerTarefa(taskId)
  }
}

// Debug
onMounted(() => {
  console.log('SectionTabela montada')
  console.log('Colunas:', kanbanStore.columns)
  console.log('Tarefas:', kanbanStore.tasks)
})
</script>

<style lang="sass" scoped>
.tabela-container
  background: rgba(255, 255, 255, 0.02)
  margin: 20px
  border-radius: 12px
  overflow: hidden
  display: flex
  flex-direction: column
  border: 1px solid rgba(255, 255, 255, 0.05)

.tabela-header-info
  padding: 16px 24px
  color: rgba(255, 255, 255, 0.5)
  font-size: var(--f1)
  font-family: var(--light)
  border-bottom: 1px solid rgba(255, 255, 255, 0.05)

.table-responsive
  width: 100%
  overflow-x: auto
  scrollbar-width: thin
  scrollbar-color: var(--cor-verde) transparent

  &::-webkit-scrollbar
    height: 8px

  &::-webkit-scrollbar-track
    background: transparent

  &::-webkit-scrollbar-thumb
    background-color: var(--cor-verde)
    border-radius: 4px

.tabela-custom
  width: 100%
  border-collapse: collapse
  min-width: 1000px

  th, td
    padding: 16px 24px
    text-align: left
    color: var(--cor-branco)
    font-size: var(--f2)
    border-bottom: 1px solid rgba(255, 255, 255, 0.05)

  thead th
    position: sticky
    top: 0
    background-color: var(--cor-escuro-2)
    z-index: 2
    font-family: var(--semibold)
    text-transform: uppercase
    font-size: var(--f1)
    letter-spacing: 1px
    color: rgba(255, 255, 255, 0.7)
    border-bottom: 2px solid rgba(255, 255, 255, 0.1)

  tbody tr
    transition: background 0.2s ease

    &:hover
      background: rgba(255, 255, 255, 0.03)

    &:last-child td
      border-bottom: none

  .col-tarefa
    min-width: 200px

    .tarefa-info
      display: flex
      flex-direction: column
      gap: 4px

      .nome-tarefa
        font-family: var(--semibold)
        font-size: var(--f3)
        color: var(--cor-branco)

      .id-tarefa
        font-size: var(--f1)
        color: rgba(255, 255, 255, 0.4)
        font-family: var(--light)

  .descricao-texto
    color: rgba(255, 255, 255, 0.7)
    font-family: var(--light)
    font-size: var(--f1)
    display: block
    max-width: 300px
    overflow: hidden
    text-overflow: ellipsis
    white-space: nowrap

  .descricao-vazia
    color: rgba(255, 255, 255, 0.3)
    font-family: var(--light)
    font-size: var(--f1)

  .badge
    display: inline-flex
    align-items: center
    gap: 6px
    padding: 6px 12px
    border-radius: 20px
    font-size: var(--f1)
    font-family: var(--semibold)
    white-space: nowrap

    .dot
      width: 6px
      height: 6px
      border-radius: 50%
      background: currentColor

    &.status
      border: 1px solid currentColor

  .badge.prioridade
    &.priority-alta
      color: var(--cor-vermelho)
      background: rgba(201, 6, 19, 0.15)
      border: 1px solid rgba(201, 6, 19, 0.3)

    &.priority-media
      color: var(--cor-amarelo)
      background: rgba(255, 196, 46, 0.15)
      border: 1px solid rgba(255, 196, 46, 0.3)

    &.priority-baixa
      color: var(--cor-azul)
      background: rgba(161, 166, 255, 0.15)
      border: 1px solid rgba(161, 166, 255, 0.3)

  .data-prazo
    color: rgba(255, 255, 255, 0.6)
    font-family: var(--light)
    font-size: var(--f1)
    white-space: nowrap

  .btn-icon-action
    background: transparent
    border: none
    padding: 8px
    border-radius: 6px
    cursor: pointer
    color: rgba(255, 255, 255, 0.5)
    transition: all 0.2s ease
    display: inline-flex
    align-items: center
    justify-content: center
    margin-left: 4px

    &:hover
      background: rgba(255, 255, 255, 0.1)
      color: var(--cor-branco)

    &:last-child:hover
      color: var(--cor-vermelho)
      background: rgba(201, 6, 19, 0.1)

    svg
      width: 16px
      height: 16px
      fill: currentColor

  .text-right
    text-align: right

.empty-state
  padding: 60px 40px
  text-align: center
  color: rgba(255, 255, 255, 0.3)

  p
    font-size: var(--f3)
    font-family: var(--semibold)
    margin: 0 0 8px 0

  .empty-subtitle
    font-size: var(--f1)
    font-family: var(--light)
    color: rgba(255, 255, 255, 0.2)

@media (max-width: 1200px)
  .tabela-custom
    min-width: 900px

  .descricao-texto
    max-width: 200px

@media (max-width: 768px)
  .tabela-container
    margin: 20px 0

  .tabela-header-info
    padding: 12px 16px

  .tabela-custom
    th, td
      padding: 12px 16px
      font-size: var(--f1)

    .col-tarefa
      min-width: 150px

      .tarefa-info .nome-tarefa
        font-size: var(--f2)

  .descricao-texto
    max-width: 150px
</style>
