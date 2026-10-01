<script setup>
import SiteHeader from './components/SiteHeader.vue'
import { profile } from './data/profile'
</script>

<template>
  <div class="wrap" id="topo">
    <SiteHeader />
    <main>
      <RouterView />
    </main>
    <footer>
      <h2>Vamos conversar</h2>
      <p>Tem uma vaga, um projeto ou uma dúvida sobre algo que escrevi? Fale comigo.</p>
      <ul class="contact">
        <li v-for="l in profile.links" :key="l.label">
          <a :href="l.href" :target="/^https?:/i.test(l.href) ? '_blank' : null" rel="noopener noreferrer">{{ l.label }}</a>
        </li>
      </ul>
      <p class="credit">Feito por {{ profile.name }}.</p>
    </footer>
  </div>
</template>
