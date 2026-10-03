import { ref } from 'vue'

// Idiomas do site. O primeiro é o padrão quando o navegador não é português nem inglês.
export const LOCALES = [
  { code: 'pt', label: 'PT', name: 'Português', html: 'pt-BR', date: 'pt-BR' },
  { code: 'en', label: 'EN', name: 'English', html: 'en', date: 'en-US' },
]

function initial() {
  try {
    const saved = localStorage.getItem('lang')
    if (LOCALES.some((l) => l.code === saved)) return saved
  } catch {}
  return navigator.language?.toLowerCase().startsWith('pt') ? 'pt' : 'en'
}

export const locale = ref(initial())
const current = () => LOCALES.find((l) => l.code === locale.value)
document.documentElement.lang = current().html

export function setLocale(code) {
  if (!LOCALES.some((l) => l.code === code)) return
  locale.value = code
  document.documentElement.lang = current().html
  try {
    localStorage.setItem('lang', code)
  } catch {}
}

export const dateLocale = () => current().date

// Textos da interface.
const messages = {
  pt: {
    'nav.label': 'Páginas',
    'nav.home': 'Início',
    'nav.projects': 'Projetos',
    'nav.blog': 'Blog',
    'nav.resume': 'Currículo',
    'theme.toggle': 'Alternar tema claro e escuro',
    'lang.label': 'Idioma',

    'title.home': 'Portfólio',
    'title.projects': 'Projetos',
    'title.blog': 'Blog',
    'title.resume': 'Currículo',

    'home.ask': 'O que {name} anda construindo?',
    'home.sources': 'Fontes',
    'home.about': 'Sobre mim',
    'source.project': 'Projeto, {status}',
    'source.post': 'Post, {date}',

    'status.doing': 'em andamento',
    'status.done': 'concluído',
    'status.planned': 'planejado',
    'tab.doing': 'Em andamento',
    'tab.done': 'Concluídos',
    'tab.planned': 'Planejados',

    'projects.title': 'Projetos',
    'projects.sub': 'O que estou fazendo agora, o que já terminei e o que ainda vou construir.',
    'projects.tabs': 'Status dos projetos',
    'projects.empty': 'Nenhum projeto aqui ainda.',
    'project.view': 'Ver o projeto',

    'blog.title': 'Blog',
    'blog.sub': 'Anotações dos meus estudos. Clique em um post para ler.',
    'blog.empty': 'Ainda não há posts.',
    'post.back': '‹ Todos os posts',
    'post.notFound': 'Post não encontrado',
    'post.readTime': '{min} min de leitura',
    'post.onlyPt': 'Este post ainda não foi traduzido e está disponível apenas em português.',

    'resume.title': 'Currículo',
    'resume.sub': 'Resumo da minha trajetória profissional.',

    'footer.title': 'Vamos conversar',
    'footer.text': 'Tem uma vaga, um projeto ou uma dúvida sobre algo que escrevi? Fale comigo.',
    'footer.credit': 'Feito por {name}.',
  },
  en: {
    'nav.label': 'Pages',
    'nav.home': 'Home',
    'nav.projects': 'Projects',
    'nav.blog': 'Blog',
    'nav.resume': 'Resume',
    'theme.toggle': 'Switch between light and dark theme',
    'lang.label': 'Language',

    'title.home': 'Portfolio',
    'title.projects': 'Projects',
    'title.blog': 'Blog',
    'title.resume': 'Resume',

    'home.ask': 'What has {name} been building?',
    'home.sources': 'Sources',
    'home.about': 'About me',
    'source.project': 'Project, {status}',
    'source.post': 'Post, {date}',

    'status.doing': 'in progress',
    'status.done': 'completed',
    'status.planned': 'planned',
    'tab.doing': 'In progress',
    'tab.done': 'Completed',
    'tab.planned': 'Planned',

    'projects.title': 'Projects',
    'projects.sub': 'What I am working on now, what I have finished and what I am still going to build.',
    'projects.tabs': 'Project status',
    'projects.empty': 'No projects here yet.',
    'project.view': 'View project',

    'blog.title': 'Blog',
    'blog.sub': 'Notes from my studies. Click a post to read it.',
    'blog.empty': 'No posts yet.',
    'post.back': '‹ All posts',
    'post.notFound': 'Post not found',
    'post.readTime': '{min} min read',
    'post.onlyPt': 'This post has not been translated yet and is only available in Portuguese.',

    'resume.title': 'Resume',
    'resume.sub': 'A summary of my professional background.',

    'footer.title': "Let's talk",
    'footer.text': 'Have a job, a project or a question about something I wrote? Get in touch.',
    'footer.credit': 'Built by {name}.',
  },
}

// Traduz uma chave da interface, trocando {nome} pelos valores recebidos.
export function t(key, vars = {}) {
  const text = messages[locale.value][key] ?? messages.pt[key] ?? key
  return text.replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? '')
}

// Escolhe o idioma de um dado: aceita texto simples ou { pt, en }.
export function pick(value) {
  if (value && typeof value === 'object' && !Array.isArray(value)) return value[locale.value] ?? value.pt
  return value
}
