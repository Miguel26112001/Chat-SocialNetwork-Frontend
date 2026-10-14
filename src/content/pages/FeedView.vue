<script lang="ts">
import { defineComponent } from 'vue';
import EmptyState from '@/shared/components/EmptyState.vue';
import LoadingList from '@/shared/components/LoadingList.vue';
import PostCard from '@/content/components/PostCard.vue';
import PostComposer from '@/content/components/PostComposer.vue';
import { timelineService } from '@/content/services/timeline.service';
import type { Post, PostAuthor } from '@/content/model/post.entity';
import type { User } from '@/iam/model/user.entity';
import { useCurrentUser } from '@/shared/services/use-current-user';
import { clearTokens, isAuthenticated } from '@/shared/services/token-storage';

export default defineComponent({
  name: 'FeedView',
  components: { EmptyState, LoadingList, PostCard, PostComposer },
  data() {
    return {
      posts: [] as Post[],
      me: null as User | null,
      loading: false,
      loadError: ''
    };
  },
  computed: {
    currentAuthor(): PostAuthor {
      return {
        username: this.me?.username ?? 'yo',
        displayName: this.me?.username ?? 'Yo'
      };
    }
  },
  methods: {
    async fetchTimeline(): Promise<void> {
      this.loading = true;
      this.loadError = '';
      try {
        const { load } = useCurrentUser();
        this.me = await load();
        if (!this.me && isAuthenticated()) {
          // Token válido pero sin cuenta (eliminada): salir limpiamente.
          clearTokens();
          await this.$router.push({ name: 'login' });
          return;
        }
        this.posts = await timelineService.getTimeline();
      } catch {
        this.loadError = 'No se pudo cargar el feed. Inténtalo de nuevo.';
      } finally {
        this.loading = false;
      }
    },
    handlePublished(post: Post): void {
      this.posts.unshift(post);
      this.$toast.add({
        severity: 'success',
        summary: 'Publicado',
        detail: 'Tu publicación ya está en el feed.',
        life: 3000
      });
    }
  },
  mounted() {
    void this.fetchTimeline();
  }
});
</script>

<template>
  <div class="flex flex-column gap-3">
    <div>
      <h1 class="text-2xl font-bold m-0">Inicio</h1>
      <p class="cs-muted m-0 mt-1">Lo último de las personas que sigues.</p>
    </div>

    <PostComposer :current-author="currentAuthor" @published="handlePublished" />

    <LoadingList v-if="loading" :rows="3" />

    <Message v-else-if="loadError" severity="error" :closable="false">{{ loadError }}</Message>

    <EmptyState
      v-else-if="posts.length === 0"
      icon="pi pi-comments"
      title="Aún no hay publicaciones"
      text="Cuando las personas que sigues publiquen algo, lo verás aquí."
    />

    <PostCard
      v-else
      v-for="post in posts"
      :key="post.id"
      :post="post"
      :current-author="currentAuthor"
    />
  </div>
</template>
