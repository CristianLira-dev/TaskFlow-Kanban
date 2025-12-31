<template>
  <section class="tarefas">
    <div class="title-row">
      <h1 class="titulo">Gerenciador de Tarefas</h1>
    </div>

    <div class="controles">
      <div class="grupo-esquerda">
        <div class="buscar">
          <input v-model="busca" type="text" placeholder="Procurar por nome da tarefa" />
          <Svgs nome="lupa" class="icon-lupa" />
        </div>

        <button class="btn-filtro" type="button">
          <Svgs nome="filtro" class="icon-filtro" />
          <span>Filtros</span>
        </button>

        <div class="toggle-views" role="tablist" aria-label="Visualizações">
          <button class="btn-view" :class="{ ativa: view === 'kanban' }" @click="setView('kanban')" aria-pressed="view === 'kanban'">
            <Svgs nome="kanban" class="icon-kanban" />
            <span>Kanban</span>
          </button>
          <button class="btn-view" :class="{ ativa: view === 'tabela' }" @click="setView('tabela')" aria-pressed="view === 'tabela'">
            <Svgs nome="tabela" class="icon-tabela" />
            <span>Tabela</span>
          </button>
        </div>
      </div>

      <div class="grupo-direita">
        <div class="acoes-direita">
          <button class="btn-adicionar-coluna" type="button" @click="kanbanStore.abrirModalAddColuna()">
            <Svgs nome="mais" class="icon-mais-coluna" />
            <span>Adicionar Coluna</span>
          </button>

          <button class="btn-adicionar" type="button">
            <Svgs nome="mais" class="icon-mais" />
            <span>Adicionar Tarefa</span>
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import { useKanbanStore } from '@/stores/useKanbanStore'

const kanbanStore = useKanbanStore()

const busca = ref('')
const view = ref('kanban')

const setView = (v) => {
  view.value = v
}

// emits handled by parent (ex: add-column)
</script>

<style lang="sass" scoped>
.tarefas
  padding: 18px
  background-color: transparent
  border-radius: 8px

  .title-row
    display: flex
    align-items: center
    justify-content: space-between
    margin-bottom: 30px

    .titulo
      font-family: var(--semibold)
      font-size: var(--f5)
      color: var(--cor-branco)
      margin: 0

  .controles
    display: flex
    align-items: center
    justify-content: space-between
    gap: 20px
    padding: 0 0 20px 0
    border-bottom: solid 2px var(--cor-escuro-4)

    .grupo-esquerda
      display: flex
      align-items: center
      gap: 20px

      .btn-filtro
        display: inline-flex
        align-items: center
        gap: 8px
        padding: 8px 12px
        border-radius: 8px
        background: transparent
        border: 1px solid rgba(255,255,255,0.06)
        color: var(--cor-branco)
        cursor: pointer
        font-family: var(--light)

        .icon-filtro
          width: 18px
          height: 18px
          fill: var(--cor-branco)

      .buscar
        position: relative

        input
          height: 40px
          padding: 8px 36px 8px 12px
          border-radius: 8px
          border: 1px solid rgba(255,255,255,0.06)
          background: transparent
          color: var(--cor-branco)
          font-family: var(--light)
          width: 400px

        .icon-lupa
          position: absolute
          right: 12px
          top: 50%
          transform: translateY(-50%)
          width: 16px
          height: 16px
          fill: var(--cor-branco)
          pointer-events: none

      .toggle-views
        font-family: var(--light)
        display: flex
        gap: 10px

        .btn-view
          display: inline-flex
          align-items: center
          gap: 8px
          padding: 8px 16px
          border-radius: 8px
          background: transparent
          border: 1px solid rgba(255,255,255,0.06)
          color: var(--cor-branco)
          cursor: pointer

          .icon-kanban, .icon-tabela
            width: 18px
            height: 18px
            fill: var(--cor-branco)

          &.ativa
            background: var(--cor-branco)
            color: var(--cor-preto)
            .icon-kanban, .icon-tabela
              fill: var(--cor-preto)

    .grupo-direita
      .acoes-direita
        display: flex
        align-items: center
        gap: 12px

        .btn-adicionar-coluna
          display: inline-flex
          align-items: center
          gap: 8px
          padding: 17px 34px
          border-radius: 8px
          background: rgba(255,255,255,0.04)
          font-family: var(--light)
          color: var(--cor-branco)
          border: 1px solid rgba(255,255,255,0.06)
          cursor: pointer
          transition: all 0.3s

          &:hover
            border: 1px solid var(--cor-branco)

          .icon-mais-coluna
            width: 16px
            height: 16px
            fill: var(--cor-branco)

      .btn-adicionar
        display: inline-flex
        align-items: center
        gap: 10px
        padding: 17px 34px
        border-radius: 10px
        background: linear-gradient(130deg, var(--cor-verde-escuro-3) 0%, var(--cor-verde) 120%)
        color: var(--cor-branco)
        font-family: var(--semibold)
        cursor: pointer
        border: none
        font-size: var(--f2)
        transition: all 0.5s ease

        &:hover
          filter: brightness(1.25)

        .icon-mais
          width: 20px
          height: 20px
          fill: var(--cor-branco)
          transition: fill 0.3s ease
</style>
