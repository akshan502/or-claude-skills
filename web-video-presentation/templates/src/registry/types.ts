import type { DefineComponent } from "vue";

export interface ChapterStepProps {
  step: number; // 0..(narrations.length - 1)
}

/**
 * Per-step narration text.
 *
 * Empty string ("") means "no audio for this step" (e.g. silent transition
 * shot). Auto mode falls back to a short estimate when audio is missing or
 * the text is empty.
 */
export type Narration = string;

export interface ChapterDef {
  id: string;
  title: string;
  /**
   * Per-step narration text. **Length === total steps in this chapter.**
   * This is the single source of truth for step count and audio synthesis.
   */
  narrations: Narration[];
  Component: DefineComponent<ChapterStepProps>;
}
