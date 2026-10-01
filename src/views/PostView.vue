<script setup>
import { computed, watchEffect } from 'vue'
import { useRoute } from 'vue-router'
import { posts } from '../lib/posts'
import { renderMarkdown } from '../lib/markdown'
import { formatDate } from '../lib/format'
import { profile } from '../data/profile'

const route = useRoute()
const post = computed(() => posts.find((p) => p.slug === route.params.slug))
const html = computed(() => (post.value ? renderMarkdown(post.value.body) : ''))
const meta = computed(() => {
  const p = post.value
  if (!p) return ''
  return [formatDate(p.date, true), `${p.minutes} min de leitura`, p.tags.join(', ')].filter(Boolean).join(' · ')
})

watchEffect(() => {
  if (post.value) document.title = `${post.value.title} · ${profile.name}`
})
</script>

<template>
  <article v-if="post">
    <RouterLink class="back" to="/blog">‹ Todos os posts</RouterLink>
    <h1 class="page">{{ post.title }}</h1>
    <p class="post-meta">{{ meta }}</p>
    <div class="prose" v-html="html"></div>
  </article>
  <div v-else>
    <RouterLink class="back" to="/blog">‹ Todos os posts</RouterLink>
    <h1 class="page">Post não encontrado</h1>
  </div>
</template>
