<script lang="ts">
import { defineComponent } from 'vue';
import { UserService } from '@/iam/services/user.service';
import type { User } from '@/iam/model/user.entity';

export default defineComponent({
  name: 'HomeView',
  data() {
    return {
      userService: new UserService(),
      user: null as User | null,
      loading: false,
      error: ''
    };
  },
  methods: {
    async fetchMe(): Promise<void> {
      this.loading = true;
      try {
        this.user = await this.userService.getMe();
      } catch {
        this.error = 'No se pudo cargar tu cuenta.';
      } finally {
        this.loading = false;
      }
    }
  },
  mounted() {
    void this.fetchMe();
  }
});
</script>

<template>
  <div>
    <h1 class="text-3xl font-bold m-0">Inicio</h1>
    <p class="text-500">Bienvenido a Chat Social.</p>
    <Divider />
    <div v-if="loading" class="text-center py-5">
      <ProgressSpinner style="width: 50px; height: 50px" stroke-width="4" />
      <p class="text-500 mt-3">Cargando tu cuenta...</p>
    </div>
    <Message v-else-if="error" severity="error">{{ error }}</Message>
    <Card v-else-if="user">
      <template #title>{{ user.username }}</template>
      <template #content>
        <p class="m-0 text-500">{{ user.email }}</p>
        <Tag :value="user.active ? 'Activa' : 'Desactivada'" :severity="user.active ? 'success' : 'danger'" />
      </template>
    </Card>
  </div>
</template>
