<script lang="ts">
import { defineComponent, type PropType } from 'vue';
import AppAvatar from '@/shared/components/AppAvatar.vue';
import { timelineService } from '@/content/services/timeline.service';
import type { Post, PostAuthor, PostComment } from '@/content/model/post.entity';
import { timeAgo } from '@/shared/services/time-ago';

export default defineComponent({
  name: 'PostCard',
  components: { AppAvatar },
  props: {
    post: {
      type: Object as PropType<Post>,
      required: true
    },
    currentAuthor: {
      type: Object as PropType<PostAuthor>,
      required: true
    }
  },
  data() {
    return {
      liked: this.post.likedByMe,
      likeCount: this.post.likeCount,
      commentCount: this.post.commentCount,
      showComments: false,
      comments: [] as PostComment[],
      commentsLoading: false,
      draft: ''
    };
  },
  computed: {
    publishedAgo(): string {
      return timeAgo(this.post.createdAt);
    }
  },
  methods: {
    formatTime(iso: string): string {
      return timeAgo(iso);
    },
    async toggleLike(): Promise<void> {
      const updated = await timelineService.toggleLike(this.post.id);
      if (updated) {
        this.liked = updated.likedByMe;
        this.likeCount = updated.likeCount;
      }
    },
    async toggleComments(): Promise<void> {
      this.showComments = !this.showComments;
      if (this.showComments && this.comments.length === 0) {
        this.commentsLoading = true;
        try {
          this.comments = await timelineService.getComments(this.post.id);
        } finally {
          this.commentsLoading = false;
        }
      }
    },
    async sendComment(): Promise<void> {
      const content = this.draft.trim();
      if (!content) {
        return;
      }
      const comment = await timelineService.addComment(this.post.id, this.currentAuthor, content);
      this.comments.push(comment);
      this.commentCount += 1;
      this.draft = '';
    }
  }
});
</script>

<template>
  <article class="cs-card post-card">
    <div class="flex gap-3 p-4 pb-0">
      <AppAvatar :name="post.author.displayName" size="normal" />
      <div class="flex-grow-1 min-w-0">
        <div class="flex align-items-baseline gap-2 flex-wrap">
          <span class="font-semibold">{{ post.author.displayName }}</span>
          <span class="cs-muted text-sm">@{{ post.author.username }}</span>
          <span class="cs-muted text-sm">· {{ publishedAgo }}</span>
        </div>
        <p class="post-content">{{ post.content }}</p>
      </div>
    </div>

    <div v-if="post.imageUrl" class="post-media">
      <img :src="post.imageUrl" :alt="`Imagen de ${post.author.displayName}`" loading="lazy" />
    </div>

    <div class="flex align-items-center gap-1 px-3 pb-2">
      <Button
        :icon="liked ? 'pi pi-heart-fill' : 'pi pi-heart'"
        :label="String(likeCount)"
        text
        rounded
        :severity="liked ? 'danger' : 'secondary'"
        :aria-pressed="liked"
        :aria-label="liked ? 'Quitar like' : 'Dar like'"
        @click="toggleLike"
      />
      <Button
        icon="pi pi-comment"
        :label="String(commentCount)"
        text
        rounded
        severity="secondary"
        :aria-expanded="showComments"
        aria-label="Ver comentarios"
        @click="toggleComments"
      />
    </div>

    <div v-if="showComments" class="post-comments">
      <div v-if="commentsLoading" class="flex flex-column gap-2">
        <Skeleton width="100%" height="0.8rem" />
        <Skeleton width="70%" height="0.8rem" />
      </div>
      <div v-else class="flex flex-column gap-3">
        <div v-for="comment in comments" :key="comment.id" class="flex gap-2">
          <AppAvatar :name="comment.author.displayName" size="small" />
          <div class="comment-bubble">
            <p class="comment-author">
              {{ comment.author.displayName }}
              <span class="cs-muted font-normal"> · {{ formatTime(comment.createdAt) }}</span>
            </p>
            <p class="comment-text">{{ comment.content }}</p>
          </div>
        </div>
        <p v-if="comments.length === 0" class="cs-muted text-sm m-0">
          Aún no hay comentarios. Sé la primera persona en comentar.
        </p>
        <form @submit.prevent="sendComment" class="flex gap-2">
          <InputText
            v-model="draft"
            placeholder="Escribe un comentario..."
            class="flex-grow-1"
            aria-label="Escribe un comentario"
          />
          <Button icon="pi pi-send" rounded :disabled="!draft.trim()" aria-label="Enviar comentario" type="submit" />
        </form>
      </div>
    </div>
  </article>
</template>

<style scoped>
.post-card {
  overflow: hidden;
}

.post-content {
  margin: 0.35rem 0 0.75rem;
  line-height: 1.55;
  white-space: pre-line;
  overflow-wrap: anywhere;
}

.post-media {
  margin: 0.5rem 1rem 0;
  border: 1px solid var(--cs-border);
  border-radius: var(--cs-radius-sm);
  overflow: hidden;
}

.post-media img {
  display: block;
  width: 100%;
  max-height: 26rem;
  object-fit: cover;
}

.post-comments {
  border-top: 1px solid var(--cs-border);
  padding: 1rem 1.25rem;
}

.comment-bubble {
  background: var(--p-surface-100);
  border-radius: 0 12px 12px 12px;
  padding: 0.6rem 0.9rem;
  min-width: 0;
}

.my-app-dark .comment-bubble {
  background: var(--p-surface-800);
}

.comment-author {
  margin: 0;
  font-size: 0.82rem;
  font-weight: 600;
}

.comment-text {
  margin: 0.15rem 0 0;
  font-size: 0.9rem;
  line-height: 1.5;
  overflow-wrap: anywhere;
}
</style>
