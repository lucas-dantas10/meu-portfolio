<script setup>
import { ref, computed, watch, nextTick, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { projects as manual } from '../data/projects'
import { profile } from '../data/profile'
import { fetchGithubProjects } from '../lib/github'
import ProjectCard from '../components/ProjectCard.vue'

const STATUSES = [
  { key: 'doing', label: 'Em andamento' },
  { key: 'done', label: 'Concluídos' },
  { key: 'planned', label: 'Planejados' },
]

const route = useRoute()
const all = ref([...manual])
const active = ref('doing')
const highlighted = ref('')

const visible = computed(() => all.value.filter((p) => p.status === active.value))
const count = (key) => all.value.filter((p) => p.status === key).length

// Abre a aba certa e destaca o card quando o endereço traz um projeto (#/projetos/<id>).
async function focusProject() {
  const id = route.params.id
  if (!id) return
  const project = all.value.find((p) => p.id === id)
  if (!project) return
  active.value = project.status
  await nextTick()
  const el = document.getElementById('proj-' + id)
  if (!el) return
  el.scrollIntoView({ block: 'center' })
  highlighted.value = id
  setTimeout(() => (highlighted.value = ''), 2200)
}

watch(() => route.params.id, focusProject)

onMounted(async () => {
  await focusProject()
  if (profile.githubUser) {
    const remote = await fetchGithubProjects(profile.githubUser)
    const known = new Set(all.value.map((p) => p.id))
    all.value = [...all.value, ...remote.filter((p) => !known.has(p.id))]
    await focusProject()
  }
})

// Setas do teclado trocam de aba.
const tabEls = ref([])
function onKey(e, i) {
  let next = -1
  if (e.key === 'ArrowRight') next = (i + 1) % STATUSES.length
  if (e.key === 'ArrowLeft') next = (i - 1 + STATUSES.length) % STATUSES.length
  if (next === -1) return
  e.preventDefault()
  active.value = STATUSES[next].key
  tabEls.value[next]?.focus()
}
</script>

<template>
  <h1 class="page">Projetos</h1>
  <p class="sub">O que estou fazendo agora, o que já terminei e o que ainda vou construir.</p>

  <div class="tabs" role="tablist" aria-label="Status dos projetos">
    <button
      v-for="(s, i) in STATUSES"
      :key="s.key"
      :ref="(el) => (tabEls[i] = el)"
      class="tab"
      role="tab"
      :id="'tab-' + s.key"
      aria-controls="panel"
      :aria-selected="active === s.key"
      :tabindex="active === s.key ? 0 : -1"
      @click="active = s.key"
      @keydown="onKey($event, i)"
    >
      {{ s.label }}<span class="n">{{ count(s.key) }}</span>
    </button>
  </div>

  <div id="panel" class="cards" role="tabpanel" :aria-labelledby="'tab-' + active">
    <ProjectCard v-for="p in visible" :key="p.id" :project="p" :highlighted="highlighted === p.id" />
    <p v-if="!visible.length" class="sub">Nenhum projeto aqui ainda.</p>
  </div>
</template>
