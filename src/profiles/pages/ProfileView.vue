<script lang="ts">
import { defineComponent, type PropType } from 'vue';
import AppAvatar from '@/shared/components/AppAvatar.vue';
import EmptyState from '@/shared/components/EmptyState.vue';
import LoadingList from '@/shared/components/LoadingList.vue';
import PostCard from '@/content/components/PostCard.vue';
import { profileService } from '@/profiles/services/profile.service';
import { timelineService } from '@/content/services/timeline.service';
import type { Profile } from '@/profiles/model/profile.entity';
import type { Post, PostAuthor } from '@/content/model/post.entity';
import type { User } from '@/iam/model/user.entity';
import { useCurrentUser } from '@/shared/services/use-current-user';

export default defineComponent({
  name: 'ProfileView',
  components: { AppAvatar, EmptyState, LoadingList, PostCard },
  props: {
    username: {
      type: String,
      required: false,
      default: ''
    }
  },
  data() {
    return {
      profile: null as Profile | null,
      posts: [] as Post[],
      me: null as User | null,
      loading: false,
      notFound: false
    };
  },
  computed: {
    isOwnProfile(): boolean {
      return !this.username || (!!this.me && this.me.username === this.username);
    },
    currentAuthor(): PostAuthor {
      return {
        username: this.me?.username ?? 'yo',
        displayName: this.me?.username ?? 'Yo'
      };
    }
  },
  watch: {
    username() {
      void this.fetchProfile();
    }
  },
  methods: {
    async fetchProfile(): Promise<void> {
      this.loading = true;
      this.notFound = false;
      try {
        const { load } = useCurrentUser();
        this.me = await load();
        // Sin username en la ruta (/profile/me) se resuelve el propio usuario.
        const username = this.username || this.me?.username;
        if (!username) {
          this.notFound = true;
          return;
        }
        const profile = await profileService.getProfile(username, this.me?.username);
        if (!profile) {
          this.notFound = true;
          return;
        }
        this.profile = profile;
        const timeline = await timelineService.getTimeline();
        this.posts = timeline.filter((post) => post.author.username === this.profile?.username);
      } finally {
        this.loading = false;
      }
    },
    async toggleFollow(): Promise<void> {
      if (!this.profile) {
        return;
      }
      const updated = await profileService.toggleFollow(this.profile.username);
      if (updated) {
        this.profile = updated;
      }
    },
    goToMessages(): void {
      void this.$router.push({ name: 'messages' });
    }
  },
  mounted() {
    void this.fetchProfile();
  }
});
</script>

<template>
  <div class="flex flex-column gap-3">
    <LoadingList v-if="loading" :rows="2" />

    <EmptyState
      v-else-if="notFound"
      icon="pi pi-user"
      title="Usuario no encontrado"
      text="La cuenta que buscas no existe o fue desactivada."
      action-label="Volver al inicio"
      @action="$router.push({ name: 'home' })"
    />

    <template v-else-if="profile">
      <div class="cs-card p-4">
        <div class="flex flex-column sm:flex-row gap-4 align-items-start">
          <AppAvatar :name="profile.displayName" size="xlarge" />
          <div class="flex-grow-1 min-w-0">
            <div class="flex align-items-center gap-2 flex-wrap">
              <h1 class="text-2xl font-bold m-0">{{ profile.displayName }}</h1>
              <Tag v-if="profile.isPrivate" icon="pi pi-lock" value="Privada" severity="secondary" />
            </div>
            <p class="cs-muted m-0 mt-1">@{{ profile.username }}</p>
            <p v-if="profile.bio" class="profile-bio mt-2">{{ profile.bio }}</p>
            <div class="flex gap-4 mt-3 flex-wrap">
              <span><strong>{{ profile.followersCount }}</strong> <span class="cs-muted">seguidores</span></span>
              <span><strong>{{ profile.followingCount }}</strong> <span class="cs-muted">seguidos</span></span>
            </div>
          </div>
        </div>
        <div class="flex gap-2 mt-4 flex-wrap">
          <Button
            v-if="isOwnProfile"
            label="Editar perfil"
            icon="pi pi-pencil"
            outlined
            disabled
            v-tooltip.top="'Disponible próximamente'"
          />
          <template v-else>
            <Button
              :label="profile.followedByMe ? 'Siguiendo' : 'Seguir'"
              :icon="profile.followedByMe ? 'pi pi-check' : 'pi pi-plus'"
              :outlined="!profile.followedByMe"
              @click="toggleFollow"
            />
            <Button label="Mensaje" icon="pi pi-envelope" outlined @click="goToMessages" />
          </template>
        </div>
      </div>

      <h2 class="text-lg font-semibold m-0 mt-1">Publicaciones</h2>

      <EmptyState
        v-if="posts.length === 0"
        icon="pi pi-file"
        title="Sin publicaciones todavía"
        :text="isOwnProfile ? 'Cuando publiques algo, aparecerá aquí.' : `@${profile.username} aún no ha publicado nada.`"
      />

      <PostCard
        v-for="post in posts"
        :key="post.id"
        :post="post"
        :current-author="currentAuthor"
      />
    </template>
  </div>
</template>

<style scoped>
.profile-bio {
  line-height: 1.55;
}
</style>
