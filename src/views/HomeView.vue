<script setup>
import { computed } from 'vue'
import { profile } from '../data/profile'
import { projects } from '../data/projects'
import { getPosts } from '../lib/posts'
import { locale, pick, t } from '../i18n'

// As fontes da resposta: três projetos (em andamento ou concluídos) e os dois posts mais recentes.
const sources = computed(() =>
  [
    ...projects
      .filter((p) => p.status !== 'planned')
      .slice(0, 3)
      .map((p) => ({
        key: 'p-' + p.id,
        to: '/projetos/' + p.id,
        title: pick(p.title),
        meta: t('source.project', { status: t('status.' + p.status) }),
      })),
    ...getPosts(locale.value)
      .slice(0, 2)
      .map((p) => ({ key: 'b-' + p.slug, to: '/blog/' + p.slug, title: p.title, meta: t('source.post', { date: p.dateLabel }) })),
  ].map((s, i) => ({ ...s, n: i + 1 })),
)
</script>

<template>
  <p class="ask">{{ t('home.ask', { name: profile.name }) }}</p>
  <h1 class="hero">{{ pick(profile.headline) }}</h1>
  <p class="intro">
    {{ pick(profile.intro) }}
    <RouterLink v-for="s in sources" :key="s.key" class="cite" :to="s.to" :aria-label="s.title">[{{ s.n }}]</RouterLink>
  </p>

  <h2>{{ t('home.sources') }}</h2>
  <ol class="sources">
    <li v-for="s in sources" :key="s.key">
      <RouterLink class="source" :to="s.to">
        <span class="source-n">[{{ s.n }}]</span>
        <span class="source-title">{{ s.title }}</span>
        <span class="source-meta">{{ s.meta }}</span>
      </RouterLink>
    </li>
  </ol>

  <div class="about">
    <h2>{{ t('home.about') }}</h2>
    <p v-for="(p, i) in pick(profile.about)" :key="i">{{ p }}</p>
  </div>
</template>
