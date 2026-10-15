<script lang="ts">
import { defineComponent } from 'vue';
import AppAvatar from '@/shared/components/AppAvatar.vue';
import EmptyState from '@/shared/components/EmptyState.vue';
import { UserService } from '@/iam/services/user.service';
import type { User } from '@/iam/model/user.entity';
import { getApiErrorMessage } from '@/shared/services/api-error';

export default defineComponent({
  name: 'AdminView',
  components: { AppAvatar, EmptyState },
  data() {
    return {
      userService: new UserService(),
      query: '',
      found: null as User | null,
      searching: false,
      searched: false,
      acting: false
    };
  },
  methods: {
    async searchUser(): Promise<void> {
      const term = this.query.trim();
      if (!term) {
        return;
      }
      this.searching = true;
      this.searched = false;
      try {
        this.found = term.includes('@')
          ? await this.userService.getByEmail(term)
          : await this.userService.getByUsername(term);
      } catch (error) {
        this.found = null;
        this.$toast.add({
          severity: 'warn',
          summary: 'Sin resultados',
          detail: getApiErrorMessage(error, 'No se encontró esa cuenta.'),
          life: 3000
        });
      } finally {
        this.searched = true;
        this.searching = false;
      }
    },
    confirmPromote(): void {
      this.$confirm.require({
        message: 'Esta cuenta podrá gestionar a otros usuarios. ¿Continuar?',
        header: 'Promover a ADMIN',
        icon: 'pi pi-shield',
        rejectLabel: 'Cancelar',
        acceptLabel: 'Promover',
        accept: () => {
          void this.handlePromote();
        }
      });
    },
    async handlePromote(): Promise<void> {
      if (!this.found) {
        return;
      }
      this.acting = true;
      try {
        await this.userService.promoteUser(this.found.id);
        this.found = { ...this.found, role: 'ADMIN' };
        this.$toast.add({ severity: 'success', summary: 'Cuenta promovida a ADMIN', life: 3000 });
      } catch (error) {
        this.$toast.add({
          severity: 'error',
          summary: 'No se pudo promover',
          detail: getApiErrorMessage(error, 'Inténtalo de nuevo.'),
          life: 4000
        });
      } finally {
        this.acting = false;
      }
    },
    confirmDemote(): void {
      this.$confirm.require({
        message: 'Esta cuenta perderá sus privilegios de administración. ¿Continuar?',
        header: 'Degradar a USER',
        icon: 'pi pi-exclamation-triangle',
        rejectLabel: 'Cancelar',
        acceptLabel: 'Degradar',
        acceptClass: 'p-button-danger',
        accept: () => {
          void this.handleDemote();
        }
      });
    },
    async handleDemote(): Promise<void> {
      if (!this.found) {
        return;
      }
      this.acting = true;
      try {
        await this.userService.demoteUser(this.found.id);
        this.found = { ...this.found, role: 'USER' };
        this.$toast.add({ severity: 'success', summary: 'Cuenta degradada a USER', life: 3000 });
      } catch (error) {
        this.$toast.add({
          severity: 'error',
          summary: 'No se pudo degradar',
          detail: getApiErrorMessage(error, 'Inténtalo de nuevo.'),
          life: 4000
        });
      } finally {
        this.acting = false;
      }
    }
  }
});
</script>

<template>
  <div class="flex flex-column gap-3">
    <div>
      <h1 class="text-2xl font-bold m-0">Administración</h1>
      <p class="cs-muted m-0 mt-1">Busca cuentas por username o correo y gestiona sus roles.</p>
    </div>

    <div class="cs-card admin-search">
      <form @submit.prevent="searchUser" class="flex gap-2">
        <IconField class="flex-grow-1">
          <InputIcon class="pi pi-search" />
          <InputText
            v-model="query"
            placeholder="ana_dev o ana@example.com"
            class="w-full"
            aria-label="Buscar cuenta por username o correo"
          />
        </IconField>
        <Button type="submit" label="Buscar" :loading="searching" />
      </form>
    </div>

    <EmptyState
      v-if="searched && !found && !searching"
      icon="pi pi-user"
      title="Sin resultados"
      text="No existe ninguna cuenta con ese identificador."
    />

    <div v-if="found" class="cs-card admin-result">
      <div class="flex align-items-center gap-3">
        <AppAvatar :name="found.username" size="large" />
        <div class="min-w-0 flex-grow-1">
          <p class="font-semibold m-0">{{ found.username }}</p>
          <p class="cs-muted m-0 text-sm">{{ found.email }}</p>
          <div class="flex gap-2 mt-2 flex-wrap">
            <Tag :value="found.role" :severity="found.role === 'ADMIN' ? 'info' : 'secondary'" />
            <Tag :value="found.active ? 'Activa' : 'Desactivada'" :severity="found.active ? 'success' : 'danger'" />
          </div>
        </div>
      </div>
      <Divider />
      <div class="flex gap-2 flex-wrap">
        <Button
          v-if="found.role !== 'ADMIN'"
          label="Promover a ADMIN"
          icon="pi pi-shield"
          :loading="acting"
          @click="confirmPromote"
        />
        <Button
          v-else
          label="Degradar a USER"
          icon="pi pi-shield"
          outlined
          :loading="acting"
          @click="confirmDemote"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.admin-search,
.admin-result {
  padding: 1.25rem;
}
</style>
