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
      <p>Feito por {{ profile.name }}.</p>
      <p>Dica: cada projeto e cada post tem link próprio. Clique no título e compartilhe a URL.</p>
    </footer>
  </div>
</template>
