<script setup>
import { posts } from '../lib/posts'
</script>

<template>
  <h1 class="page">Blog</h1>
  <p class="sub">Anotações dos meus estudos. Clique em um post para ler.</p>

  <div class="posts">
    <RouterLink v-for="p in posts" :key="p.slug" class="post-row" :to="'/blog/' + p.slug">
      <h3>{{ p.title }}</h3>
      <span class="meta">{{ [p.dateLabel, ...p.tags].filter(Boolean).join(' · ') }}</span>
    </RouterLink>
  </div>
  <p v-if="!posts.length" class="sub">Ainda não há posts.</p>
</template>
