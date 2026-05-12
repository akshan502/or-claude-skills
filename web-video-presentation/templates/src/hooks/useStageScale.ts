import { onMounted, onUnmounted, ref } from "vue";

/**
 * Compute the scale needed to fit a 1920x1080 stage inside the current
 * viewport, leaving `marginX` / `marginY` of breathing room around it
 * (so absolutely-positioned UI like the progress bar isn't cropped).
 */
export function useStageScale(
  baseW = 1920,
  baseH = 1080,
  marginX = 80,
  marginY = 100,
) {
  const scale = ref(1);

  function update() {
    const usefulW = Math.max(320, window.innerWidth - marginX * 2);
    const usefulH = Math.max(180, window.innerHeight - marginY * 2);
    scale.value = Math.min(usefulW / baseW, usefulH / baseH);
  }

  onMounted(() => {
    update();
    window.addEventListener("resize", update);
  });

  onUnmounted(() => {
    window.removeEventListener("resize", update);
  });

  return scale;
}
