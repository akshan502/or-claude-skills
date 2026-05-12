<script setup lang="ts">
// ⚠️ 这是 anchor 参考代码，不会被任何项目编译。
//    抄到真实项目时，把下面两个 import 改成实际路径：
//      import MaskReveal from "../../components/MaskReveal.vue";

import MaskReveal from "../../../templates/src/components/MaskReveal.vue";
import "./chapter.css";

/**
 * hook-chapter · 完整章节示例
 * ─────────────────────────────────────────
 * 默认绑 newsroom 主题（serif + 报头红 + 印刷盖章 motion）。
 *
 * 关键手段：
 * - 真素材：<img src="/hook/{name}.png" /> 而不是 placeholder
 * - 字号狠对比：hero 用 --t-display-1（≥ 144px）+ 微微负字距
 * - 主导动作：mask reveal + 印章砸下（贴 newsroom 印刷气质）
 * - takeover：三张图缩入 + 巨字爆出 + accent 红条贯穿
 * - 收束：brush 划掉旧概念
 *
 * 切其它主题时按那个主题的气质自由换"印章砸下 / brush"等效动作，
 * 结构和字号节奏保持。
 */

defineProps<{ step: number }>();

const reveals = [
  {
    src: "/hook/<asset-1>.png",
    label: "01 / 03",
    caption: "<反例 1 caption，来自 article §X>",
  },
  {
    src: "/hook/<asset-2>.png",
    label: "02 / 03",
    caption: "<反例 2 caption>",
  },
  {
    src: "/hook/<asset-3>.png",
    label: "03 / 03",
    caption: "<反例 3 caption>",
  },
];
</script>

<template>
  <!-- step 1 — 三张 ghost（精修：加 kicker 引子 + accent 红条） -->
  <div v-if="step === 0" class="hk-scene scene-pad">
    <div class="hk-kicker">
      <span class="hk-kicker-line" />
      <span class="hk-kicker-text">这几天</span>
    </div>
    <div class="hk-grid" :key="step">
      <MaskReveal
        v-for="(i, idx) in ['01', '02', '03']"
        :key="i"
        :show="true"
        :delay="idx * 200"
        :duration="900"
      >
        <div class="hk-ghost">
          <span class="hk-ghost-num">{{ i }}</span>
          <span class="hk-ghost-label">image</span>
        </div>
      </MaskReveal>
    </div>
  </div>

  <!-- step 2-4 — 每张图独占（真素材 + 角章 + 旁白） -->
  <div v-else-if="step >= 1 && step <= 3" class="hk-scene scene-pad" :key="step">
    <div class="hk-solo-frame">
      <MaskReveal :show="true" :duration="1100">
        <div class="hk-solo-img-wrap">
          <img class="hk-solo-img" :src="reveals[step - 1].src" :alt="reveals[step - 1].caption" />
          <div class="hk-stamp">FAKE?</div>
        </div>
      </MaskReveal>
      <MaskReveal :show="true" :delay="400" :duration="900">
        <div class="hk-solo-meta">
          <span class="hk-solo-label">{{ reveals[step - 1].label }}</span>
          <span class="hk-solo-caption">{{ reveals[step - 1].caption }}</span>
        </div>
      </MaskReveal>
    </div>
  </div>

  <!-- step 5 — takeover：三张缩入 + 巨字爆出 + accent 红条 -->
  <div v-else-if="step === 4" class="hk-scene scene-pad hk-takeover" :key="step">
    <div class="hk-mini-row">
      <img
        v-for="(r, idx) in reveals"
        :key="r.src"
        class="hk-mini"
        :src="r.src"
        :alt="r.caption"
        :style="{ animationDelay: `${idx * 80}ms` }"
      />
    </div>
    <span class="hk-accent-bar" />
    <h1 class="hk-hero">
      <MaskReveal :show="true" :duration="1100">
        &lt;主题大字 takeover&gt;
      </MaskReveal>
    </h1>
  </div>

  <!-- step 6 — 钩子收束：brush 划掉 -->
  <div v-else class="hk-scene scene-pad hk-close" :key="step">
    <div class="hk-quote-wrap">
      <h2 class="hk-quote">&lt;下一句钩子&gt;</h2>
      <span class="hk-brush" aria-hidden />
    </div>
  </div>
</template>
