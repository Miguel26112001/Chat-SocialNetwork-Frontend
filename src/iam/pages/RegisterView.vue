<script lang="ts">
import { defineComponent } from 'vue';
import { AuthService } from '@/iam/services/auth.service';
import { getApiErrorMessage } from '@/shared/services/api-error';

const EMAIL_PATTERN = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

export default defineComponent({
  name: 'RegisterView',
  data() {
    return {
      authService: new AuthService(),
      form: {
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
      },
      formError: '',
      loading: false
    };
  },
  methods: {
    validate(): string {
      if (!this.form.username || !this.form.email || !this.form.password || !this.form.confirmPassword) {
        return 'Completa todos los campos.';
      }
      if (this.form.username.trim().length < 3) {
        return 'El username debe tener al menos 3 caracteres.';
      }
      if (!EMAIL_PATTERN.test(this.form.email.trim())) {
        return 'El correo no tiene un formato válido.';
      }
      if (this.form.password.length < 8) {
        return 'La contraseña debe tener al menos 8 caracteres.';
      }
      if (this.form.password !== this.form.confirmPassword) {
        return 'Las contraseñas no coinciden.';
      }
      return '';
    },
    async handleRegister(): Promise<void> {
      this.formError = this.validate();
      if (this.formError) {
        return;
      }
      this.loading = true;
      try {
        await this.authService.register({
          username: this.form.username.trim(),
          email: this.form.email.trim(),
          password: this.form.password
        });
        this.$toast.add({
          severity: 'success',
          summary: 'Cuenta creada',
          detail: 'Ahora inicia sesión con tus credenciales.',
          life: 4000
        });
        await this.$router.push({ name: 'login' });
      } catch (error) {
        this.$toast.add({
          severity: 'error',
          summary: 'No se pudo crear la cuenta',
          detail: getApiErrorMessage(error, 'Revisa los datos e inténtalo de nuevo.'),
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
      <template #title>Crear cuenta</template>
      <template #content>
        <form @submit.prevent="handleRegister" class="flex flex-column gap-3">
          <Message v-if="formError" severity="error">{{ formError }}</Message>
          <div class="flex flex-column gap-2">
            <label for="username">Usuario</label>
            <InputText
              id="username"
              v-model="form.username"
              placeholder="ana_dev"
              autocomplete="username"
              :disabled="loading"
            />
          </div>
          <div class="flex flex-column gap-2">
            <label for="email">Correo</label>
            <InputText
              id="email"
              v-model="form.email"
              placeholder="ana@example.com"
              autocomplete="email"
              :disabled="loading"
            />
          </div>
          <div class="flex flex-column gap-2">
            <label for="password">Contraseña</label>
            <Password
              id="password"
              v-model="form.password"
              placeholder="Mínimo 8 caracteres"
              autocomplete="new-password"
              toggle-mask
              :disabled="loading"
              input-class="w-full"
              class="w-full"
            />
          </div>
          <div class="flex flex-column gap-2">
            <label for="confirmPassword">Confirmar contraseña</label>
            <Password
              id="confirmPassword"
              v-model="form.confirmPassword"
              placeholder="Repite tu contraseña"
              autocomplete="new-password"
              toggle-mask
              :feedback="false"
              :disabled="loading"
              input-class="w-full"
              class="w-full"
            />
          </div>
          <Button
            type="submit"
            label="Registrarme"
            icon="pi pi-user-plus"
            :loading="loading"
            class="mt-2"
          />
        </form>
        <p class="text-500 mt-4 mb-0">
          ¿Ya tienes cuenta?
          <router-link :to="{ name: 'login' }">Inicia sesión</router-link>
        </p>
      </template>
    </Card>
  </div>
</template>
