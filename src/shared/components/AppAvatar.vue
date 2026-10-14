<script lang="ts">
import { defineComponent } from 'vue';

/** Paleta suave determinista (fondo claro + texto oscuro, buen contraste). */
const PALETTE: Array<{ bg: string; fg: string }> = [
  { bg: '#e0e7ff', fg: '#3730a3' }, // índigo
  { bg: '#ccfbf1', fg: '#0f766e' }, // teal
  { bg: '#fef3c7', fg: '#92400e' }, // ámbar
  { bg: '#ffe4e6', fg: '#9f1239' }, // rosa
  { bg: '#dbeafe', fg: '#1e40af' }, // azul
  { bg: '#ede9fe', fg: '#5b21b6' } // violeta
];

function colorFor(name: string): { bg: string; fg: string } {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = (hash * 31 + name.charCodeAt(i)) | 0;
  }
  const palette = PALETTE[Math.abs(hash) % PALETTE.length];
  return palette ?? PALETTE[0]!;
}

export default defineComponent({
  name: 'AppAvatar',
  props: {
    name: {
      type: String,
      required: true
    },
    size: {
      type: String,
      default: 'normal',
      validator: (value: string) => ['small', 'normal', 'large', 'xlarge'].includes(value)
    }
  },
  computed: {
    initial(): string {
      return (this.name.charAt(0) || '?').toUpperCase();
    },
    colors(): { bg: string; fg: string } {
      return colorFor(this.name);
    },
    sizeClass(): string {
      return `app-avatar-${this.size}`;
    }
  }
});
</script>

<template>
  <span
    class="app-avatar"
    :class="sizeClass"
    :style="{ background: colors.bg, color: colors.fg }"
    aria-hidden="true"
  >
    {{ initial }}
  </span>
</template>

<style scoped>
.app-avatar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 9999px;
  font-weight: 600;
  flex-shrink: 0;
}

.app-avatar-small {
  width: 2rem;
  height: 2rem;
  font-size: 0.8rem;
}

.app-avatar-normal {
  width: 2.75rem;
  height: 2.75rem;
  font-size: 1.1rem;
}

.app-avatar-large {
  width: 3.5rem;
  height: 3.5rem;
  font-size: 1.4rem;
}

.app-avatar-xlarge {
  width: 5rem;
  height: 5rem;
  font-size: 2rem;
}
</style>
