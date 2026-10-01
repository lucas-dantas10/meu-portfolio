<script setup>
import { computed } from 'vue'
import { profile } from '../data/profile'
import { projects } from '../data/projects'
import { posts } from '../lib/posts'

const STATUS = { doing: 'em andamento', done: 'concluído' }

// As fontes da resposta: três projetos (em andamento ou concluídos) e os dois posts mais recentes.
const sources = computed(() =>
  [
    ...projects
      .filter((p) => p.status !== 'planned')
      .slice(0, 3)
      .map((p) => ({ key: 'p-' + p.id, to: '/projetos/' + p.id, title: p.title, meta: 'Projeto, ' + STATUS[p.status] })),
    ...posts.slice(0, 2).map((p) => ({ key: 'b-' + p.slug, to: '/blog/' + p.slug, title: p.title, meta: 'Post, ' + p.dateLabel })),
  ].map((s, i) => ({ ...s, n: i + 1 })),
)
</script>

<template>
  <p class="ask">O que {{ profile.name }} anda construindo?</p>
  <h1 class="hero">{{ profile.headline }}</h1>
  <p class="intro">
    {{ profile.intro }}
    <RouterLink v-for="s in sources" :key="s.key" class="cite" :to="s.to" :aria-label="s.title">[{{ s.n }}]</RouterLink>
  </p>

  <h2>Fontes</h2>
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
    <h2>Sobre mim</h2>
    <p v-for="(p, i) in profile.about" :key="i">{{ p }}</p>
  </div>
</template>
