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
      <h2 class="section-title">Personas</h2>
      <EmptyState
        v-if="filteredUsers.length === 0"
        icon="pi pi-user"
        title="Sin resultados"
        text="No encontramos a nadie con ese nombre."
      />
      <div v-for="user in filteredUsers" :key="user.username" class="explore-row">
        <button class="explore-user" @click="goToProfile(user.username)">
          <AppAvatar :name="user.displayName" size="normal" />
          <span class="min-w-0">
            <span class="explore-name">{{ user.displayName }}</span>
            <span class="cs-muted explore-bio">@{{ user.username }} · {{ user.bio }}</span>
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
      <h2 class="section-title">Tendencias</h2>
      <div v-for="trend in trends" :key="trend.tag" class="explore-row">
        <span>
          <span class="explore-name">{{ trend.tag }}</span>
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

.section-title {
  margin: 0 0 0.5rem;
  font-size: 1rem;
  font-weight: 700;
}

.explore-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 0.75rem 0;
}

.explore-row + .explore-row {
  border-top: 1px solid var(--cs-border);
}

.explore-user {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  min-width: 0;
  text-align: left;
  color: inherit;
  font: inherit;
}

.explore-user > span {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.explore-name {
  font-weight: 600;
}

.explore-bio {
  font-size: 0.82rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 18rem;
}
</style>
