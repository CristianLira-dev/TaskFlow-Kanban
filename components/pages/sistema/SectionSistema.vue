<template>
  <section :class="['sistema-page', { 'coluna-recolhida': isCollapsed }]">
    <div class="coluna-perfil">
      <!-- Cabeçalho da coluna lateral -->
      <div class="cabecalho-coluna">
        <div class="logo-titulo">
          <Svgs v-show="!isCollapsed" nome="taskflow" class="logo" />
          <h1 class="marca" v-show="!isCollapsed">TaskFlow</h1>
        </div>

        <button class="botao-recolher" @click="toggleColuna" :aria-label="isCollapsed ? 'Expandir barra lateral' : 'Recolher barra lateral'">
          <Svgs :nome="isCollapsed ? 'arrow-right' : 'arrow-left'" class="icone-recolher" />
        </button>
      </div>

      <!-- Conteúdo da coluna lateral (apenas quando expandida) -->
      <div class="conteudo-perfil" v-show="!isCollapsed">
        <!-- Seção de tarefas do usuário -->
        <div class="perfil-tarefas">
          <button class="botao-tarefas" :class="{ ativa: selectedPerfil === 'tarefas' }" @click="selectPerfil('tarefas')" :aria-pressed="selectedPerfil === 'tarefas'" aria-label="Mostrar tarefas">
            <Svgs nome="task" class="icone-tarefas" />
            <span class="texto-tarefas">Tarefas</span>
          </button>
        </div>

        <div class="perfil-tarefas-ocultas">
          <button class="botao-tarefas" :class="{ ativa: selectedPerfil === 'ocultas' }" @click="selectPerfil('ocultas')" :aria-pressed="selectedPerfil === 'ocultas'" aria-label="Mostrar tarefas ocultas">
            <Svgs nome="olho" class="icone-tarefas" />
            <span class="texto-tarefas">Tarefas Ocultas</span>
          </button>
        </div>

        <!-- Perfil do usuário -->
        <div class="perfil-usuario" v-show="!isCollapsed">
          <div class="avatar">
            <img :src="usuario.avatar" :alt="usuario.nome" />
          </div>
          <div class="info-usuario">
            <h3>{{ usuario.nome }}</h3>
            <p>{{ usuario.email }}</p>
          </div>
          <button class="botao-config" @click="modalSettingsOpen = true">
            <Svgs nome="settings" />
          </button>
        </div>
      </div>

      <!-- Versão recolhida (apenas ícones) -->
      <div class="coluna-recolhida-conteudo" v-show="isCollapsed">
        <div class="logo-recolhida"></div>

        <div class="menu-recolhido">
          <button class="botao-recolhido" :class="{ ativa: selectedPerfil === 'tarefas' }" @click="selectPerfil('tarefas')" aria-label="Tarefas" title="Tarefas">
            <Svgs nome="task" />
          </button>

          <button class="botao-recolhido" :class="{ ativa: selectedPerfil === 'ocultas' }" @click="selectPerfil('ocultas')" aria-label="Tarefas Ocultas" title="Tarefas Ocultas">
            <Svgs nome="olho" />
          </button>
        </div>

        <div class="avatar-recolhida">
          <button class="botao-avatar" aria-label="Perfil do usuário">
            <img :src="usuario.avatar" :alt="usuario.nome" />
          </button>
        </div>
      </div>
    </div>

    <div class="page-tarefas">
      <!-- Área principal de tarefas -->
      <slot></slot>
    </div>
    <ModalSettings :show="modalSettingsOpen" :usuario="usuario" @close="modalSettingsOpen = false" @save="onSaveSettings" />
    <ModalAutenticacao class="modalSucessSettings" :show="modalAutenticacaoOpen" :title="tituloModal" :message="mensagemModal" @close="modalAutenticacaoOpen = false" />
  </section>
</template>

<script setup>
import { ref } from 'vue'
import ModalSettings from '../../modalSettings/ModalSettings.vue'
import ModalAutenticacao from '../../global/modalAutenticacao/ModalAutenticacao.vue'

const isCollapsed = ref(false)

// Perfil selecionado ('tarefas' | 'ocultas')
const selectedPerfil = ref('tarefas')

// Dados de exemplo
const usuario = ref({
  nome: 'Cristian Albertino de Lira',
  email: 'cristianfilho@email.com',
  avatar: '/images/dog.jpg'
})

const toggleColuna = () => {
  isCollapsed.value = !isCollapsed.value
}

const selectPerfil = (nome) => {
  selectedPerfil.value = nome
}

const modalSettingsOpen = ref(false)

// estado do modal de sucesso (ModalAutenticacao)
const modalAutenticacaoOpen = ref(false)
const mensagemModal = ref('')

const onSaveSettings = (dados) => {
  // Atualiza os dados do usuário com os valores do modal
  usuario.value = { ...usuario.value, ...dados }
  modalSettingsOpen.value = false

  // abrir modal de sucesso
  mensagemModal.value = 'Configurações salvas com sucesso!'
  modalAutenticacaoOpen.value = true
}
</script>

