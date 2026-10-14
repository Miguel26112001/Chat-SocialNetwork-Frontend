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
  <div class="cs-card empty-state">
    <span class="empty-icon"><i :class="icon"></i></span>
    <h3 class="empty-title">{{ title }}</h3>
    <p v-if="text" class="cs-muted empty-text">{{ text }}</p>
    <Button
      v-if="actionLabel"
      :label="actionLabel"
      outlined
      @click="$emit('action')"
    />
  </div>
</template>

<style scoped>
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 3rem 1.5rem;
  gap: 0.5rem;
}

.empty-icon {
  width: 3rem;
  height: 3rem;
  border-radius: 9999px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--p-surface-100);
  color: var(--cs-text-muted);
  font-size: 1.25rem;
  margin-bottom: 0.5rem;
}

.empty-title {
  margin: 0;
  font-size: 1.05rem;
  font-weight: 600;
}

.empty-text {
  margin: 0 0 0.75rem;
  font-size: 0.9rem;
  max-width: 26rem;
}
</style>
