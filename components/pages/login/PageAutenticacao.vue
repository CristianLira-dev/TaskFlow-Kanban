<template>
  <section class="autenticacao">
    <div class="container">
      <div class="content first-content">
        <div class="first-column">
          <h2 class="title title-primary">Já Possui um Conta?</h2>
          <p class="description description-primary">Faça seu Login no botão abaixo</p>
          <button id="signin" class="btn btn-primary">Entrar</button>
        </div>
        <div class="second-column">
          <h2 class="title title-second">Criar Conta</h2>
          <p class="description description-second">Coloque seu suas credenciais para efetuar o cadastro</p>
          <form class="form">
            <div class="input-wrapper">
              <label for="nome" class="floating-label">Nome</label>
              <svg class="input-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
              <input type="text" name="nome" id="nome" placeholder="" />
            </div>

            <div class="input-wrapper">
              <label for="emailCadastro" class="floating-label">Email</label>
              <svg class="input-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="2" y="4" width="20" height="16" rx="2"></rect>
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
              </svg>
              <input type="email" name="emailCadastro" id="emailCadastro" placeholder=" " />
            </div>

            <div class="input-wrapper">
              <label for="senhaCadastro" class="floating-label">Senha</label>
              <svg class="input-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
              <input :type="mostrarSenhaCadastro ? 'text' : 'password'" name="senhaCadastro" id="senhaCadastro" placeholder=" " />
              <button type="button" class="toggle-password" @click="mostrarSenhaCadastro = !mostrarSenhaCadastro">
                <svg v-if="!mostrarSenhaCadastro" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                  <line x1="1" y1="1" x2="23" y2="23"></line>
                </svg>
              </button>
            </div>

            <button class="btn btn-second" type="submit">Cadastrar</button>
          </form>
        </div>
      </div>

      <div class="content second-content">
        <div class="first-column">
          <h2 class="title title-primary">Não Possui uma Conta?</h2>
          <p class="description description-primary">Cadastre-se no Botão Abaixo</p>
          <button id="signup" class="btn btn-primary">Cadastrar</button>
        </div>
        <div class="second-column">
          <h2 class="title title-second">Bem Vindo de Volta!</h2>
          <p class="description description-second">Use seu email para efetuar o login</p>
          <form class="form">
            <div class="input-wrapper">
              <label for="email" class="floating-label">Email</label>
              <svg class="input-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="2" y="4" width="20" height="16" rx="2"></rect>
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
              </svg>
              <input type="email" name="email" id="email" placeholder="" />
            </div>

            <div class="input-wrapper">
              <label for="senha" class="floating-label">Senha</label>
              <svg class="input-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
              <input :type="mostrarSenha ? 'text' : 'password'" name="senha" id="senha" placeholder=" " />
              <button type="button" class="toggle-password" @click="mostrarSenha = !mostrarSenha">
                <svg v-if="!mostrarSenha" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                  <line x1="1" y1="1" x2="23" y2="23"></line>
                </svg>
              </button>
            </div>

            <a class="password" href="#">esqueci minha senha</a>
            <button class="btn btn-second" type="submit">Entrar</button>
          </form>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const mostrarSenha = ref(false)
const mostrarSenhaCadastro = ref(false)

onMounted(() => {
  const btnSignin = document.querySelector('#signin')
  const btnSignup = document.querySelector('#signup')
  const autenticacao = document.querySelector('.autenticacao')

  if (btnSignin) {
    btnSignin.addEventListener('click', () => {
      if (autenticacao) {
        autenticacao.className = 'autenticacao sign-in-js'
      }
    })
  }

  if (btnSignup) {
    btnSignup.addEventListener('click', () => {
      if (autenticacao) {
        autenticacao.className = 'autenticacao sign-up-js'
      }
    })
  }
})
</script>

<style lang="sass" scoped>
.autenticacao
  min-height: 100vh
  display: flex
  align-items: center
  justify-content: center
  background: linear-gradient(130deg, var(--cor-azul-forte) 0%, var(--cor-roxo) 350%)

.container
  display: flex
  justify-content: center
  align-items: center
  height: 100vh

.content
  background-color: #fff
  border-radius: 20px
  width: 960px
  height: 50%
  justify-content: space-between
  align-items: center
  position: relative

  &::before
    content: ""
    position: absolute
    background: linear-gradient(130deg, var(--cor-azul-forte) 0%, var(--cor-roxo) 70%, var(--cor-azul-forte) 100%)
    width: 40%
    height: 100%
    border-top-left-radius: 20px
    border-bottom-left-radius: 20px
    left: 0

.title
  font-family: var(--semibold)
  font-size: var(--f4)
  font-weight: bold
  text-transform: capitalize

  &-primary
    color: #fff

  &-second
    color: var(--cor-roxo)

.description
  font-family: var(--light)
  font-size: var(--f1)
  font-weight: 300
  line-height: 30px

  &-primary
    color: #fff

  &-second
    color: #7f8c8d

.btn
  border-radius: 16px
  text-transform: uppercase
  color: #fff
  font-size: var(--f1)
  font-family: var(--semibold)
  padding: 12px 32px
  cursor: pointer
  font-weight: bold
  width: 150px
  align-self: center
  border: none
  margin-top: 1rem

  &-primary
    background-color: transparent
    border: 1px solid #fff
    transition: background-color .5s

    &:hover
      background-color: #fff
      color: var(--cor-roxo)

  &-second
    background-color: var(--cor-roxo)
    border: 1px solid var(--cor-roxo)
    transition: background-color .5s

    &:hover
      background-color: #fff
      border: 1px solid var(--cor-roxo)
      color: var(--cor-roxo)

