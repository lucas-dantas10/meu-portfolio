<script setup>
import { watchEffect } from 'vue'
import { useRoute } from 'vue-router'
import SiteHeader from './components/SiteHeader.vue'
import { profile } from './data/profile'
import { pick, t } from './i18n'

const route = useRoute()

// O título da aba acompanha a página e o idioma (a página de um post define o próprio título).
watchEffect(() => {
  const key = route.meta.titleKey
  if (key) document.title = `${t(key)} · ${profile.name}`
})
</script>

<template>
  <div class="wrap" id="topo">
    <SiteHeader />
    <main>
      <RouterView />
    </main>
    <footer>
      <h2>{{ t('footer.title') }}</h2>
      <p>{{ t('footer.text') }}</p>
      <ul class="contact">
        <li v-for="l in profile.links" :key="l.href">
          <a :href="l.href" :target="/^https?:/i.test(l.href) ? '_blank' : null" rel="noopener noreferrer">{{ pick(l.label) }}</a>
        </li>
      </ul>
      <p class="credit">{{ t('footer.credit', { name: profile.name }) }}</p>
    </footer>
  </div>
</template>
