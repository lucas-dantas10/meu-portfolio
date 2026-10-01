<script setup>
import { computed, watchEffect } from 'vue'
import { useRoute } from 'vue-router'
import { getPosts } from '../lib/posts'
import { renderMarkdown } from '../lib/markdown'
import { formatDate } from '../lib/format'
import { profile } from '../data/profile'
import { locale, t } from '../i18n'

const route = useRoute()
const post = computed(() => getPosts(locale.value).find((p) => p.slug === route.params.slug))
const html = computed(() => (post.value ? renderMarkdown(post.value.body) : ''))
const meta = computed(() => {
  const p = post.value
  if (!p) return ''
  return [formatDate(p.date, true), t('post.readTime', { min: p.minutes }), p.tags.join(', ')].filter(Boolean).join(' · ')
})

watchEffect(() => {
  document.title = post.value ? `${post.value.title} · ${profile.name}` : `${t('post.notFound')} · ${profile.name}`
})
</script>

<template>
  <article v-if="post">
    <RouterLink class="back" to="/blog">{{ t('post.back') }}</RouterLink>
    <h1 class="page" :lang="post.lang === 'pt' ? 'pt-BR' : 'en'">{{ post.title }}</h1>
    <p class="post-meta">{{ meta }}</p>
    <p v-if="post.fallback" class="notice">{{ t('post.onlyPt') }}</p>
    <div class="prose" :lang="post.lang === 'pt' ? 'pt-BR' : 'en'" v-html="html"></div>
  </article>
  <div v-else>
    <RouterLink class="back" to="/blog">{{ t('post.back') }}</RouterLink>
    <h1 class="page">{{ t('post.notFound') }}</h1>
  </div>
</template>
