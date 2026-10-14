<script lang="ts">
import { defineComponent } from 'vue';
import AppAvatar from '@/shared/components/AppAvatar.vue';
import { profileService } from '@/profiles/services/profile.service';
import { MOCK_SUGGESTIONS } from '@/profiles/mock/profiles.mock';
import type { Profile } from '@/profiles/model/profile.entity';

export default defineComponent({
  name: 'SuggestionsCard',
  components: { AppAvatar },
  data() {
    return {
      suggestions: MOCK_SUGGESTIONS.map((profile) => ({ ...profile }))
    };
  },
  methods: {
    async toggleFollow(profile: Profile): Promise<void> {
      const updated = await profileService.toggleFollow(profile.username);
      if (!updated) {
        return;
      }
      const index = this.suggestions.findIndex((item) => item.username === updated.username);
      if (index !== -1) {
        this.suggestions[index] = updated;
      }
    },
    goToProfile(username: string): void {
      void this.$router.push({ name: 'profile', params: { username } });
    }
  }
});
</script>

<template>
  <div class="cs-card suggestions p-4">
    <h3 class="suggestions-title m-0 font-bold">Sugerencias para ti</h3>
    <div v-for="profile in suggestions" :key="profile.username" class="suggestion-row flex align-items-center justify-content-between gap-2 py-2">
      <button class="suggestion-user flex align-items-center cursor-pointer min-w-0 text-left" @click="goToProfile(profile.username)">
        <AppAvatar :name="profile.displayName" size="small" />
        <span class="min-w-0 flex flex-column">
          <span class="suggestion-name font-semibold white-space-nowrap overflow-hidden text-overflow-ellipsis">{{ profile.displayName }}</span>
          <span class="cs-muted suggestion-handle white-space-nowrap overflow-hidden text-overflow-ellipsis">@{{ profile.username }}</span>
        </span>
      </button>
      <Button
        :label="profile.followedByMe ? 'Siguiendo' : 'Seguir'"
        text
        size="small"
        @click="toggleFollow(profile)"
      />
    </div>
  </div>
</template>

<style scoped>
.suggestions-title {
  margin-bottom: 1rem;
  font-size: 0.95rem;
}

.suggestion-row {
  padding: 0.5rem 0;
}

.suggestion-row + .suggestion-row {
  border-top: 1px solid var(--cs-border);
}

.suggestion-user {
  gap: 0.65rem;
  background: none;
  border: none;
  padding: 0;
  color: inherit;
  font: inherit;
}

.suggestion-name {
  font-size: 0.88rem;
}

.suggestion-handle {
  font-size: 0.8rem;
}
</style>
