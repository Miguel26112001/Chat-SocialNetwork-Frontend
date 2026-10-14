<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'EmptyState',
  props: {
    icon: {
      type: String,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    text: {
      type: String,
      default: ''
    },
    actionLabel: {
      type: String,
      default: ''
    }
  },
  emits: ['action']
});
</script>

<template>
  <div class="cs-card flex flex-column align-items-center text-center py-8 px-4 gap-2">
    <span class="empty-icon border-circle inline-flex align-items-center justify-content-center"><i :class="icon"></i></span>
    <h3 class="empty-title m-0 font-semibold">{{ title }}</h3>
    <p v-if="text" class="cs-muted empty-text m-0">{{ text }}</p>
    <Button
      v-if="actionLabel"
      :label="actionLabel"
      outlined
      @click="$emit('action')"
    />
  </div>
</template>

<style scoped>
.empty-icon {
  width: 3rem;
  height: 3rem;
  background: var(--p-surface-100);
  color: var(--cs-text-muted);
  font-size: 1.25rem;
  margin-bottom: 0.5rem;
}

.empty-title {
  font-size: 1.05rem;
}

.empty-text {
  margin-bottom: 0.75rem;
  font-size: 0.9rem;
  max-width: 26rem;
}
</style>
