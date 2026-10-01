<script setup>
import { pick, t } from '../i18n'

defineProps({
  project: { type: Object, required: true },
  highlighted: { type: Boolean, default: false },
})
</script>

<template>
  <article :id="'proj-' + project.id" class="card" :class="{ hl: highlighted }">
    <h3>
      <RouterLink :to="'/projetos/' + project.id">{{ pick(project.title) }}</RouterLink>
    </h3>
    <p>{{ pick(project.text) }}</p>
    <ul class="tags">
      <li v-for="tag in project.tags" :key="pick(tag)">{{ pick(tag) }}</li>
    </ul>
    <a v-if="project.link" class="go" :href="project.link" target="_blank" rel="noopener">{{ t('project.view') }}</a>
  </article>
</template>
