---
title: Claude Code na prática: subagentes, skills e commands personalizados
date: 2026-10-08
tags: Claude Code, IA, Agentes, Produtividade, Spring Boot
---
Quando comecei a usar o Claude Code para desenvolver um projeto pessoal, percebi que pedir "construa o app" em um único prompt não funciona bem. O resultado melhora muito quando você divide o trabalho em **papéis** (subagentes), dá a cada papel o **conhecimento certo** (skills) e automatiza o roteiro repetitivo com **commands personalizados**.

Neste post mostro o passo a passo, com os arquivos que usei. Os exemplos usam uma aplicação Spring Boot com Thymeleaf, HTMX e Tailwind, mas a estrutura serve para qualquer stack.

## Visão geral da estrutura

Tudo fica dentro do repositório, na pasta `.claude/`, e pode ser versionado no git:

```
meu-projeto/
├── CLAUDE.md
├── docs/
│   └── mvp.md
└── .claude/
    ├── settings.json
    ├── agents/
    │   ├── backend.md
    │   ├── frontend.md
    │   ├── tester.md
    │   └── reviewer.md
    ├── skills/
    │   └── minha-skill/
    │       └── SKILL.md
    └── commands/
        └── feature.md
```

## Passo 1: crie o `CLAUDE.md`

O `CLAUDE.md` na raiz é a memória do projeto. O Claude Code o lê em toda sessão, e os subagentes também. Coloque nele:

- objetivo do projeto e escopo do MVP;
- stack e decisões de arquitetura;
- estrutura de pacotes;
- comandos para rodar, testar e buildar;
- convenções de código.

Exemplo enxuto:

```markdown
# Meu Projeto

Modular monolith with Spring Boot, Thymeleaf (server-side rendering), HTMX and Tailwind.

## Commands
- Run: `./mvnw spring-boot:run`
- Test: `./mvnw test`

## Conventions
- One package per module (e.g. `dates`, `restaurants`).
- All code, names and comments in English.
- Always run commands from the project root. Never use `cd`; use relative paths.
- No premature optimization.
```

Dica: mantenha curto. Esse arquivo é carregado em toda execução, então cada linha custa tokens.

## Passo 2: escreva a especificação antes do código

Antes de criar agentes, peça ao Claude (em plan mode, com `Shift+Tab`) para gerar um `docs/mvp.md` com entidades, telas e fluxos de cada módulo. Revise você mesmo. Uma boa especificação rende mais do que um agente extra.

O nome `docs/mvp.md` é só um exemplo: pode ser qualquer outro, como `spec.md` ou `docs/requisitos.md`. O importante é que o `CLAUDE.md` e os agentes apontem para o nome que você escolheu.

## Passo 3: crie os subagentes

Subagentes são arquivos Markdown em `.claude/agents/`. Você pode criá-los interativamente com o comando `/agents` (escolha *Create new agent* e depois *Project*) ou escrever o arquivo na mão.

Cada arquivo tem um frontmatter com:

| Campo | Para que serve |
|---|---|
| `name` | Identificador do agente |
| `description` | Quando o Claude deve delegar para ele. É o campo mais importante |
| `tools` | Ferramentas permitidas (limite por papel) |
| `model` | Modelo usado (`haiku`, `sonnet`, `opus`) |
| `skills` | Skills injetadas no contexto do agente (veja o Passo 4) |
| `permissionMode` | Modo de permissão só para esse agente |

O texto abaixo do frontmatter é o prompt de sistema do agente.

### Agente `backend`

```markdown
---
name: backend
description: Implements the Spring Boot backend (entities, services, controllers, Flyway migrations). Use proactively for any server-side task.
tools: Read, Edit, Write, Bash, Grep, Glob
model: sonnet
---

You are the backend developer of a modular monolith (Spring Boot + Thymeleaf + HTMX).

- Read CLAUDE.md and docs/mvp.md before starting.
- Keep each module self-contained (one package per module).
- All code, names and comments in English.
- Write tests for every service you create and run `./mvnw test` before finishing.
- Never touch templates; that is the frontend agent's job.
- Finish with a short summary: files changed, tests run, open questions.
```

### Agente `frontend`

```markdown
---
name: frontend
description: Builds and polishes the UI (Thymeleaf templates, HTMX interactions, Tailwind styling). Use proactively for any screen, layout, component or UX task.
tools: Read, Edit, Write, Bash, Grep, Glob
model: sonnet
---

You are the frontend developer. Stack: Thymeleaf server-side rendering, HTMX for interactions, Tailwind for styling.

Before starting, read CLAUDE.md and docs/mvp.md.

Rules:
- Server-rendered first. Use HTMX attributes (hx-get, hx-post, hx-target, hx-swap) for partial updates; no SPA frameworks.
- Use Thymeleaf fragments for anything reused (layout, cards, forms, empty states).
- Mobile first. Good empty, loading and error states.
- Accessibility basics: labels on inputs, enough contrast, keyboard-friendly.
- Only edit files under src/main/resources/templates and src/main/resources/static. Never change Java code; if a controller change is needed, report it.

Finish with a short summary: templates changed, HTMX endpoints expected from the backend, open questions.
```

