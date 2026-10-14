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
  <div class="cs-card suggestions">
    <h3 class="suggestions-title">Sugerencias para ti</h3>
    <div v-for="profile in suggestions" :key="profile.username" class="suggestion-row">
      <button class="suggestion-user" @click="goToProfile(profile.username)">
        <AppAvatar :name="profile.displayName" size="small" />
        <span class="min-w-0">
          <span class="suggestion-name">{{ profile.displayName }}</span>
          <span class="cs-muted suggestion-handle">@{{ profile.username }}</span>
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
.suggestions {
  padding: 1.25rem;
}

.suggestions-title {
  margin: 0 0 1rem;
  font-size: 0.95rem;
  font-weight: 700;
}

.suggestion-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  padding: 0.5rem 0;
}

.suggestion-row + .suggestion-row {
  border-top: 1px solid var(--cs-border);
}

.suggestion-user {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  min-width: 0;
  text-align: left;
  color: inherit;
  font: inherit;
}

.suggestion-user > span {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.suggestion-name {
  font-weight: 600;
  font-size: 0.88rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.suggestion-handle {
  font-size: 0.8rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
