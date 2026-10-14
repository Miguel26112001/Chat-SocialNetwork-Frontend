<script lang="ts">
import { defineComponent, type PropType } from 'vue';
import AppAvatar from '@/shared/components/AppAvatar.vue';
import { timelineService } from '@/content/services/timeline.service';
import type { PostAuthor } from '@/content/model/post.entity';

export default defineComponent({
  name: 'PostComposer',
  components: { AppAvatar },
  props: {
    currentAuthor: {
      type: Object as PropType<PostAuthor>,
      required: true
    }
  },
  emits: ['published'],
  data() {
    return {
      content: '',
      publishing: false
    };
  },
  computed: {
    canPublish(): boolean {
      return this.content.trim().length > 0 && !this.publishing;
    }
  },
  methods: {
    async publish(): Promise<void> {
      if (!this.canPublish) {
        return;
      }
      this.publishing = true;
      try {
        const post = await timelineService.publish(this.currentAuthor, this.content.trim());
        this.content = '';
        this.$emit('published', post);
      } finally {
        this.publishing = false;
      }
    }
  }
});
</script>

<template>
  <div class="cs-card composer">
    <div class="flex gap-3">
      <AppAvatar :name="currentAuthor.displayName" size="normal" />
      <Textarea
        v-model="content"
        placeholder="¿Qué está pasando?"
        rows="2"
        auto-resize
        class="flex-grow-1"
        aria-label="Escribe una publicación"
      />
    </div>
    <div class="flex justify-content-end mt-3">
      <Button
        label="Publicar"
        icon="pi pi-send"
        :disabled="!canPublish"
        :loading="publishing"
        @click="publish"
      />
    </div>
  </div>
</template>

<style scoped>
.composer {
  padding: 1.25rem;
}
</style>
