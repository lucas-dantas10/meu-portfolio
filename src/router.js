import { createRouter, createWebHashHistory } from 'vue-router'
import { profile } from './data/profile'

// Endereços: #/  #/projetos  #/projetos/<id>  #/blog  #/blog/<arquivo-do-post>  #/curriculo
const routes = [
  {
    path: '/',
    name: 'inicio',
    component: () => import('./views/HomeView.vue'),
    meta: { section: 'inicio', title: `${profile.name} · Portfólio` },
  },
  {
    path: '/projetos/:id?',
    name: 'projetos',
    component: () => import('./views/ProjectsView.vue'),
    meta: { section: 'projetos', title: `Projetos · ${profile.name}` },
  },
  {
    path: '/blog',
    name: 'blog',
    component: () => import('./views/BlogView.vue'),
    meta: { section: 'blog', title: `Blog · ${profile.name}` },
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
    meta: { section: 'curriculo', title: `Currículo · ${profile.name}` },
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

router.afterEach((to) => {
  if (to.meta.title) document.title = to.meta.title
})

export default router
