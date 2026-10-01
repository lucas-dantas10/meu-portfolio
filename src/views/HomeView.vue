<script setup>
import { profile } from '../data/profile'
</script>

<template>
  <h1 class="hero">{{ profile.headline }}</h1>
  <p class="intro">{{ profile.intro }}</p>
  <ul class="social">
    <li v-for="l in profile.links" :key="l.label">
      <a :href="l.href" rel="noopener">{{ l.label }}</a>
    </li>
  </ul>

  <div class="about">
    <h2>Sobre mim</h2>
    <p v-for="(p, i) in profile.about" :key="i">{{ p }}</p>
  </div>
</template>
