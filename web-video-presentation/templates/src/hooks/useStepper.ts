import { computed, onMounted, onUnmounted, ref, watch } from "vue";
import type { ChapterDef } from "../registry/types";

/**
 * Bump this when chapter step counts / structure change so old persisted
 * cursors don't land mid-removed-step.
 */
const STORAGE_KEY = "presentation-cursor-v7";

export type Cursor = { chapter: number; step: number };

export interface StepperState {
  cursor: Cursor;
  step: number;
  chapter: number;
  totalChapters: number;
  chapterTotalSteps: number;
  globalIndex: number;
  totalGlobal: number;
  next: () => void;
  prev: () => void;
  jumpToChapter: (idx: number, step?: number) => void;
  jumpToGlobal: (globalIdx: number) => void;
}

const clamp = (n: number, lo: number, hi: number) =>
  Math.max(lo, Math.min(hi, n));

/**
 * Clamp a (possibly stale) cursor to the current chapter list. Persisted
 * cursors can outlive structural changes — fewer chapters, fewer steps,
 * a different scaffolded project sharing the same dev-server origin — so
 * we always re-validate before handing one to render.
 */
function sanitize(cursor: Cursor, chapters: ChapterDef[]): Cursor {
  if (chapters.length === 0) return { chapter: 0, step: 0 };
  const chapter = clamp(cursor.chapter | 0, 0, chapters.length - 1);
  const stepCount = chapters[chapter]!.narrations.length;
  const step = clamp(cursor.step | 0, 0, Math.max(0, stepCount - 1));
  return { chapter, step };
}

export function useStepper(chapters: ChapterDef[]): StepperState {
  // Use a plain object, NOT a ref with a function (Vue's ref would store
  // the function itself as the value instead of calling it).
  const cursor = ref<Cursor>({ chapter: 0, step: 0 });

  // Restore persisted cursor on mount
  onMounted(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        cursor.value = sanitize(parsed, chapters);
      }
    } catch {
      /* ignore */
    }
  });

  // Re-sanitize if the chapter list shape changes after mount
  watch(
    () => chapters,
    () => {
      const next = sanitize(cursor.value, chapters);
      if (next.chapter !== cursor.value.chapter || next.step !== cursor.value.step) {
        cursor.value = next;
      }
    },
    { deep: true, flush: "post" },
  );

  // Persist cursor
  watch(cursor, (val) => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(val));
    } catch {
      /* ignore */
    }
  });

  // Computed accessors so templates can use stepper.step / stepper.chapter
  // without dealing with ref unwrapping on nested objects.
  const step = computed(() => cursor.value.step);
  const chapter = computed(() => cursor.value.chapter);

  const next = () => {
    const cur = cursor.value;
    const c = chapters[cur.chapter]!;
    if (cur.step < c.narrations.length - 1) {
      cursor.value = { ...cur, step: cur.step + 1 };
    } else if (cur.chapter < chapters.length - 1) {
      cursor.value = { chapter: cur.chapter + 1, step: 0 };
    }
  };

  const prev = () => {
    const cur = cursor.value;
    if (cur.step > 0) {
      cursor.value = { ...cur, step: cur.step - 1 };
    } else if (cur.chapter > 0) {
      const p = chapters[cur.chapter - 1]!;
      cursor.value = { chapter: cur.chapter - 1, step: p.narrations.length - 1 };
    }
  };

  const jumpToChapter = (idx: number, step = 0) => {
    const ch = clamp(idx, 0, chapters.length - 1);
    const c = chapters[ch]!;
    cursor.value = {
      chapter: ch,
      step: clamp(step, 0, c.narrations.length - 1),
    };
  };

  const jumpToGlobal = (g: number) => {
    const target = clamp(g, 0, totalGlobal.value - 1);
    let acc = 0;
    for (let i = 0; i < chapters.length; i++) {
      const t = chapters[i]!.narrations.length;
      if (target < acc + t) {
        cursor.value = { chapter: i, step: target - acc };
        return;
      }
      acc += t;
    }
  };

  // Compute derived values
  const offsets: number[] = [];
  let acc = 0;
  for (const c of chapters) {
    offsets.push(acc);
    acc += c.narrations.length;
  }
  const totalGlobal = ref(chapters.reduce((s, c) => s + c.narrations.length, 0));

  const globalIndex = () => (offsets[cursor.value.chapter] ?? 0) + cursor.value.step;

  let keyHandler: ((e: KeyboardEvent) => void) | null = null;

  onMounted(() => {
    keyHandler = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement) return;
      if (e.key === "ArrowRight" || e.key === " ") {
        e.preventDefault();
        next();
      } else if (e.key === "ArrowLeft" || e.key === "Backspace") {
        e.preventDefault();
        prev();
      } else if (e.key === "Home") {
        jumpToChapter(0, 0);
      } else if (e.key === "End") {
        const last = chapters.length - 1;
        jumpToChapter(last, chapters[last]!.narrations.length - 1);
      } else if (e.key >= "1" && e.key <= "9") {
        const n = Number(e.key) - 1;
        if (n < chapters.length) jumpToChapter(n, 0);
      }
    };
    window.addEventListener("keydown", keyHandler);
  });

  onUnmounted(() => {
    if (keyHandler) {
      window.removeEventListener("keydown", keyHandler);
    }
  });

  const ch = chapters[cursor.value.chapter]!;
  return {
    cursor,
    step,
    chapter,
    totalChapters: chapters.length,
    chapterTotalSteps: ch.narrations.length,
    get globalIndex() { return globalIndex(); },
    totalGlobal: totalGlobal.value,
    next,
    prev,
    jumpToChapter,
    jumpToGlobal,
  };
}
