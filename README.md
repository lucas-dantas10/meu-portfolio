# Portfólio (Vue 3 + Vite)

Site de portfólio com projetos, blog em Markdown e currículo, sem banco de dados e sem servidor.

## Rodar no seu computador

Precisa do Node.js 18 ou mais novo.

```bash
npm install
npm run dev
```

Abra o endereço que aparecer no terminal (normalmente http://localhost:5173).

## O que editar

| O quê | Onde |
| --- | --- |
| Seu nome, links, resumo e currículo | `src/data/profile.js` |
| Projetos escritos à mão | `src/data/projects.js` |
| Posts do blog | arquivos `.md` em `src/posts/` |
| Cores e fontes | `src/styles/main.css` (variáveis no topo) |

## Escrever um post

Crie um arquivo em `src/posts/`, por exemplo `meu-primeiro-post.md`. O nome do arquivo vira o endereço (`#/blog/meu-primeiro-post`).

```markdown
---
title: Título do post
date: 2026-10-05
tags: IA, Estudos
---
Escreva aqui em Markdown: **negrito**, listas, links, código, tabelas e imagens.
```

Para esconder um rascunho sem apagar, acrescente a linha `draft: true` no cabeçalho.
Salvou o arquivo, o post aparece sozinho na lista.

## Projetos que se atualizam sozinhos (GitHub)

1. Em `src/data/profile.js`, preencha `githubUser` com o seu usuário.
2. No GitHub, abra cada repositório e adicione **um** destes tópicos (ícone de engrenagem ao lado de "About"):
   - `em-andamento`
   - `concluido`
   - `planejado`
3. O repositório aparece na aba certa, com a descrição e os demais tópicos como tags.

Repositórios sem um desses tópicos não aparecem. Projetos escritos em `projects.js` continuam valendo.
A API pública do GitHub tem limite de consultas por hora por visitante, o que é suficiente para um portfólio.

## Publicar

- **GitHub Pages:** já vem com o arquivo `.github/workflows/deploy.yml`. Suba o projeto para um repositório, vá em *Settings > Pages* e escolha *Source: GitHub Actions*.
- **Vercel ou Netlify:** importe o repositório. Comando de build: `npm run build`. Pasta de saída: `dist`.

Os endereços usam `#` (por exemplo `/#/blog`), o que funciona em qualquer hospedagem sem configuração extra.

## Estrutura

```
src/
  components/   cabeçalho e card de projeto
  composables/  troca de tema com animação
  data/         seus dados (profile.js, projects.js)
  lib/          leitura dos posts, Markdown, GitHub
  posts/        seus textos em .md
  styles/       main.css
  views/        as páginas: Início, Projetos, Blog, Post, Currículo
```
