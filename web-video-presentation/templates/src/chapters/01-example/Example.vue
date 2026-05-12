<script setup lang="ts">
import MaskReveal from "../../components/MaskReveal.vue";

interface Props {
  step: number;
}

const { step } = defineProps<Props>();
</script>

<template>
  <!-- Step 0 — magazine cover, headline + kicker + click cue -->
  <div v-if="step === 0" class="ex-scene scene-pad">
    <header class="masthead">
      <span class="brand">Your Presentation</span>
      <span class="issue">Issue · 01 — Replace this</span>
    </header>
    <hr class="rule" :style="{ marginTop: 'var(--space-5)' }" />

    <div class="ex-cover-body">
      <div class="kicker">Chapter 01 — Example</div>
      <h1 class="ex-cover-h">
        <MaskReveal :show="true" :duration="900">
          <span class="serif-cn">这是&nbsp;</span>
        </MaskReveal>
        <MaskReveal :show="true" :delay="300" :duration="900">
          <span class="serif-it ex-em">first&nbsp;step</span>
        </MaskReveal>
        <MaskReveal :show="true" :delay="650" :duration="900">
          <span class="serif-cn">.</span>
        </MaskReveal>
      </h1>
      <div class="ex-cover-foot label-mono">
        <span class="dot-accent" /> &nbsp;Tap anywhere to advance
      </div>
    </div>
  </div>

  <!-- Step 1 — split layout: hero number + body -->
  <div v-else-if="step === 1" class="ex-scene scene-pad">
    <header class="masthead">
      <span class="brand">Your Presentation</span>
      <span class="issue">Issue · 01</span>
    </header>
    <hr class="rule" :style="{ marginTop: 'var(--space-5)' }" />

    <div class="ex-split">
      <div class="ex-split-num hero-num">02</div>
      <div class="ex-split-body">
        <div class="kicker">每一步</div>
        <h2 class="ex-split-h">
          <MaskReveal :show="true" :duration="900">
            <span class="serif-cn">独占&nbsp;</span>
          </MaskReveal>
          <MaskReveal :show="true" :delay="300" :duration="900">
            <span class="serif-it ex-em">整个屏幕</span>
          </MaskReveal>
          <MaskReveal :show="true" :delay="650" :duration="900">
            <span class="serif-cn">.</span>
          </MaskReveal>
        </h2>
        <p class="ex-split-p">
          The current theme controls every visual detail — palette,
          fonts, hero-number style, rule weight, decoration, motion.
          The chapter code is theme-agnostic.
        </p>
      </div>
    </div>
  </div>

  <!-- Step 2 — pull-quote close -->
  <div v-else class="ex-scene scene-pad ex-close">
    <div class="ex-close-inner">
      <div class="kicker">Now</div>
      <div class="pull-quote ex-quote">
        <MaskReveal :show="true" :duration="1100">
          <span class="serif-cn">Replace this with </span>
        </MaskReveal>
        <MaskReveal :show="true" :delay="400" :duration="1100">
          <span class="serif-it ex-em">your own&nbsp;</span>
        </MaskReveal>
        <MaskReveal :show="true" :delay="760" :duration="1100">
          <span class="serif-cn">chapters.</span>
        </MaskReveal>
      </div>
      <div class="ex-close-foot label-mono">
        See SKILL.md / CHAPTER-CRAFT.md / THEMES.md
      </div>
    </div>
  </div>
</template>
