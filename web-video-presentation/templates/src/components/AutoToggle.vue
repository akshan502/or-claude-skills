<script setup lang="ts">
import type { PlaybackMode } from "../hooks/useAudioPlayer";
import "./AutoToggle.css";

interface Props {
  mode: PlaybackMode;
  onCycle: () => void;
}

const { mode, onCycle } = defineProps<Props>();

const LABEL: Record<PlaybackMode, string> = {
  manual: "MANUAL",
  audio: "AUDIO",
  auto: "AUTO",
};
</script>

<template>
  <div class="at-hover" data-no-advance>
    <button
      :class="['at-btn', `at-${mode}`]"
      @click.stop="onCycle"
      title="切换播放模式（M）"
    >
      <span class="at-dot" />
      <span class="at-label">{{ LABEL[mode] }}</span>
    </button>
  </div>
</template>
