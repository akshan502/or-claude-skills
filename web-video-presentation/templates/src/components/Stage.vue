<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from "vue";
import type { CSSProperties } from "vue";

const props = defineProps<{
  onAdvance: () => void;
}>();

defineSlots<{
  default(): any;
}>();

const containerRef = ref<HTMLElement | null>(null);
const scale = ref(1);

function updateScale() {
  if (!containerRef.value) return;
  const rect = containerRef.value.getBoundingClientRect();
  const scaleX = rect.width / 1920;
  const scaleY = rect.height / 1080;
  scale.value = Math.min(scaleX, scaleY);
}

onMounted(() => {
  updateScale();
  window.addEventListener("resize", updateScale);
});

onUnmounted(() => {
  window.removeEventListener("resize", updateScale);
});

const frameStyle = computed<CSSProperties>(() => ({
  transform: `scale(${scale.value})`,
  transformOrigin: "center center",
}));

function handleClick(e: MouseEvent) {
  const target = e.target as HTMLElement;
  if (target.closest("button, a, input, [data-no-advance]")) return;
  props.onAdvance();
}
</script>

<template>
  <div ref="containerRef" class="app-shell" @click="handleClick">
    <div class="stage-frame" :style="frameStyle">
      <slot />
    </div>
  </div>
</template>
