// status: 'doing' (em andamento) | 'done' (concluído) | 'planned' (planejado)
// "id" vira o endereço: #/projetos/<id>. "link" é opcional.
// title e text aceitam { pt, en } ou um texto simples que vale para os dois idiomas.
export const projects = [
  {
    id: 'app-financas-voz',
    status: 'done',
    title: { pt: 'App de finanças por voz', en: 'Voice-powered finance app' },
    text: {
      pt: 'Registro de transações falando: a API do Gemini interpreta a frase e o sistema lança a despesa na categoria certa.',
      en: 'Log transactions by speaking: the Gemini API interprets the sentence and the system records the expense in the right category.',
    },
    tags: ['Java', 'Spring Boot', 'PostgreSQL', 'Docker', 'OAuth2.0', 'Gemini API'],
    link: 'https://finflow.luvcode.tech',
  },
  {
    id: 'projeto-rag',
    status: 'doing',
    title: { pt: 'Primeiro projeto com RAG', en: 'First RAG project' },
    text: {
      pt: 'Assistente que responde perguntas sobre uma documentação própria, citando de qual trecho veio cada resposta.',
      en: 'An assistant that answers questions about my own documentation, citing which passage each answer came from.',
    },
    tags: ['RAG', 'Chunks', 'Embeddings', 'Gemini API', 'Python'],
  },
  {
    id: 'este-portfolio',
    status: 'doing',
    title: { pt: 'Este portfólio', en: 'This portfolio' },
    text: {
      pt: 'Site com blog de estudos e uma lista de projetos que se atualiza sozinha.',
      en: 'A site with a study blog and a project list that updates itself.',
    },
    tags: ['Vue', 'Vite', 'Markdown'],
  },
  {
    id: 'study-smart',
    status: 'done',
    title: 'Study Smart',
    text: {
      pt: 'Site foi projetado para ajudar a aprender e memorizar informações usando cartões de estudo.',
      en: 'The site was designed to help learn and memorize information using study cards.',
    },
    tags: ['Java', 'Spring Boot', 'PostgreSQL', 'Docker', 'OAuth2.0', 'Vue', 'Vite'],
    link: 'https://study-smart-front.vercel.app',
  },
  // {
  //   id: 'servidores-mcp',
  //   status: 'planned',
  //   title: { pt: 'Servidores MCP para o dia a dia', en: 'MCP servers for everyday work' },
  //   text: {
  //     pt: 'Servidores próprios que conectam o Claude Code ao bug tracker e à base de documentação, para consultar e documentar sem sair do terminal.',
  //     en: 'Custom servers that connect Claude Code to the bug tracker and the documentation base, to query and document without leaving the terminal.',
  //   },
  //   tags: ['MCP', 'Node.js', 'Claude Code'],
  //   link: 'https://github.com/seu-usuario/seu-repositorio',
  // },
  // {
  //   id: 'curriculo-automatico',
  //   status: 'done',
  //   title: { pt: 'Currículo automatizado por vaga', en: 'Resume automatically tailored per job' },
  //   text: {
  //     pt: 'Fluxo que busca vagas no LinkedIn e gera um currículo ajustado para cada uma. O envio continua manual, de propósito.',
  //     en: 'A workflow that finds jobs on LinkedIn and generates a resume tailored to each one. Sending stays manual, on purpose.',
  //   },
  //   tags: ['Automação', 'IA'],
  //   link: 'https://github.com/seu-usuario/seu-repositorio',
  // },
  {
    id: 'system-design-case',
    status: 'doing',
    title: { pt: 'Estudo de caso de System Design', en: 'System Design case study' },
    text: {
      pt: 'Desenhar e documentar a arquitetura de um sistema de médio/grande porte, com diagramas e decisões explicadas em um post.',
      en: 'Design and document the architecture of a medium/large system, with diagrams and decisions explained in a post.',
    },
    tags: [{ pt: 'Arquitetura', en: 'Architecture' }, { pt: 'Escalabilidade', en: 'Scalability' }],
  },
]
