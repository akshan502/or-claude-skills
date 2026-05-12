import { onMounted, onUnmounted, ref, watch } from "vue";

export type PlaybackMode = "manual" | "audio" | "auto";

interface Options {
  /** Audio file path. `null` = no audio for this step (silent). */
  src: string | null;
  /** `manual` = no playback. `audio` = play but don't auto-advance.
   *  `auto` = play and auto-advance when finished. */
  mode: PlaybackMode;
  /** Small breathing pad (ms) after audio finishes before advancing,
   *  in `auto` mode. Default 200ms. Set to 0 if mp3 already has trailing
   *  silence. */
  trailMs?: number;
  /** Fallback duration (ms) for `auto` mode when the audio file is missing
   *  or fails to play. Typically computed from text length. Can be a getter
   *  to track narration length changes reactively. */
  estimateFallbackMs?: number | (() => number);
  /** Called when `auto` mode determines the step is finished. */
  onAutoAdvance: () => void;
  /** Has the user started auto playback? (Browsers block autoplay until
   *  the page receives a user gesture; the AutoStartGate flips this.) */
  autoStarted: boolean;
}

/**
 * Per-step audio playback for the presentation.
 *
 * Manages a single hidden `<audio>` element. Switches `src` whenever the
 * current step changes.
 *
 * In `auto` mode:
 *   - Audio file present → advance `trailMs` after the audio's `ended` event.
 *   - Audio file missing / blocked / src = null → advance after
 *     `estimateFallbackMs` (so previews and silent steps still work).
 *
 * Audio playback is the sole driver of step duration — there is intentionally
 * no "minimum hold" knob. If a chapter's visual animation needs more time,
 * the chapter should write longer narration, split the step, or speed the
 * animation up. This keeps Auto-mode behavior trivially predictable.
 */
export function useAudioPlayer({
  src,
  mode,
  trailMs = 200,
  estimateFallbackMs: estimateFallbackMsOpt = 1500,
  onAutoAdvance,
  autoStarted,
}: Options) {
  const audio = ref<HTMLAudioElement | null>(null);

  const getEstimate = typeof estimateFallbackMsOpt === "function"
    ? estimateFallbackMsOpt
    : () => estimateFallbackMsOpt;

  function advanceAfter(ms: number) {
    if (mode !== "auto") return;
    const timer = window.setTimeout(() => {
      onAutoAdvance();
    }, Math.max(0, ms));
    return timer;
  }

  function cleanup() {
    const prev = audio.value;
    if (prev) {
      prev.pause();
      prev.removeAttribute("src");
      prev.load();
      audio.value = null;
    }
  }

  function startPlayback() {
    cleanup();

    if (mode === "manual") return;
    if (mode === "auto" && !autoStarted) return;

    const est = getEstimate();

    if (src) {
      const a = new Audio(src);
      audio.value = a;
      a.preload = "auto";

      a.addEventListener("ended", () => advanceAfter(trailMs!));
      a.addEventListener("error", () => {
        if (mode === "auto") advanceAfter(est);
      });

      a.play().catch((err) => {
        console.warn("audio play failed:", err);
        if (mode === "auto") advanceAfter(est);
      });
    } else if (mode === "auto") {
      advanceAfter(est);
    }
  }

  watch(
    () => [src, mode, trailMs, autoStarted],
    startPlayback,
    { immediate: true },
  );

  onUnmounted(cleanup);
}