<style lang="sass" scoped>
.sistema-page
  display: flex
  height: 100dvh
  transition: all 0.3s ease
  background-color: var(--cor-escuro-3)

  .modalSucessSettings
    margin: 0 0 0 20px

  &.coluna-recolhida
    .coluna-perfil
      width: 80px

    .page-tarefas
      margin-left: 80px

  .coluna-perfil
    position: fixed
    left: 0
    top: 0
    bottom: 0
    width: 320px
    background-color: var(--cor-escuro-1)
    display: flex
    flex-direction: column
    transition: all 0.3s ease
    z-index: 100
    overflow-y: auto
    overflow-x: hidden

    .cabecalho-coluna
      display: flex
      justify-content: space-between
      align-items: center
      padding: 24px 20px
      border-bottom: 1px solid var(--cor-escuro-2)

      .logo-titulo
        display: flex
        align-items: center
        gap: 12px

        .logo
          width: 36px
          height: 36px

        .marca
          font-family: var(--semibold)
          font-size: var(--f3)
          color: var(--cor-branco)
          margin: 0

      .botao-recolher
        background: transparent
        border: none
        cursor: pointer
        padding: 10px
        border-radius: 50%
        transition: background-color 0.3s

        &:hover
          background-color: var(--cor-escuro-3)

        svg
          width: 20px
          height: 20px
          fill: var(--cor-branco)

    .conteudo-perfil
      flex: 1
      padding: 20px
      display: flex
      flex-direction: column
      gap: 24px

      .perfil-tarefas, .perfil-tarefas-ocultas
        .botao-tarefas
          display: inline-flex
          align-items: center
          width: 100%
          gap: 10px
          background: transparent
          border: none
          color: var(--cor-branco)
          padding: 8px 12px
          border-radius: 12px
          cursor: pointer
          transition: background-color 0.2s, color 0.2s

          .icone-tarefas
            width: 35px
            height: 35px
            fill: var(--cor-branco)
            color: var(--cor-branco)

          .texto-tarefas
            font-family: var(--semibold)
            font-size: var(--f2)
            color: var(--cor-branco)

          &.ativa
            background-color: var(--cor-branco)
            .texto-tarefas
              color: var(--cor-preto, #000)
            .icone-tarefas
              fill: var(--cor-preto, #000)
              color: var(--cor-preto, #000)


        h3
          font-family: var(--semibold)
          font-size: var(--f1)
          color: var(--cor-branco)
          max-width: 142px
          margin: 0 0 4px 0

        p
          font-family: var(--light)
          font-size: var(--f1)
          color: var(--cor-cinza)
          max-width: 142px
          margin: 0

      .perfil-usuario
        margin-top: auto
        display: flex
        align-items: center
        gap: 12px
        padding: 16px
        background: var(--cor-escuro-1)
        border-top: 1px solid var(--cor-escuro-2)

        .avatar
          width: 50px
          height: 50px
          border-radius: 50%
          overflow: hidden

          img
            width: 100%
            height: 100%
            object-fit: cover

        .info-usuario
          flex: 1

          h3
            font-family: var(--semibold)
            font-size: var(--f2)
            color: var(--cor-branco)
            margin: 0 0 4px 0
            max-width: 142px
            white-space: nowrap
            overflow: hidden
            text-overflow: ellipsis

          p
            font-family: var(--light)
            font-size: var(--f1)
            color: var(--cor-cinza)
            margin: 0
            max-width: 142px
            white-space: nowrap
            overflow: hidden
            text-overflow: ellipsis

        .botao-config
          background: none
          border: none
          cursor: pointer
          padding: 6px 6px 4px 6px
          border-radius: 6px
          transition: background-color 0.2s

          &:hover
            background-color: var(--cor-escuro-3)

          svg
            width: 20px
            height: 20px
            fill: var(--cor-cinza-claro)

    .coluna-recolhida-conteudo
      display: flex
      flex-direction: column
      align-items: center
      padding:  24px 0
      height: 100%


      .menu-recolhido
        display: flex
        flex-direction: column
        gap: 12px
        align-items: center

        .botao-recolhido
          background: transparent
          border: none
          cursor: pointer
          padding: 10px
          border-radius: 10px
          display: inline-flex
          align-items: center
          justify-content: center
          transition: background-color 0.15s, color 0.15s

          svg, .icon-svg
            width: 30px
            height: 30px
            fill: var(--cor-branco)
            color: var(--cor-cinza-claro)

          &:hover
            background-color: rgba(255,255,255,0.05)

          &.ativa
            background-color: var(--cor-branco)

            svg, .icon-svg
              fill: var(--cor-preto, #000)
              color: var(--cor-preto, #000)

      .avatar-recolhida
        margin-top: auto
        padding-bottom: 20px

        .botao-avatar
          background: transparent
          border: none
          cursor: pointer
          width: 48px
          height: 48px
          padding: 0
          border-radius: 50%
          overflow: hidden

          img
            width: 100%
            height: 100%
            object-fit: cover

  .page-tarefas
    flex: 1
    height: 100%
    background-color: var(--cor-escuro-3)
    margin-left: 320px
    transition: margin-left 0.3s ease
    overflow-y: auto
</style>
