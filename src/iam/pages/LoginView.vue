<script lang="ts">
import { defineComponent } from 'vue';
import AuthCard from '@/shared/components/AuthCard.vue';
import { AuthService } from '@/iam/services/auth.service';
import { getApiErrorMessage } from '@/shared/services/api-error';

export default defineComponent({
  name: 'LoginView',
  components: { AuthCard },
  data() {
    return {
      authService: new AuthService(),
      form: {
        usernameOrEmail: '',
        password: ''
      },
      loading: false
    };
  },
  methods: {
    async handleLogin(): Promise<void> {
      if (!this.form.usernameOrEmail || !this.form.password) {
        this.$toast.add({
          severity: 'warn',
          summary: 'Campos incompletos',
          detail: 'Ingresa tu usuario o correo y tu contraseña.',
          life: 3000
        });
        return;
      }
      this.loading = true;
      try {
        await this.authService.login({ ...this.form });
        this.$toast.add({
          severity: 'success',
          summary: 'Bienvenido',
          detail: 'Sesión iniciada correctamente.',
          life: 3000
        });
        await this.$router.push({ name: 'home' });
      } catch (error) {
        this.$toast.add({
          severity: 'error',
          summary: 'No se pudo iniciar sesión',
          detail: getApiErrorMessage(error, 'Credenciales inválidas.'),
          life: 4000
        });
      } finally {
        this.loading = false;
      }
    }
  }
});
</script>

<template>
  <AuthCard
    icon="pi pi-sign-in"
    title="Bienvenido de nuevo"
    subtitle="Inicia sesión para continuar a Chat Social"
  >
    <form @submit.prevent="handleLogin" class="flex flex-column gap-4 mt-2">
      <FloatLabel>
        <InputText
          id="usernameOrEmail"
          v-model="form.usernameOrEmail"
          class="w-full"
          autocomplete="username"
          :disabled="loading"
        />
        <label for="usernameOrEmail">Usuario o correo</label>
      </FloatLabel>
      <FloatLabel>
        <Password
          inputId="password"
          v-model="form.password"
          class="w-full"
          input-class="w-full"
          autocomplete="current-password"
          toggle-mask
          :feedback="false"
          :disabled="loading"
        />
        <label for="password">Contraseña</label>
      </FloatLabel>
      <Button
        type="submit"
        label="Entrar"
        icon="pi pi-arrow-right"
        icon-pos="right"
        :loading="loading"
        class="w-full mt-1"
      />
    </form>
    <template #footer>
      <p class="text-500 text-center m-0">
        ¿Sin cuenta?
        <router-link :to="{ name: 'register' }" class="font-medium">Regístrate aquí</router-link>
      </p>
    </template>
  </AuthCard>
</template>
