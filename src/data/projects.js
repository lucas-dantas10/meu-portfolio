// status: 'doing' (em andamento) | 'done' (concluído) | 'planned' (planejado)
// "id" vira o endereço: #/projetos/<id>. "link" é opcional.
export const projects = [
  {
    id: 'app-financas-voz',
    status: 'done',
    title: 'App de finanças por voz',
    text: 'Registro de transações falando: a API do Gemini interpreta a frase e o sistema lança a despesa na categoria certa.',
    tags: ['Java', 'Spring', 'Gemini API'],
    link: 'https://finflow.luvcode.tech',
  },
  {
    id: 'projeto-rag',
    status: 'doing',
    title: 'Primeiro projeto com RAG',
    text: 'Assistente que responde perguntas sobre uma documentação própria, citando de qual trecho veio cada resposta.',
    tags: ['RAG', 'Chunks', 'Embeddings', 'Gemini API', 'Python'],
  },
  {
    id: 'este-portfolio',
    status: 'doing',
    title: 'Este portfólio',
    text: 'Site com blog de estudos e uma lista de projetos que se atualiza sozinha.',
    tags: ['Vue', 'Vite', 'Markdown'],
  },
  {
    id: 'study-smart',
    status: 'done',
    title: 'Study Smart',
    text: 'Site com blog de estudos e uma lista de projetos que se atualiza sozinha.',
    tags: ['Java', 'Spring Boot', 'PostgreSQL', 'Docker', 'OAuth2.0', 'Vue', 'Vite'],
    link: 'https://study-smart-front.vercel.app',
  },
  // {
  //   id: 'servidores-mcp',
  //   status: 'planned',
  //   title: 'Servidores MCP para o dia a dia',
  //   text: 'Servidores próprios que conectam o Claude Code ao bug tracker e à base de documentação, para consultar e documentar sem sair do terminal.',
  //   tags: ['MCP', 'Node.js', 'Claude Code'],
  //   link: 'https://github.com/seu-usuario/seu-repositorio',
  // },
  // {
  //   id: 'curriculo-automatico',
  //   status: 'done',
  //   title: 'Currículo automatizado por vaga',
  //   text: 'Fluxo que busca vagas no LinkedIn e gera um currículo ajustado para cada uma. O envio continua manual, de propósito.',
  //   tags: ['Automação', 'IA'],
  //   link: 'https://github.com/seu-usuario/seu-repositorio',
  // },
  {
    id: 'system-design-case',
    status: 'doing',
    title: 'Estudo de caso de System Design',
    text: 'Desenhar e documentar a arquitetura de um sistema de médio/grande porte, com diagramas e decisões explicadas em um post.',
    tags: ['Arquitetura', 'Escalabilidade'],
  },
]
