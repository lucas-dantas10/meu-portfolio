---
title: Como estou estudando RAG do zero
date: 2026-10-01
tags: IA, RAG
---
Quando um modelo de linguagem responde sobre algo que ele nunca viu, ele inventa. **RAG** (*Retrieval-Augmented Generation*) é a técnica que resolve isso: antes de perguntar ao modelo, você **busca** os trechos relevantes dos seus próprios documentos e entrega junto com a pergunta.

## Como funciona

1. **Indexar:** quebrar os documentos em trechos e transformar cada um em um vetor (*embedding*).
2. **Buscar:** transformar a pergunta em vetor e achar os trechos mais próximos.
3. **Gerar:** montar um prompt com a pergunta e esses trechos, e pedir a resposta ao modelo.

```java
List<Trecho> trechos = indice.buscar(pergunta, 4);
String prompt = montarPrompt(pergunta, trechos);
String resposta = modelo.responder(prompt);
```

## O que aprendi até agora

- O tamanho do trecho importa mais do que eu imaginava: trecho grande demais dilui a resposta.
- Mostrar de qual trecho veio cada resposta aumenta muito a confiança de quem usa.
- Medir a qualidade da busca *antes* de olhar o modelo economiza horas.

> Próximo passo: construir um assistente sobre uma documentação própria e registrar os erros aqui.
