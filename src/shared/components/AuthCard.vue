<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'AuthCard',
  props: {
    icon: {
      type: String,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    subtitle: {
      type: String,
      default: ''
    }
  }
});
</script>

<template>
  <div class="auth-page">
    <Card class="auth-card">
      <template #content>
        <div class="flex flex-column align-items-center text-center mb-4">
          <span class="auth-icon"><i :class="icon"></i></span>
          <h1 class="text-2xl font-bold m-0 mt-3">{{ title }}</h1>
          <p v-if="subtitle" class="cs-muted m-0 mt-2">{{ subtitle }}</p>
        </div>
        <slot />
        <div v-if="$slots.footer" class="mt-4">
          <Divider />
          <slot name="footer" />
        </div>
      </template>
    </Card>
  </div>
</template>

<style scoped>
.auth-page {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2.5rem 1rem;
  min-height: 70vh;
}

.auth-card {
  width: 100%;
  max-width: 26rem;
  box-shadow: var(--cs-shadow-md);
}

.auth-icon {
  width: 3rem;
  height: 3rem;
  border-radius: 0.9rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--cs-primary);
  color: #fff;
  font-size: 1.3rem;
}
</style>
