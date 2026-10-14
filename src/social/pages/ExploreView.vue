<script lang="ts">
import { defineComponent } from 'vue';
import AppAvatar from '@/shared/components/AppAvatar.vue';
import EmptyState from '@/shared/components/EmptyState.vue';
import { MOCK_SUGGESTIONS, MOCK_TRENDS } from '@/profiles/mock/profiles.mock';
import { profileService } from '@/profiles/services/profile.service';
import type { Profile } from '@/profiles/model/profile.entity';

export default defineComponent({
  name: 'ExploreView',
  components: { AppAvatar, EmptyState },
  data() {
    return {
      query: '',
      users: MOCK_SUGGESTIONS.map((profile) => ({ ...profile })),
      trends: MOCK_TRENDS
    };
  },
  computed: {
    filteredUsers(): Profile[] {
      const q = this.query.trim().toLowerCase();
      if (!q) {
        return this.users;
      }
      return this.users.filter(
        (user) =>
          user.username.toLowerCase().includes(q) || user.displayName.toLowerCase().includes(q)
      );
    }
  },
  methods: {
    async toggleFollow(profile: Profile): Promise<void> {
      const updated = await profileService.toggleFollow(profile.username);
      if (!updated) {
        return;
      }
      const index = this.users.findIndex((item) => item.username === updated.username);
      if (index !== -1) {
        this.users[index] = updated;
      }
    },
    goToProfile(username: string): void {
      void this.$router.push({ name: 'profile', params: { username } });
    }
  }
});
</script>

<template>
  <div class="flex flex-column gap-3">
    <div>
      <h1 class="text-2xl font-bold m-0">Explorar</h1>
      <p class="cs-muted m-0 mt-1">Personas y temas que te pueden interesar.</p>
    </div>

    <IconField class="w-full">
      <InputIcon class="pi pi-search" />
      <InputText v-model="query" placeholder="Buscar personas..." class="w-full" aria-label="Buscar personas" />
    </IconField>

    <div class="cs-card explore-section">
      <h2 class="m-0 mb-2 font-bold text-base">Personas</h2>
      <EmptyState
        v-if="filteredUsers.length === 0"
        icon="pi pi-user"
        title="Sin resultados"
        text="No encontramos a nadie con ese nombre."
      />
      <div v-for="user in filteredUsers" :key="user.username" class="explore-row flex align-items-center justify-content-between gap-3 py-3">
        <button class="explore-user flex align-items-center cursor-pointer min-w-0 text-left" @click="goToProfile(user.username)">
          <AppAvatar :name="user.displayName" size="normal" />
          <span class="min-w-0 flex flex-column">
            <span class="font-semibold">{{ user.displayName }}</span>
            <span class="cs-muted explore-bio white-space-nowrap overflow-hidden text-overflow-ellipsis">@{{ user.username }} · {{ user.bio }}</span>
          </span>
        </button>
        <Button
          :label="user.followedByMe ? 'Siguiendo' : 'Seguir'"
          :outlined="!user.followedByMe"
          size="small"
          @click="toggleFollow(user)"
        />
      </div>
    </div>

    <div class="cs-card explore-section">
      <h2 class="m-0 mb-2 font-bold text-base">Tendencias</h2>
      <div v-for="trend in trends" :key="trend.tag" class="explore-row flex align-items-center justify-content-between gap-3 py-3">
        <span>
          <span class="font-semibold">{{ trend.tag }}</span>
          <span class="cs-muted explore-bio">{{ trend.posts.toLocaleString('es') }} publicaciones</span>
        </span>
        <i class="pi pi-chart-line cs-muted"></i>
      </div>
    </div>
  </div>
</template>

<style scoped>
.explore-section {
  padding: 1.25rem;
}

.explore-row {
  padding: 0.75rem 0;
}

.explore-row + .explore-row {
  border-top: 1px solid var(--cs-border);
}

.explore-user {
  gap: 0.75rem;
  background: none;
  border: none;
  padding: 0;
  color: inherit;
  font: inherit;
}

.explore-bio {
  font-size: 0.82rem;
  max-width: 100%;
}
</style>
