<script lang="ts">
import { defineComponent } from 'vue';
import { AuthService } from '@/iam/services/auth.service';
import { getApiErrorMessage } from '@/shared/services/api-error';

export default defineComponent({
  name: 'LoginView',
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
  <div class="flex justify-content-center">
    <Card class="w-full" style="max-width: 28rem">
      <template #title>Iniciar sesión</template>
      <template #content>
        <form @submit.prevent="handleLogin" class="flex flex-column gap-3">
          <div class="flex flex-column gap-2">
            <label for="usernameOrEmail">Usuario o correo</label>
            <InputText
              id="usernameOrEmail"
              v-model="form.usernameOrEmail"
              placeholder="ana_dev o ana@example.com"
              autocomplete="username"
              :disabled="loading"
            />
          </div>
          <div class="flex flex-column gap-2">
            <label for="password">Contraseña</label>
            <Password
              id="password"
              v-model="form.password"
              placeholder="Tu contraseña"
              autocomplete="current-password"
              toggle-mask
              :feedback="false"
              :disabled="loading"
              input-class="w-full"
              class="w-full"
            />
          </div>
          <Button
            type="submit"
            label="Entrar"
            icon="pi pi-sign-in"
            :loading="loading"
            class="mt-2"
          />
        </form>
        <p class="text-500 mt-4 mb-0">
          ¿Sin cuenta?
          <router-link :to="{ name: 'register' }">Regístrate aquí</router-link>
        </p>
      </template>
    </Card>
  </div>
</template>
