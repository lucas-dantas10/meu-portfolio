---
title: Como estou estudando RAG do zero
date: 2026-10-01
updated: 2026-10-02
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

## Como fiz o chunking

Na hora de quebrar os documentos em trechos (*chunks*), usei a estratégia de dividir pelo **header do Markdown** (`#`): cada seção do documento vira um chunk. Essa estratégia se chama **Header-Based Chunking**.

A ideia é aproveitar a estrutura que o próprio documento já tem, em vez de cortar o texto em pedaços de tamanho fixo, que podem partir uma explicação no meio.

## O que aprendi até agora

- O tamanho do trecho importa mais do que eu imaginava: trecho grande demais dilui a resposta.
- Mostrar de qual trecho veio cada resposta aumenta muito a confiança de quem usa.
- Medir a qualidade da busca *antes* de olhar o modelo economiza horas.

## Próximo passo: conectar com o Gemini

Com a busca funcionando, o passo seguinte era ligar tudo a um modelo de verdade. Conectei o **Gemini** e passei a inserir no prompt os contextos recuperados do meu banco vetorial, exatamente como no trecho de código acima.

O ponto mais importante foi a instrução dada à IA: se a pergunta não fizer sentido com os contextos fornecidos, ela deve **dizer claramente que não tem informação suficiente**, em vez de tentar adivinhar.

### O teste do "não sei"

Esse comportamento é conhecido como o teste do "não sei": ele verifica se o assistente admite o que não sabe quando a resposta não está nos documentos. É a principal defesa contra alucinação em um RAG, porque o objetivo é responder **só** com base no que foi recuperado.

**Resultado:** o teste normal (perguntas cujas respostas existem nos documentos) funcionou bem, e o assistente trouxe as respostas de maneira correta.

> Próximo passo: rodar o teste do "não sei" com perguntas fora do contexto e registrar os erros aqui.