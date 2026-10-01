<script setup>
import { profile } from '../data/profile'
import { pick, t } from '../i18n'
</script>

<template>
  <h1 class="page">{{ t('resume.title') }}</h1>
  <p class="sub">{{ t('resume.sub') }}</p>
  <ul class="xp">
    <li v-for="(item, i) in profile.resume" :key="i">
      <h3>{{ pick(item.title) }}</h3>
      <p class="when">{{ pick(item.when) }}</p>
      <p>{{ pick(item.text) }}</p>
    </li>
  </ul>
</template>
