<script setup>
defineProps({
  project: { type: Object, required: true },
  highlighted: { type: Boolean, default: false },
})
</script>

<template>
  <article :id="'proj-' + project.id" class="card" :class="{ hl: highlighted }">
    <h3>
      <RouterLink :to="'/projetos/' + project.id">{{ project.title }}</RouterLink>
    </h3>
    <p>{{ project.text }}</p>
    <ul class="tags">
      <li v-for="t in project.tags" :key="t">{{ t }}</li>
    </ul>
    <a v-if="project.link" class="go" :href="project.link" target="_blank" rel="noopener">Ver o projeto</a>
  </article>
</template>
