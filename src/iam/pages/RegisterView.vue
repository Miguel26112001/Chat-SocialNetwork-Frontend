<script lang="ts">
import { defineComponent } from 'vue';
import AuthCard from '@/shared/components/AuthCard.vue';
import { AuthService } from '@/iam/services/auth.service';
import { getApiErrorMessage } from '@/shared/services/api-error';

const EMAIL_PATTERN = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

export default defineComponent({
  name: 'RegisterView',
  components: { AuthCard },
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
  <AuthCard
    icon="pi pi-user-plus"
    title="Crear cuenta"
    subtitle="Únete a Chat Social en segundos"
  >
    <form @submit.prevent="handleRegister" class="flex flex-column gap-4 mt-2">
      <Message v-if="formError" severity="error" :closable="false">{{ formError }}</Message>
      <FloatLabel>
        <InputText
          id="username"
          v-model="form.username"
          class="w-full"
          autocomplete="username"
          :disabled="loading"
        />
        <label for="username">Usuario</label>
      </FloatLabel>
      <FloatLabel>
        <InputText
          id="email"
          v-model="form.email"
          class="w-full"
          autocomplete="email"
          :disabled="loading"
        />
        <label for="email">Correo</label>
      </FloatLabel>
      <FloatLabel>
        <Password
          inputId="password"
          v-model="form.password"
          class="w-full"
          input-class="w-full"
          autocomplete="new-password"
          toggle-mask
          :disabled="loading"
        />
        <label for="password">Contraseña</label>
      </FloatLabel>
      <FloatLabel>
        <Password
          inputId="confirmPassword"
          v-model="form.confirmPassword"
          class="w-full"
          input-class="w-full"
          autocomplete="new-password"
          toggle-mask
          :feedback="false"
          :disabled="loading"
        />
        <label for="confirmPassword">Confirmar contraseña</label>
      </FloatLabel>
      <Button
        type="submit"
        label="Registrarme"
        icon="pi pi-check"
        icon-pos="right"
        :loading="loading"
        class="w-full mt-1"
      />
    </form>
    <template #footer>
      <p class="text-500 text-center m-0">
        ¿Ya tienes cuenta?
        <router-link :to="{ name: 'login' }" class="font-medium">Inicia sesión</router-link>
      </p>
    </template>
  </AuthCard>
</template>
