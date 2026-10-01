import { createRouter, createWebHashHistory } from 'vue-router'

// Endereços: #/  #/projetos  #/projetos/<id>  #/blog  #/blog/<arquivo-do-post>  #/curriculo
// "titleKey" é a chave do texto do título da aba (veja src/i18n.js).
const routes = [
  {
    path: '/',
    name: 'inicio',
    component: () => import('./views/HomeView.vue'),
    meta: { section: 'inicio', titleKey: 'title.home' },
  },
  {
    path: '/projetos/:id?',
    name: 'projetos',
    component: () => import('./views/ProjectsView.vue'),
    meta: { section: 'projetos', titleKey: 'title.projects' },
  },
  {
    path: '/blog',
    name: 'blog',
    component: () => import('./views/BlogView.vue'),
    meta: { section: 'blog', titleKey: 'title.blog' },
  },
  {
    path: '/blog/:slug',
    name: 'post',
    component: () => import('./views/PostView.vue'),
    meta: { section: 'blog' }, // o título é definido pela própria página do post
  },
  {
    path: '/curriculo',
    name: 'curriculo',
    component: () => import('./views/ResumeView.vue'),
    meta: { section: 'curriculo', titleKey: 'title.resume' },
  },
  { path: '/:pathMatch(.*)*', redirect: '/' },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior(to, from, saved) {
    if (saved) return saved
    // ao abrir um projeto pelo link, a própria página rola até o card
    if (to.name === 'projetos' && to.params.id) return false
    return { top: 0 }
  },
})

export default router
