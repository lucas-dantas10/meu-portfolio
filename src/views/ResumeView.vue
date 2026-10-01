<script setup>
import { profile } from '../data/profile'
</script>

<template>
  <h1 class="page">Currículo</h1>
  <p class="sub">Resumo da trajetória. Para o PDF completo, coloque o arquivo na pasta public e linke aqui.</p>
  <ul class="xp">
    <li v-for="item in profile.resume" :key="item.title">
      <h3>{{ item.title }}</h3>
      <p class="when">{{ item.when }}</p>
      <p>{{ item.text }}</p>
    </li>
  </ul>
</template>
