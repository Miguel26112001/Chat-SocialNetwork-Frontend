<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'LoadingList',
  props: {
    rows: {
      type: Number,
      default: 3
    }
  }
});
</script>

<template>
  <div class="flex flex-column gap-3" aria-hidden="true">
    <div v-for="n in rows" :key="n" class="cs-card loading-row">
      <div class="flex align-items-center gap-3">
        <Skeleton shape="circle" size="2.75rem" />
        <div class="flex-grow-1 flex flex-column gap-2">
          <Skeleton width="40%" height="0.9rem" />
          <Skeleton width="70%" height="0.8rem" />
        </div>
      </div>
      <Skeleton width="100%" height="0.8rem" class="mt-3" />
      <Skeleton width="85%" height="0.8rem" />
    </div>
  </div>
</template>

<style scoped>
.loading-row {
  padding: 1.25rem;
}
</style>
