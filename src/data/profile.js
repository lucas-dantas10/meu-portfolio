// Textos com { pt, en } mudam com o idioma; textos simples valem para os dois.
export const profile = {
  // Endereço público do site (SEO: canonical, Open Graph). Ajuste se usar domínio próprio.
  siteUrl: 'https://lucasdantas.vercel.app/',

  name: 'Lucas',
  handle: 'lucas-dantas', // aparece no topo: seunome / portfolio

  // Se preencher, os projetos são lidos do GitHub (veja o README).
  githubUser: 'lucas-dantas10', // exemplo: 'seu-usuario'

  headline: { pt: 'Coisas que construí.', en: 'Things I have built.' },
  intro: {
    pt: 'Sou desenvolvedor pleno, com experiência em sistemas governamentais, e estou migrando para Software Developer + IA. Aqui ficam meus projetos, o que estou estudando e o que escrevo sobre isso.',
    en: "I'm a mid-level developer with experience in government systems, and I'm transitioning into a Software Developer + AI role. Here you'll find my projects, what I'm studying, and what I write about it.",
  },

  links: [
    { label: 'GitHub', href: 'https://github.com/lucas-dantas10' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/lucas-dantas10' },
    { label: { pt: 'E-mail', en: 'Email' }, href: 'mailto:lucas.dantas.nogueira@gmail.com' },
  ],

  about: {
    pt: [
      'Trabalho há mais de quatro anos como desenvolvedor de software, com foco em sistemas para o setor governamental, onde regra de negócio clara e integração entre serviços fazem a diferença. Sou formado em Sistemas de Informação.',
      'Agora estudo RAG, System Design e inglês, e transformo cada estudo em projeto e em post neste site.',
    ],
    en: [
      'I have been working as a software developer for over four years, focusing on government-sector systems, where clear business rules and service integration make all the difference. I hold a degree in Information Systems.',
      'Now I am studying RAG, System Design and English, and I turn each study into a project and a post on this site.',
    ],
  },

  resume: [
    {
      title: { pt: 'Desenvolvedor pleno', en: 'Mid-level developer' },
      when: {
        pt: 'Vox Tecnologia, sistemas governamentais · abr 2025 – atual',
        en: 'Vox Tecnologia, government systems · Apr 2025 – present',
      },
      text: {
        pt: 'Desenvolvo e mantenho sistemas em Java (Spring Boot) e PHP (Symfony), priorizando qualidade, escalabilidade e boas práticas de engenharia. Lidero a implementação de fluxos complexos em nova arquitetura de workflow, aplicando Design Patterns (Strategy, Factory, Chain of Responsibility) para reduzir acoplamento e facilitar manutenção, e estruturo soluções orientadas a domínio (DDD) em módulos críticos. Otimizei o processamento de mais de 150.000 registros, reduzindo o tempo de execução para menos de 5 segundos com ajustes de performance e reestruturação de consultas. Implemento testes de unidade e integração, reduzindo regressões em produção, e refatoro sistemas legados com SOLID, Clean Code e Object Calisthenics, com pipelines de CI/CD (Jenkins, GitLab). Realizo code reviews, merges e deploys, garantindo entregas seguras e alinhadas às boas práticas da equipe.',
        en: 'I develop and maintain systems in Java (Spring Boot) and PHP (Symfony), prioritizing quality, scalability and solid engineering practices. I lead the implementation of complex flows on a new workflow architecture, applying Design Patterns (Strategy, Factory, Chain of Responsibility) to reduce coupling and ease maintenance, and I structure domain-driven (DDD) solutions in critical modules. I optimized the processing of over 150,000 records, cutting execution time to under 5 seconds through performance tuning and query restructuring. I write unit and integration tests, reducing production regressions, and refactor legacy systems using SOLID, Clean Code and Object Calisthenics, with CI/CD pipelines (Jenkins, GitLab). I perform code reviews, merges and deployments, ensuring safe deliveries aligned with team best practices.',
      },
    },
    {
      title: { pt: 'Desenvolvedor júnior', en: 'Junior developer' },
      when: {
        pt: 'Vox Tecnologia, sistemas governamentais · abr 2024 – abr 2025',
        en: 'Vox Tecnologia, government systems · Apr 2024 – Apr 2025',
      },
      text: {
        pt: 'Conduzi a finalização de um fluxo crítico de alto impacto, com regras de negócio complexas, garantindo a escalabilidade da solução. Colaborei diretamente com analistas de negócio para aprofundar o entendimento do domínio e construir soluções robustas, e reduzi significativamente a incidência de bugs em produção, aumentando a estabilidade do sistema. Desenvolvi um job de relatórios com processamento de mais de 200.000 registros, integrando com serviços SOAP, e automatizei sua execução mensal, reduzindo o tempo de processamento para cerca de 30 segundos com alta confiabilidade. Implementei o controle de execução de jobs com Supervisor, aumentando a previsibilidade das rotinas automatizadas.',
        en: 'I led the completion of a high-impact critical flow with complex business rules, ensuring the solution scaled. I worked directly with business analysts to deepen my understanding of the domain and build robust solutions, and significantly reduced the incidence of production bugs, improving system stability. I built a reporting job processing over 200,000 records, integrating with SOAP services, and automated its monthly execution, cutting processing time to about 30 seconds with high reliability. I implemented job execution control with Supervisor, making automated routines more predictable.',
      },
    },
    {
      title: { pt: 'Desenvolvedor estagiário', en: 'Intern developer' },
      when: {
        pt: 'Credit Cash (empresa encerrada), São Paulo · jun 2022 – jun 2023',
        en: 'Credit Cash (company closed), São Paulo · Jun 2022 – Jun 2023',
      },
      text: {
        pt: 'Automatizei o envio diário de e-mails com relatórios via SMTP, eliminando processos manuais da equipe. Desenvolvi automações com Python e Selenium, aumentando a eficiência operacional dos processos internos. Criei um sistema completo de SLA (fullstack) com Vue.js e Laravel, do zero ao deploy. Entreguei soluções dentro do prazo, com impacto direto na gestão e na produtividade das equipes.',
        en: 'I automated the daily sending of report emails via SMTP, eliminating manual team processes. I built automations with Python and Selenium, increasing the operational efficiency of internal processes. I created a complete fullstack SLA system with Vue.js and Laravel, from scratch to deployment. I delivered solutions on schedule, with direct impact on management and team productivity.',
      },
    },
    {
      title: { pt: 'Bacharelado em Sistemas de Informação', en: "Bachelor's degree in Information Systems" },
      when: { pt: 'Universidade Estácio de Sá', en: 'Universidade Estácio de Sá' },
      text: {
        pt: 'Base em engenharia de software, banco de dados, segurança e redes.',
        en: 'Foundations in software engineering, databases, security and networks.',
      },
    },
  ],
}
