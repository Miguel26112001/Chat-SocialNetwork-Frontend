<script lang="ts">
import { defineComponent } from 'vue';
import EmptyState from '@/shared/components/EmptyState.vue';
import { AuthService } from '@/iam/services/auth.service';
import { UserService } from '@/iam/services/user.service';
import type { Session } from '@/iam/model/session.resource';
import { clearTokens } from '@/shared/services/token-storage';
import { useCurrentUser } from '@/shared/services/use-current-user';
import { getApiErrorMessage } from '@/shared/services/api-error';

export default defineComponent({
  name: 'AccountSettingsView',
  components: { EmptyState },
  data() {
    return {
      authService: new AuthService(),
      userService: new UserService(),
      currentUser: useCurrentUser(),
      passwordForm: {
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      },
      passwordError: '',
      passwordLoading: false,
      sessions: [] as Session[],
      sessionsLoading: false,
      sessionsError: ''
    };
  },
  methods: {
    formatDateTime(iso: string): string {
      return new Date(iso).toLocaleString('es', {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit'
      });
    },
    async fetchSessions(): Promise<void> {
      this.sessionsLoading = true;
      this.sessionsError = '';
      try {
        this.sessions = await this.authService.getSessions();
      } catch {
        this.sessionsError = 'No se pudieron cargar tus sesiones.';
      } finally {
        this.sessionsLoading = false;
      }
    },
    async handleChangePassword(): Promise<void> {
      this.passwordError = '';
      if (!this.passwordForm.currentPassword || !this.passwordForm.newPassword) {
        this.passwordError = 'Completa todos los campos.';
        return;
      }
      if (this.passwordForm.newPassword.length < 8) {
        this.passwordError = 'La nueva contraseña debe tener al menos 8 caracteres.';
        return;
      }
      if (this.passwordForm.newPassword !== this.passwordForm.confirmPassword) {
        this.passwordError = 'Las contraseñas no coinciden.';
        return;
      }
      this.passwordLoading = true;
      try {
        await this.userService.changePassword({
          currentPassword: this.passwordForm.currentPassword,
          newPassword: this.passwordForm.newPassword
        });
        this.passwordForm.currentPassword = '';
        this.passwordForm.newPassword = '';
        this.passwordForm.confirmPassword = '';
        this.$toast.add({
          severity: 'success',
          summary: 'Contraseña actualizada',
          life: 3000
        });
      } catch (error) {
        this.$toast.add({
          severity: 'error',
          summary: 'No se pudo cambiar la contraseña',
          detail: getApiErrorMessage(error, 'Revisa los datos e inténtalo de nuevo.'),
          life: 4000
        });
      } finally {
        this.passwordLoading = false;
      }
    },
    confirmDeactivate(): void {
      this.$confirm.require({
        message: 'Se desactivará tu cuenta y se cerrarán todas tus sesiones. Podrás reactivarla con tu sesión actual durante los próximos minutos; después necesitarás a un administrador.',
        header: 'Desactivar mi cuenta',
        icon: 'pi pi-exclamation-triangle',
        rejectLabel: 'Cancelar',
        acceptLabel: 'Desactivar',
        rejectClass: 'p-button-secondary p-button-text',
        acceptClass: 'p-button-danger',
        accept: () => {
          void this.handleDeactivate();
        }
      });
    },
    async handleDeactivate(): Promise<void> {
      try {
        await this.userService.deactivateMe();
      } catch {
        // Aunque falle en el backend, se sale igual en local.
      } finally {
        clearTokens();
        this.currentUser.refresh();
        await this.$router.push({ name: 'login' });
        this.$toast.add({
          severity: 'info',
          summary: 'Cuenta desactivada',
          life: 3000
        });
      }
    },
    async handleLogout(): Promise<void> {
      try {
        await this.authService.logout();
      } catch {
        // Aunque falle la revocación, se sale igual en local.
      } finally {
        clearTokens();
        this.currentUser.refresh();
        await this.$router.push({ name: 'login' });
      }
    }
  },
  mounted() {
    void this.fetchSessions();
  }
});
</script>

