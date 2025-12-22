<template>
  <div class="auth-container">
    <div class="auth-card">
      <!-- Toggle buttons -->
      <div class="toggle-container">
        <button class="toggle-btn" :class="{ active: activeForm === 'login' }" @click="activeForm = 'login'">Entrar</button>
        <button class="toggle-btn" :class="{ active: activeForm === 'register' }" @click="activeForm = 'register'">Cadastrar</button>
      </div>

      <!-- Forms -->
      <div class="forms-container">
        <!-- Login Form -->
        <form class="auth-form" :class="{ 'form-active': activeForm === 'login' }" @submit.prevent="handleLogin">
          <h2 class="form-title">Bem-vindo de volta</h2>

          <div class="input-group">
            <label for="login-email">E-mail</label>
            <input type="email" id="login-email" placeholder="seu@email.com" v-model="loginData.email" />
          </div>

          <div class="input-group">
            <label for="login-password">Senha</label>
            <input type="password" id="login-password" placeholder="Sua senha" v-model="loginData.password" />
          </div>

          <button type="submit" class="submit-btn">Entrar</button>

          <div class="divider">
            <span>ou</span>
          </div>

          <button type="button" class="social-btn google-btn">
            <i class="icon-google"></i>
            Continuar com Google
          </button>
        </form>

        <!-- Register Form -->
        <form class="auth-form" :class="{ 'form-active': activeForm === 'register' }" @submit.prevent="handleRegister">
          <h2 class="form-title">Crie sua conta</h2>

          <div class="input-group">
            <label for="register-name">Nome completo</label>
            <input type="text" id="register-name" placeholder="Seu nome" v-model="registerData.name" />
          </div>

          <div class="input-group">
            <label for="register-email">E-mail</label>
            <input type="email" id="register-email" placeholder="seu@email.com" v-model="registerData.email" />
          </div>

          <div class="input-group">
            <label for="register-password">Senha</label>
            <input type="password" id="register-password" placeholder="Crie uma senha" v-model="registerData.password" />
          </div>

          <div class="input-group">
            <label for="register-confirm">Confirmar senha</label>
            <input type="password" id="register-confirm" placeholder="Digite novamente" v-model="registerData.confirmPassword" />
          </div>

          <button type="submit" class="submit-btn">Cadastrar</button>

          <p class="terms">
            Ao se cadastrar, você concorda com nossos
            <a href="#">Termos de Uso</a>
            e
            <a href="#">Política de Privacidade</a>
          </p>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const activeForm = ref('login')

const loginData = ref({
  email: '',
  password: ''
})

const registerData = ref({
  name: '',
  email: '',
  password: '',
  confirmPassword: ''
})

const handleLogin = () => {
  console.log('Login data:', loginData.value)
  // Aqui normalmente faria uma requisição à API
}

const handleRegister = () => {
  console.log('Register data:', registerData.value)
  // Aqui normalmente faria uma requisição à API
}
</script>

<style lang="scss" scoped>
.auth-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.auth-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 420px;
  overflow: hidden;
}

.toggle-container {
  display: flex;
  background: #f7f9fc;
  padding: 8px;
  margin: 16px;
  border-radius: 12px;
}

.toggle-btn {
  flex: 1;
  padding: 14px;
  border: none;
  background: transparent;
  color: #64748b;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  border-radius: 8px;
  transition: all 0.3s ease;

  &:hover {
    color: #4f46e5;
  }

  &.active {
    background: white;
    color: #4f46e5;
    box-shadow: 0 4px 12px rgba(79, 70, 229, 0.15);
  }
}

.forms-container {
  position: relative;
  padding: 0 24px 32px;
  min-height: 500px;
}

.auth-form {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  padding: 24px;
  opacity: 0;
  visibility: hidden;
  transform: translateX(30px);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);

  &.form-active {
    opacity: 1;
    visibility: visible;
    transform: translateX(0);
    position: relative;
  }
}

.form-title {
  margin: 0 0 32px;
  color: #1e293b;
  font-size: 28px;
  font-weight: 700;
  text-align: center;
}

.input-group {
  margin-bottom: 20px;

  label {
    display: block;
    margin-bottom: 8px;
    color: #475569;
    font-size: 14px;
    font-weight: 500;
  }

  input {
    width: 100%;
    padding: 14px 16px;
    border: 2px solid #e2e8f0;
    border-radius: 10px;
    font-size: 16px;
    transition: all 0.3s ease;

    &:focus {
      outline: none;
      border-color: #4f46e5;
      box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
    }

    &::placeholder {
      color: #94a3b8;
    }
  }
}

.submit-btn {
  width: 100%;
  padding: 16px;
  background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 8px;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(79, 70, 229, 0.3);
  }

  &:active {
    transform: translateY(0);
  }
}

.divider {
  display: flex;
  align-items: center;
  margin: 24px 0;

  &::before,
  &::after {
    content: '';
    flex: 1;
    height: 1px;
    background: #e2e8f0;
  }

  span {
    padding: 0 16px;
    color: #64748b;
    font-size: 14px;
  }
}

.social-btn {
  width: 100%;
  padding: 14px;
  border: 2px solid #e2e8f0;
  background: white;
  border-radius: 10px;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  transition: all 0.3s ease;

  &:hover {
    border-color: #cbd5e1;
    background: #f8fafc;
  }

  &.google-btn {
    color: #475569;
  }
}

.icon-google {
  display: inline-block;
  width: 20px;
  height: 20px;
  background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%234285F4' d='M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z'/%3E%3Cpath fill='%2334A853' d='M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z'/%3E%3Cpath fill='%23FBBC05' d='M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z'/%3E%3Cpath fill='%23EA4335' d='M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z'/%3E%3C/svg%3E") center/contain no-repeat;
}

.terms {
  margin-top: 24px;
  color: #64748b;
  font-size: 13px;
  text-align: center;
  line-height: 1.5;

  a {
    color: #4f46e5;
    text-decoration: none;
    font-weight: 500;

    &:hover {
      text-decoration: underline;
    }
  }
}

// Animation delay for form elements
.auth-form.form-active {
  .input-group,
  .submit-btn,
  .divider,
  .social-btn,
  .terms {
    animation: fadeInUp 0.6s ease forwards;
  }

  @for $i from 1 through 10 {
    & > *:nth-child(#{$i}) {
      animation-delay: #{$i * 0.1}s;
    }
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

// Responsive adjustments
@media (max-width: 480px) {
  .auth-card {
    margin: 0;
    border-radius: 0;
    max-width: 100%;
    min-height: 100vh;
  }

  .forms-container {
    padding: 0 16px 24px;
  }

  .auth-form {
    padding: 16px;
  }

  .form-title {
    font-size: 24px;
  }
}
</style>
