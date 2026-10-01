<script setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { profile } from '../data/profile'
import { toggleTheme } from '../composables/useTheme'
import { LOCALES, locale, setLocale, t } from '../i18n'

const route = useRoute()
const themeBtn = ref(null)

const links = [
  { to: '/', key: 'nav.home', section: 'inicio' },
  { to: '/projetos', key: 'nav.projects', section: 'projetos' },
  { to: '/blog', key: 'nav.blog', section: 'blog' },
  { to: '/curriculo', key: 'nav.resume', section: 'curriculo' },
]
</script>

<template>
  <div class="top">
    <RouterLink class="path" to="/">{{ profile.handle }}<span> / portfolio</span></RouterLink>
    <div class="tools">
      <div class="lang" role="group" :aria-label="t('lang.label')">
        <button
          v-for="l in LOCALES"
          :key="l.code"
          type="button"
          :lang="l.html"
          :aria-label="l.name"
          :aria-pressed="locale === l.code"
          @click="setLocale(l.code)"
        >
          {{ l.label }}
        </button>
      </div>
      <button
        ref="themeBtn"
        class="theme"
        type="button"
        :aria-label="t('theme.toggle')"
        @click="toggleTheme(themeBtn)"
      >
        <svg class="i-moon" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
        </svg>
        <svg class="i-sun" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
        </svg>
      </button>
    </div>
  </div>

  <nav class="mainnav" :aria-label="t('nav.label')">
    <RouterLink v-for="l in links" :key="l.to" :to="l.to" custom v-slot="{ href, navigate }">
      <a :href="href" :aria-current="route.meta.section === l.section ? 'page' : null" @click="navigate">{{ t(l.key) }}</a>
    </RouterLink>
  </nav>
</template>