<template>
  <div class="flex flex-column gap-3">
    <div>
      <h1 class="text-2xl font-bold m-0">Ajustes de cuenta</h1>
      <p class="cs-muted m-0 mt-1">Contraseña, sesiones y zona de peligro.</p>
    </div>

    <div class="cs-card settings-section">
      <h2 class="section-title">Cambiar contraseña</h2>
      <form @submit.prevent="handleChangePassword" class="flex flex-column gap-3">
        <Message v-if="passwordError" severity="error" :closable="false">{{ passwordError }}</Message>
        <FloatLabel>
          <Password
            inputId="currentPassword"
            v-model="passwordForm.currentPassword"
            class="w-full"
            input-class="w-full"
            autocomplete="current-password"
            toggle-mask
            :feedback="false"
            :disabled="passwordLoading"
          />
          <label for="currentPassword">Contraseña actual</label>
        </FloatLabel>
        <FloatLabel>
          <Password
            inputId="newPassword"
            v-model="passwordForm.newPassword"
            class="w-full"
            input-class="w-full"
            autocomplete="new-password"
            toggle-mask
            :disabled="passwordLoading"
          />
          <label for="newPassword">Nueva contraseña</label>
        </FloatLabel>
        <FloatLabel>
          <Password
            inputId="confirmPassword"
            v-model="passwordForm.confirmPassword"
            class="w-full"
            input-class="w-full"
            autocomplete="new-password"
            toggle-mask
            :feedback="false"
            :disabled="passwordLoading"
          />
          <label for="confirmPassword">Confirmar nueva contraseña</label>
        </FloatLabel>
        <div>
          <Button type="submit" label="Guardar contraseña" icon="pi pi-check" :loading="passwordLoading" />
        </div>
      </form>
    </div>

    <div class="cs-card settings-section">
      <h2 class="section-title">Mis dispositivos</h2>
      <p class="cs-muted section-subtitle">Sesiones activas con este u otros dispositivos.</p>
      <div v-if="sessionsLoading" class="flex flex-column gap-2">
        <Skeleton width="100%" height="0.8rem" />
        <Skeleton width="70%" height="0.8rem" />
      </div>
      <Message v-else-if="sessionsError" severity="error" :closable="false">{{ sessionsError }}</Message>
      <EmptyState
        v-else-if="sessions.length === 0"
        icon="pi pi-mobile"
        title="Sin sesiones activas"
        text="No hay otras sesiones además de esta."
      />
      <div v-else class="flex flex-column">
        <div v-for="session in sessions" :key="session.id" class="session-row">
          <i class="pi pi-desktop cs-muted"></i>
          <span class="min-w-0">
            <span class="session-id">{{ session.id.slice(0, 8) }}…</span>
            <span class="cs-muted session-dates">
              creada {{ formatDateTime(session.createdAt) }} · expira {{ formatDateTime(session.expiresAt) }}
            </span>
          </span>
        </div>
      </div>
      <Divider />
      <Button label="Cerrar sesión actual" icon="pi pi-sign-out" outlined severity="secondary" @click="handleLogout" />
    </div>

    <div class="cs-card settings-section danger-zone">
      <h2 class="section-title danger-title">Zona de peligro</h2>
      <p class="cs-muted section-subtitle">
        Desactivar tu cuenta cierra todas tus sesiones. Podrás reactivarla si conservas un acceso vigente.
      </p>
      <Button label="Desactivar mi cuenta" icon="pi pi-user-minus" severity="danger" outlined @click="confirmDeactivate" />
    </div>
  </div>
</template>

<style scoped>
.settings-section {
  padding: 1.5rem;
}

.section-title {
  margin: 0 0 1rem;
  font-size: 1.05rem;
  font-weight: 700;
}

.section-subtitle {
  margin: -0.5rem 0 1rem;
  font-size: 0.88rem;
}

.danger-zone {
  border-color: var(--p-red-200);
}

.danger-title {
  color: var(--p-red-600);
}

.session-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.7rem 0;
}

.session-row + .session-row {
  border-top: 1px solid var(--cs-border);
}

.session-row > span {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.session-id {
  font-weight: 600;
  font-family: monospace;
  font-size: 0.9rem;
}

.session-dates {
  font-size: 0.8rem;
}
</style>
