// Textos com { pt, en } mudam com o idioma; textos simples valem para os dois.
export const profile = {
  name: 'Lucas',
  handle: 'lucas-dantas', // aparece no topo: seunome / portfolio

  // Se preencher, os projetos são lidos do GitHub (veja o README).
  githubUser: 'lucas-dantas10', // exemplo: 'seu-usuario'

  headline: { pt: 'Coisas que construí.', en: 'Things I have built.' },
  intro: {
    pt: 'Sou desenvolvedor pleno em sistemas governamentais e estou migrando para Software Developer + IA. Aqui ficam meus projetos, o que estou estudando e o que escrevo sobre isso.',
    en: 'I am a mid-level developer building government systems, moving toward Software Developer + AI. This is where my projects, my studies and my writing live.',
  },

  links: [
    { label: 'GitHub', href: 'https://github.com/lucas-dantas10' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/lucas-dantas10' },
    { label: { pt: 'E-mail', en: 'Email' }, href: 'mailto:lucas.dantas.nogueira@gmail.com' },
  ],

  about: {
    pt: [
      'Trabalho há mais de quatro anos com sistemas para o setor governamental, onde regra de negócio clara e integração entre serviços fazem a diferença. Sou formado em Sistemas de Informação.',
      'Agora estudo RAG, System Design e inglês, e transformo cada estudo em projeto e em post neste site.',
    ],
    en: [
      'I have worked for over four years on systems for the government sector, where clear business rules and integration between services make the difference. I hold a degree in Information Systems.',
      'Now I am studying RAG, System Design and English, and I turn each study into a project and a post on this site.',
    ],
  },

  resume: [
    {
      title: { pt: 'Desenvolvedor pleno', en: 'Mid-level developer' },
      when: {
        pt: 'Empresa de médio porte, sistemas governamentais · 4+ anos',
        en: 'Mid-sized company, government systems · 4+ years',
      },
      text: {
        pt: 'Desenvolvimento e manutenção de sistemas web, integrações entre serviços e investigação de bugs em fluxos de negócio.',
        en: 'Development and maintenance of web systems, integrations between services and bug investigation in business workflows.',
      },
    },
    {
      title: { pt: 'Bacharelado em Sistemas de Informação', en: "Bachelor's degree in Information Systems" },
      when: { pt: 'Universidade Estácio de Sá', en: 'Universidade Estácio de Sá' },
      text: {
        pt: 'Base em engenharia de software, banco de dados e redes.',
        en: 'Foundations in software engineering, databases and networks.',
      },
    },
  ],
}
