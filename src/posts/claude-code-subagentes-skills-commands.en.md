---
title: Claude Code in practice: subagents, skills and custom commands
date: 2026-10-08
tags: Claude Code, AI, Agents, Productivity, Spring Boot
---
When I started using Claude Code to build a personal project, I realized that asking "build the app" in a single prompt doesn't work well. Results improve a lot when you split the work into **roles** (subagents), give each role the **right knowledge** (skills) and automate the repetitive routine with **custom commands**.

In this post I walk through the process step by step, with the files I used. The examples use a Spring Boot app with Thymeleaf, HTMX and Tailwind, but the structure works for any stack.

## Structure overview

Everything lives inside the repository, in the `.claude/` folder, and can be versioned in git:

```
my-project/
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
    │   └── my-skill/
    │       └── SKILL.md
    └── commands/
        └── feature.md
```

## Step 1: create `CLAUDE.md`

`CLAUDE.md` at the root is the project's memory. Claude Code reads it every session, and so do subagents. Put in it:

- project goal and MVP scope;
- stack and architecture decisions;
- package structure;
- commands to run, test and build;
- code conventions.

A lean example:

```markdown
# My Project

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

Tip: keep it short. This file is loaded on every run, so each line costs tokens.

## Step 2: write the spec before the code

Before creating agents, ask Claude (in plan mode, with `Shift+Tab`) to generate a `docs/mvp.md` with the entities, screens and flows of each module. Review it yourself. A good spec pays off more than an extra agent.

The name `docs/mvp.md` is just an example: it can be anything else, like `spec.md` or `docs/requirements.md`. What matters is that `CLAUDE.md` and the agents point to the name you chose.

## Step 3: create the subagents

Subagents are Markdown files in `.claude/agents/`. You can create them interactively with the `/agents` command (choose *Create new agent* and then *Project*) or write the file by hand.

Each file has a frontmatter with:

| Field | What it's for |
|---|---|
| `name` | Agent identifier |
| `description` | When Claude should delegate to it. The most important field |
| `tools` | Allowed tools (limit them per role) |
| `model` | Model used (`haiku`, `sonnet`, `opus`) |
| `skills` | Skills injected into the agent's context (see Step 4) |
| `permissionMode` | Permission mode for this agent only |

The text below the frontmatter is the agent's system prompt.

### The `backend` agent

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

### The `frontend` agent

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

### The `tester` agent

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

### The `reviewer` agent (read-only)

Notice it has neither `Edit` nor `Write` in `tools`. That guarantees the reviewer only reviews and doesn't quietly "fix" things.

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

### Best practices for agents

- The `description` decides when Claude delegates on its own. Phrases like "Use proactively" help.
- Limit `tools` per role. Less power means fewer mistakes.
- Subagents don't call other subagents. The main session orchestrates (hence the command in Step 5).
- Run `/agents` to check that all of them loaded without frontmatter errors.

## Step 4: add skills to subagents

Two important things:

1. Subagents **don't inherit** the main conversation's skills. You have to list each one explicitly.
2. The `skills` field **injects the full content** of the skill into the agent's context when it starts.

### 4.1 Create the skill

A skill is a folder at `.claude/skills/<name>/` with a `SKILL.md`:

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

### 4.2 Reference the skill in the agent

In the agent's frontmatter, list the skill's name (same as its `name`):

```markdown
---
name: frontend
description: ...
tools: Read, Edit, Write, Bash, Grep, Glob
skills:
  - ui-guide
---
```

You can list several. For example, the `tester` can get a `spring-test-patterns` skill.

### Skill tips

- Keep each skill short and specific: all of its text enters the agent's context on every run.
- Skills that only make sense in the main session stay out of the agents' `skills` field.

## Step 5: create custom commands

Commands are shortcuts for prompts you repeat. Each file in `.claude/commands/` becomes a `/name` command. The command below orchestrates the whole cycle of a feature slice, calling the agents in the right order.

File `.claude/commands/feature.md`:

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

Usage:

```
/feature dates: ideas with voting
```

The text typed after the command name replaces `$ARGUMENTS`. The `argument-hint` field shows up as a hint in autocomplete.

## Step 6: configure permissions to work autonomously

By default Claude Code asks for approval on every edit and every command. For agents to work without interruption, configure `.claude/settings.json`:

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

Alternatives:

- `Shift+Tab` switches to *accept edits* mode for the current session only.
- `permissionMode: acceptEdits` in an agent's frontmatter applies only to that agent.
- `/permissions` shows the active rules and lets you edit them interactively.

### If it still asks permission for `cd` and file reads

- Always open Claude at the **repository root**. Outside the project directory, reads and edits require approval.
- Avoid commands like `cd folder && command`: they fall under stricter rules. That's why the `CLAUDE.md` from Step 1 says to use relative paths.
- Folders outside the root can be allowed via `additionalDirectories`.
- A more specific `ask` or `deny` rule takes priority over a general `allow`. Check it in `/permissions`.

### Autonomy with safety

Autonomy without tests only produces bugs faster. A hook that runs the suite before the agent finishes (for example, `./mvnw test` in a `Stop` hook) forces the work to end with everything green. For unattended runs, there's headless mode (`claude -p "/feature ..."`) and the `--dangerously-skip-permissions` flag, which skips all confirmations. Use that flag **only in an isolated container or VM**.

## Mind your token usage

Using agents spends more tokens than a single conversation, and that's expected:

- each subagent starts with its own context and re-reads `CLAUDE.md`, the spec and the relevant files;
- the listed skills enter each agent's context in full;
- the full cycle (plan, backend, frontend, tests, review, fixes) multiplies the calls.

To measure it, use `/cost` in the session or the `ccusage` tool, which reads local logs.

How to reduce it without giving up agents:

1. Pick the model per role: `haiku` or `sonnet` for tests and frontend, `opus` only where heavier reasoning pays off.
2. Use agents only for large tasks; do small tweaks in the main session.
3. Keep `CLAUDE.md` and skills short, and split the spec by module.
4. Start with fewer agents (for example, backend and frontend together) and run the `reviewer` only at the end of each slice.
5. Ask for lean test output (`./mvnw -q test`).
6. Use `/clear` between slices and `/compact` in long sessions.

## Suggested order to get started

1. Clean repository with git and a minimal project skeleton.
2. A short `CLAUDE.md` and a `docs/mvp.md` reviewed by you.
3. Basic permissions in `settings.json`.
4. Two or three agents (start simple) and, if it makes sense, one skill.
5. The `/feature` command for the full cycle.
6. Work in **vertical slices**: skeleton and login first, then one complete module, then the others reusing the pattern.
7. Only then add hooks, parallel execution with git worktrees and headless mode.

## Conclusion

The gain from agents doesn't come from "more AI", but from **well-organized context and clear responsibilities**: a focused `CLAUDE.md`, a reviewed spec, agents with limited tools and a command that repeats the routine without you retyping everything. Start small, watch where the agents go wrong, tune the instructions and only then increase autonomy.