.first-content
  display: flex

  .second-column
    z-index: 11

.first-column
  text-align: center
  width: 40%
  z-index: 10

.second-column
  width: 60%
  display: flex
  flex-direction: column
  align-items: center

.form
  font-family: var(--light)
  display: flex
  flex-direction: column
  margin: 20px 0 0 0
  width: 55%
  gap: 20px

.input-wrapper
  position: relative
  width: 100%


  input
    height: 56px
    width: 100%
    padding: 18px 48px
    border-radius: 16px
    border: 1.5px solid var(--cor-roxo)
    background-color: #fff
    font-size: var(--f2)
    font-family: var(--light)
    transition: border 0.2s ease

    &:focus
      outline: none
      border-width: 2px

.floating-label
  position: absolute
  top: -10px
  left: 45px
  font-size: var(--f2)
  padding: 0 8px
  background-color: #fff
  color: var(--cor-roxo)
  z-index: 2
  pointer-events: none
  font-family: var(--semibold)

.input-icon
  position: absolute
  left: 16px
  top: 25%
  color: var(--cor-roxo)
  pointer-events: none
  z-index: 1

.toggle-password
  position: absolute
  top: 30%
  right: 16px
  background: none
  border: none
  cursor: pointer
  padding: 0
  display: flex
  align-items: center
  justify-content: center
  color: var(--cor-roxo)
  transition: color 0.3s ease

  &:hover
    color: #5a4a8a

  svg
    width: 20px
    height: 20px

input:-webkit-autofill
  -webkit-box-shadow: 0 0 0px 1000px white inset !important
  -webkit-text-fill-color: #000 !important

.second-content
  position: absolute
  display: flex

  .first-column
    order: 2
    z-index: -1

  .second-column
    order: 1
    z-index: -1

.password
  color: var(--cor-roxo)
  cursor: pointer
  text-decoration: underline
  font-size: var(--f1)
  margin: 15px 0
  text-align: center

  &::first-letter
    text-transform: capitalize

.sign-in-js
  .first-content .first-column
    z-index: -1

  .second-content
    .second-column
      z-index: 11

    .first-column
      z-index: 13

  .content::before
    left: 60%
    border-top-left-radius: 0
    border-bottom-left-radius: 0
    border-top-right-radius: 20px
    border-bottom-right-radius: 20px
    animation: slidein .9s
    z-index: 12

  .first-content .second-column
    z-index: -1
    position: relative
    animation: deslocamentoEsq 1.3s

.sign-up-js
  .content::before
    animation: slideout 1.3s
    z-index: 12

  .second-content
    .first-column, .second-column
      z-index: -1

  .first-content
    .second-column
      z-index: 11

    .first-column
      z-index: 13

  .second-content .second-column
    position: relative
    z-index: -1
    animation: deslocamentoDir 1.3s

@keyframes deslocamentoEsq
  from
    left: 0
    opacity: 1
    z-index: 12

  25%
    left: -80px
    opacity: .5

  50%
    left: -100px
    opacity: .2

  to
    left: -110px
    opacity: 0
    z-index: -1

@keyframes deslocamentoDir
  from
    left: 0
    z-index: 12

  25%
    left: 80px

  50%
    left: 100px

  to
    left: 110px
    z-index: -1

@keyframes slidein
  from
    left: 0
    width: 40%

  25%
    left: 5%
    width: 50%

  50%
    left: 25%
    width: 60%

  75%
    left: 45%
    width: 50%

  to
    left: 60%
    width: 40%

@keyframes slideout
  from
    left: 60%
    width: 40%

  25%
    left: 45%
    width: 50%

  50%
    left: 25%
    width: 60%

  75%
    left: 5%
    width: 50%

  to
    left: 0
    width: 40%

@media screen and (max-width: 1040px)
  .content
    width: 100%
    height: 100%

    &::before
      width: 100%
      height: 40%
      top: 0
      border-radius: 0

  .first-content, .second-content
    flex-direction: column
    justify-content: space-around

  .first-column, .second-column
    width: 100%

  .sign-in-js .content::before
    top: 60%
    left: 0
    border-radius: 0

  .form
    width: 90%

  @keyframes deslocamentoEsq
    from
      top: 0
      opacity: 1
      z-index: 12

    25%
      top: -80px
      opacity: .5

    50%
      top: -100px
      opacity: .2

    to
      top: -110px
      opacity: 0
      z-index: -1

  @keyframes deslocamentoDir
    from
      top: 0
      z-index: 12

    25%
      top: 80px

    50%
      top: 100px

    to
      top: 110px
      z-index: -1

  @keyframes slidein
    from
      top: 0
      height: 40%

    25%
      top: 5%
      height: 50%

    50%
      top: 25%
      height: 60%

    75%
      top: 45%
      height: 50%

    to
      top: 60%
      height: 40%

  @keyframes slideout
    from
      top: 60%
      height: 40%

    25%
      top: 45%
      height: 50%

    50%
      top: 25%
      height: 60%

    75%
      top: 5%
      height: 50%

    to
      top: 0
      height: 40%

@media screen and (max-width: 740px)
  .form
    width: 50%

@media screen and (max-width: 425px)
  .form
    width: 100%
</style>