### Agente `tester`

```markdown
---
name: tester
description: Writes and runs tests (unit, slice and integration). Use proactively after any backend or frontend change, and before every commit.
tools: Read, Edit, Write, Bash, Grep, Glob
model: sonnet
---

You are the test engineer of this Spring Boot project.

Before starting, read CLAUDE.md and run `git diff` to see what changed.

Rules:
- Cover services with unit tests, controllers with @WebMvcTest, repositories with @DataJpaTest, and critical flows with @SpringBootTest.
- Test behavior, not implementation. Include failure paths and edge cases.
- Only edit files under src/test. Never change production code to make a test pass; if you find a bug, report it with a failing test.
- Run `./mvnw test` at the end. The suite must be green before you finish.
- Never skip, disable or loosen existing tests.

Finish with: tests added, command run, result (pass/fail counts), bugs found.
```

### Agente `reviewer` (somente leitura)

Repare que ele não tem `Edit` nem `Write` nos `tools`. Isso garante que o revisor só revisa e não "conserta" escondido.

```markdown
---
name: reviewer
description: Reviews code changes against CLAUDE.md and docs/mvp.md. Use proactively after the tester finishes and before any commit. Read-only.
tools: Read, Grep, Glob, Bash
model: opus
---

You are a strict but fair code reviewer. You never edit files.

Process:
1. Read CLAUDE.md and docs/mvp.md.
2. Run `git diff` and `git status`.
3. Review the changes against the checklist.

Checklist:
- Matches the spec and module boundaries.
- Security: authorization, no secrets in code, validated inputs, CSRF intact.
- Correctness: null handling, transactions, N+1 queries, safe migrations.
- Tests: new behavior covered, suite green (`./mvnw test`).
- UI: HTMX endpoints return the right fragments, templates reuse fragments.
- Conventions: code in English, no dead code, no premature optimization.

Output:
- **Blocking**: file:line, problem, suggested fix.
- **Non-blocking**: improvements worth considering.
- **Verdict**: APPROVE or REQUEST CHANGES.
```

### Boas práticas para agentes

- A `description` decide quando o Claude delega sozinho. Frases como "Use proactively" ajudam.
- Limite os `tools` por papel. Menos poder significa menos erro.
- Subagentes não chamam outros subagentes. Quem orquestra é a sessão principal (por isso o command do Passo 5).
- Rode `/agents` para conferir se todos carregaram sem erro de frontmatter.

## Passo 4: adicione skills aos subagentes

Duas coisas importantes:

1. Subagentes **não herdam** as skills da conversa principal. Você precisa listar cada uma explicitamente.
2. O campo `skills` **injeta o conteúdo completo** da skill no contexto do agente quando ele inicia.

### 4.1 Crie a skill

Uma skill é uma pasta em `.claude/skills/<nome>/` com um `SKILL.md`:

```markdown
---
name: ui-guide
description: Design tokens and UI patterns (colors, spacing, card and form patterns, HTMX conventions).
---

# UI guide

- Palette: warm neutrals with one accent color (define Tailwind tokens in tailwind.config).
- Cards: rounded-2xl, soft shadow, p-4 on mobile.
- Forms: label above input, inline validation message, primary button full width on mobile.
- Empty states: short friendly text plus one clear call to action.
- HTMX: forms use hx-post with hx-target="closest section" and hx-swap="outerHTML".
```

### 4.2 Referencie a skill no agente

No frontmatter do agente, liste o nome da skill (igual ao `name` dela):

```markdown
---
name: frontend
description: ...
tools: Read, Edit, Write, Bash, Grep, Glob
skills:
  - ui-guide
---
```

Dá para listar várias. Por exemplo, o `tester` pode receber uma skill `spring-test-patterns`.

### Dicas sobre skills

- Mantenha cada skill curta e específica: todo o texto entra no contexto do agente a cada execução.
- Skills que só fazem sentido na sessão principal ficam fora do campo `skills` dos agentes.

## Passo 5: crie commands personalizados

Commands são atalhos para prompts que você repete. Cada arquivo em `.claude/commands/` vira um comando `/nome`. O command abaixo orquestra todo o ciclo de uma fatia de funcionalidade, chamando os agentes na ordem certa.

Arquivo `.claude/commands/feature.md`:

