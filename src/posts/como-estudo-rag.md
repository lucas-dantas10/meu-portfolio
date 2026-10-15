---
title: Como estou estudando RAG do zero
date: 2026-10-01
updated: 2026-10-14
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

## Atualização: medindo a recuperação (14/10)

Hoje montei a etapa de recuperação do RAG e aprendi a **medi-la**, em vez de avaliá-la só pela impressão das respostas.

### 1. Avaliar a recuperação separada da geração

Se a resposta do LLM sai errada, a causa pode ser o *retriever* ou o próprio modelo. Testar só a recuperação, sem chamar o Gemini, isola a primeira causa. Também é rápido, grátis e determinístico.

### 2. Métricas

- **hit@K** diz se o chunk certo está entre os K primeiros.
- **MRR@K** diz o quão no topo ele está.
- Os dois juntos mostram mais que cada um sozinho. Meu hit@3 de 100% escondia um MRR de 0,77, ou seja, nem tudo vinha em 1º lugar.

### 3. Como montar um caso de teste

- Cada caso tem uma pergunta, um tipo e um `kw` (abreviação de *keyword*, palavra-chave): um trecho que só existe no chunk correto.
- Os tipos (direta, parafraseada, termo exato, parcial, armadilha) testam comportamentos diferentes do retriever.
- Um caso só é válido se o `kw` realmente existe no corpus. Por isso conferi o meu no `VOICE_TRANSACTION_FLOW.md`.
- Casos "sem resposta" ficam de fora dessa métrica.

### 4. Uma falha real e o que ela ensina

O caso do arquivo do botão de microfone falhou. O chunk com a resposta era uma linha de tabela Markdown, curta e cheia de símbolos, com embedding fraco. Ela perdeu para chunks de prosa que falam de voz de forma mais ampla.

A lição é que a qualidade da busca depende muito de como você faz o chunking, e a similaridade semântica não é mágica para dados estruturados.

## Próximos passos

- Melhorar o chunking para tabelas, ou incluir o título da seção em cada chunk.
- Testar um reranker ou busca híbrida (vetorial mais palavra-chave).
- Alinhar o K da avaliação (3) com o `n_results` do `ask.py` (4).
- Adicionar casos de teste, inclusive perguntas sem resposta nos documentos.
- Rodar o teste do "não sei" com perguntas fora do contexto e registrar os erros aqui.