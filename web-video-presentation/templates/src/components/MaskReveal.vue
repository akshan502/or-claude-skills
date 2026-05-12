<script setup lang="ts">
import { computed } from "vue";
import type { CSSProperties } from "vue";

interface Props {
  show: boolean;
  delay?: number;
  duration?: number;
  className?: string;
}

const props = defineProps<Props>();

defineSlots<{
  default(): any;
}>();

const cls = computed(() => {
  return ["mask-reveal", props.show ? "in" : "", props.className]
    .filter(Boolean)
    .join(" ");
});

const style = computed<CSSProperties>(() => ({
  display: "inline-block",
  transitionDelay: props.show ? `${props.delay}ms` : "0ms",
  ...(props.duration ? { transitionDuration: `${props.duration}ms` } : {}),
}));
</script>

<template>
  <span :class="cls" :style="style">
    <slot />
  </span>
</template>
