---
title: Conectando o Claude Code às suas ferramentas com MCP
date: 2026-09-26
tags: MCP, Produtividade
---
**MCP** (*Model Context Protocol*) é um jeito padronizado de conectar um assistente de IA às suas ferramentas: bug tracker, documentação, banco de dados.

## Por que criei os meus

Eu perdia tempo alternando entre o terminal e o navegador só para consultar um chamado ou conferir uma documentação. Com um servidor MCP, o assistente consulta isso por mim, **sem eu sair do terminal**.

## Quando vale a pena

- A consulta é repetitiva e sempre segue o mesmo caminho.
- A ferramenta já tem uma API.
- Você quer que o assistente *leia* dados, mas decida você mesmo o que fazer com eles.

---

Em um próximo post, mostro como estruturei o código de um servidor simples.
