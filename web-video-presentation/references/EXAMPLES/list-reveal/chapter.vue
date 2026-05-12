<script setup lang="ts">
// ⚠️ 这是 anchor 参考代码，不会被任何项目编译。
//    抄到真实项目时，把下面两个 import 改成实际路径：
//      import MaskReveal from "../../components/MaskReveal.vue";

import MaskReveal from "../../../templates/src/components/MaskReveal.vue";
import "./chapter.css";

/**
 * list-reveal · 完整章节示例
 * ─────────────────────────────────────────
 * 默认绑 newsroom 主题。
 *
 * 关键手段：
 * - 槽位用 hero-num（serif 巨号）替代普通文字编号
 * - 引子用 masthead 双线规则 + serif 大字
 * - 槽位状态切换有专属动画：
 *     ghost  → active：mask reveal 标题 + 数字砸下（accent 红）
 *     active → past   ：accent 灰化（filter）
 * - 关键：所有槽位的 Vue 节点位置不重排，只切换 className
 */

interface Item {
  num: string;
  title: string;
  body: string;
}

const ITEMS: Item[] = [
  { num: "01", title: "文字渲染", body: "图里的文字也能正确写出来" },
  { num: "02", title: "指令遵循", body: "可以给到非常具体的要求" },
  { num: "03", title: "照片真实感", body: "光影 / 材质 / 人物接近真实" },
];

defineProps<{ step: number }>();

function slotState(idx: number, activeIdx: number): "ghost" | "active" | "past" {
  return idx < activeIdx ? "past" : idx === activeIdx ? "active" : "ghost";
}
</script>

<template>
  <!-- step 1 — 引子 -->
  <div v-if="step === 0" class="lr-scene scene-pad lr-intro">
    <header class="lr-masthead">
      <span class="lr-rule" />
      <span class="lr-kicker">第一部分</span>
      <span class="lr-rule" />
    </header>
    <MaskReveal :show="true" :duration="1100">
      <h1 class="lr-intro-h">
        强在<span class="lr-em">哪</span>
      </h1>
    </MaskReveal>
    <MaskReveal :show="true" :delay="400" :duration="900">
      <div class="lr-intro-sub">三件事 —— 一个个看</div>
    </MaskReveal>

    <div class="lr-grid">
      <div v-for="it in ITEMS" :key="it.num" class="lr-slot lr-slot-ghost">
        <div class="lr-slot-num">{{ it.num }}</div>
      </div>
    </div>
  </div>

  <!-- step 2-N — 逐个揭示 -->
  <div v-else class="lr-scene scene-pad">
    <header class="lr-masthead">
      <span class="lr-rule" />
      <span class="lr-kicker">第一部分 · 强在哪</span>
      <span class="lr-rule" />
    </header>

    <div class="lr-grid">
      <div
        v-for="(it, i) in ITEMS"
        :key="it.num"
        :class="['lr-slot', `lr-slot-${slotState(i, step - 1)}`]"
      >
        <div class="lr-slot-num">{{ it.num }}</div>
        <div class="lr-slot-content">
          <MaskReveal v-if="slotState(i, step - 1) !== 'ghost'" :show="true" :duration="900" :key="`${it.num}-title`">
            <div class="lr-slot-title">{{ it.title }}</div>
          </MaskReveal>
          <MaskReveal v-if="slotState(i, step - 1) === 'active'" :show="true" :delay="350" :duration="900">
            <div class="lr-slot-body">{{ it.body }}</div>
          </MaskReveal>
        </div>
      </div>
    </div>
  </div>
</template>
