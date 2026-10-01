// status: 'doing' (em andamento) | 'done' (concluído) | 'planned' (planejado)
// "id" vira o endereço: #/projetos/<id>. "link" é opcional.
export const projects = [
  {
    id: 'app-financas-voz',
    status: 'doing',
    title: 'App de finanças por voz',
    text: 'Registro de transações falando: a API do Gemini interpreta a frase e o sistema lança a despesa na categoria certa.',
    tags: ['Java', 'Spring', 'Gemini API'],
  },
  {
    id: 'este-portfolio',
    status: 'doing',
    title: 'Este portfólio',
    text: 'Site com blog de estudos e uma lista de projetos que se atualiza sozinha.',
    tags: ['Vue', 'Vite', 'Markdown'],
  },
  {
    id: 'servidores-mcp',
    status: 'done',
    title: 'Servidores MCP para o dia a dia',
    text: 'Servidores próprios que conectam o Claude Code ao bug tracker e à base de documentação, para consultar e documentar sem sair do terminal.',
    tags: ['MCP', 'Node.js', 'Claude Code'],
    link: 'https://github.com/seu-usuario/seu-repositorio',
  },
  {
    id: 'curriculo-automatico',
    status: 'done',
    title: 'Currículo automatizado por vaga',
    text: 'Fluxo que busca vagas no LinkedIn e gera um currículo ajustado para cada uma. O envio continua manual, de propósito.',
    tags: ['Automação', 'IA'],
    link: 'https://github.com/seu-usuario/seu-repositorio',
  },
  {
    id: 'projeto-rag',
    status: 'planned',
    title: 'Primeiro projeto com RAG',
    text: 'Assistente que responde perguntas sobre uma documentação própria, citando de qual trecho veio cada resposta.',
    tags: ['RAG', 'Embeddings', 'Java'],
  },
  {
    id: 'system-design-case',
    status: 'planned',
    title: 'Estudo de caso de System Design',
    text: 'Desenhar e documentar a arquitetura de um sistema de médio porte, com diagramas e decisões explicadas em um post.',
    tags: ['Arquitetura', 'Escalabilidade'],
  },
]
