<script setup lang="ts">
import "./AutoStartGate.css";

interface Props {
  visible: boolean;
  onStart: () => void;
}

const { visible, onStart } = defineProps<Props>();
</script>

<template>
  <div
    v-if="visible"
    class="auto-gate"
    data-no-advance
    @click="onStart"
    role="button"
    tabindex="0"
  >
    <div class="auto-gate-card">
      <div class="auto-gate-kicker">AUTO PLAYBACK</div>
      <div class="auto-gate-title">Press SPACE to start</div>
      <div class="auto-gate-sub">
        Audio plays per step and advances automatically.
        <br />
        Press <kbd>M</kbd> any time to switch modes.
      </div>
    </div>
  </div>
</template>