```markdown
---
description: Build a full vertical slice of a feature
argument-hint: <module and feature, e.g. "dates: ideas with voting">
---

Implement: $ARGUMENTS

1. Read docs/mvp.md and write a short plan (entities, endpoints, screens).
2. Delegate to the backend agent (entities, service, controller, migration).
3. Delegate to the frontend agent (templates, HTMX interactions, Tailwind).
4. Delegate to the tester agent to cover the new code and run the full suite.
5. Delegate to the reviewer agent; fix every blocking issue it reports.
6. When tests are green, commit on a feature branch with a clear message.
```

Uso:

```
/feature dates: ideas with voting
```

O texto digitado depois do nome do comando substitui `$ARGUMENTS`. O campo `argument-hint` aparece como dica no autocomplete.

## Passo 6: configure permissões para trabalhar com autonomia

Por padrão o Claude Code pede aprovação a cada edição e a cada comando. Para os agentes trabalharem sem interrupção, configure `.claude/settings.json`:

```json
{
  "permissions": {
    "defaultMode": "acceptEdits",
    "allow": [
      "Read",
      "Grep",
      "Glob",
      "Edit",
      "Write",
      "Bash(ls:*)",
      "Bash(cat:*)",
      "Bash(grep:*)",
      "Bash(find:*)",
      "Bash(pwd)",
      "Bash(./mvnw:*)",
      "Bash(git status)",
      "Bash(git diff:*)",
      "Bash(git add:*)",
      "Bash(git commit:*)"
    ],
    "deny": [
      "Read(./.env)",
      "Bash(git push:*)",
      "Bash(rm -rf:*)"
    ]
  }
}
```

Alternativas:

- `Shift+Tab` alterna para o modo *accept edits* só na sessão atual.
- `permissionMode: acceptEdits` no frontmatter de um agente vale só para ele.
- `/permissions` mostra as regras ativas e deixa editar de forma interativa.

### Se ainda pedir permissão para `cd` e leitura de arquivos

- Abra o Claude sempre na **raiz do repositório**. Fora do diretório do projeto, leitura e edição pedem aprovação.
- Evite comandos como `cd pasta && comando`: eles caem em regras mais rígidas. Por isso o `CLAUDE.md` do Passo 1 diz para usar caminhos relativos.
- Pastas fora da raiz podem ser liberadas em `additionalDirectories`.
- Uma regra `ask` ou `deny` mais específica tem prioridade sobre um `allow` geral. Confira no `/permissions`.

### Autonomia com segurança

Autonomia sem testes só produz bugs mais rápido. Um hook que roda a suíte antes de o agente encerrar (por exemplo, `./mvnw test` em um hook de `Stop`) obriga o trabalho a terminar com tudo verde. Para execuções sem supervisão, existe o modo headless (`claude -p "/feature ..."`) e a flag `--dangerously-skip-permissions`, que pula todas as confirmações. Use essa flag **apenas em container ou VM isolados**.

## Atenção ao consumo de tokens

Usar agentes gasta mais tokens do que uma conversa única, e isso é esperado:

- cada subagente começa com contexto próprio e relê `CLAUDE.md`, a especificação e os arquivos relevantes;
- as skills listadas entram inteiras no contexto de cada agente;
- o ciclo completo (plano, backend, frontend, testes, revisão, correção) multiplica as chamadas.

Para medir, use `/cost` na sessão ou a ferramenta `ccusage`, que lê os logs locais.

Como reduzir sem abandonar os agentes:

1. Escolha o modelo por papel: `haiku` ou `sonnet` para testes e frontend, `opus` só onde o raciocínio mais pesado compensa.
2. Use agentes apenas em tarefas grandes; ajustes pequenos faça na sessão principal.
3. Mantenha `CLAUDE.md` e skills curtos, e divida a especificação por módulo.
4. Comece com menos agentes (por exemplo, backend e frontend juntos) e rode o `reviewer` só no fim de cada fatia.
5. Peça saída enxuta nos testes (`./mvnw -q test`).
6. Use `/clear` entre fatias e `/compact` em sessões longas.

## Ordem sugerida para começar

1. Repositório limpo com git e esqueleto mínimo do projeto.
2. `CLAUDE.md` curto e `docs/mvp.md` revisado por você.
3. Permissões básicas no `settings.json`.
4. Dois ou três agentes (comece simples) e, se fizer sentido, uma skill.
5. O command `/feature` para o ciclo completo.
6. Trabalhe em **fatias verticais**: esqueleto e login primeiro, depois um módulo completo, depois os demais reaproveitando o padrão.
7. Só depois adicione hooks, execução paralela com git worktrees e modo headless.

## Conclusão

O ganho dos agentes não vem de "mais IA", e sim de **contexto bem organizado e responsabilidades claras**: um `CLAUDE.md` objetivo, uma especificação revisada, agentes com ferramentas limitadas e um command que repete o roteiro sem você ter que redigitar tudo. Comece pequeno, observe onde os agentes erram, ajuste as instruções e só então aumente a autonomia.
