<script setup>
import { computed } from 'vue'
import { getPosts } from '../lib/posts'
import { locale, t } from '../i18n'

const posts = computed(() => getPosts(locale.value))
</script>

<template>
  <h1 class="page">{{ t('blog.title') }}</h1>
  <p class="sub">{{ t('blog.sub') }}</p>

  <div class="posts">
    <RouterLink v-for="p in posts" :key="p.slug" class="post-row" :to="'/blog/' + p.slug">
      <h3 :lang="p.lang === 'pt' ? 'pt-BR' : 'en'">{{ p.title }}</h3>
      <span class="meta">{{ [p.dateLabel, ...p.tags].filter(Boolean).join(' · ') }}</span>
    </RouterLink>
  </div>
  <p v-if="!posts.length" class="sub">{{ t('blog.empty') }}</p>
</template>
