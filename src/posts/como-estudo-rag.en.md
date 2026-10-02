---
title: How I'm Learning RAG from Scratch
date: 2026-10-01
tags: AI, RAG
---
When a language model answers a question about something it has never seen, it makes things up. **RAG** (*Retrieval-Augmented Generation*) is the technique that solves this: before asking the model, you **retrieve** the relevant passages from your own documents and hand them over together with the question.

## How it works

1. **Index:** split the documents into chunks and turn each one into a vector (*embedding*).
2. **Retrieve:** turn the question into a vector and find the closest chunks.
3. **Generate:** build a prompt with the question and those chunks, then ask the model for the answer.

```java
List<Trecho> trechos = indice.buscar(pergunta, 4);
String prompt = montarPrompt(pergunta, trechos);
String resposta = modelo.responder(prompt);
```

## How I did the chunking

To split the documents into chunks, I used a strategy that divides them by **Markdown headers** (`#`): each section of the document becomes a chunk. This strategy is called **Header-Based Chunking**.

The idea is to take advantage of the structure the document already has, instead of cutting the text into fixed-size pieces, which can split an explanation in the middle.

## What I've learned so far

- Chunk size matters more than I expected: a chunk that is too large dilutes the answer.
- Showing which chunk each answer came from greatly increases users' trust.
- Measuring retrieval quality *before* looking at the model saves hours.

## Next step: connecting to Gemini

With retrieval working, the next step was to connect everything to a real model. I hooked up **Gemini** and started inserting the contexts retrieved from my vector database into the prompt, exactly like in the code snippet above.

The most important part was the instruction given to the AI: if the question doesn't make sense given the provided contexts, it must **clearly say it doesn't have enough information** instead of trying to guess.

### The "I don't know" test

This behavior is known as the "I don't know" test: it checks whether the assistant admits what it doesn't know when the answer isn't in the documents. It's the main defense against hallucination in a RAG system, because the goal is to answer **only** based on what was retrieved.

**Result:** the normal test (questions whose answers exist in the documents) worked well, and the assistant returned the correct answers.

> Next step: run the "I don't know" test with out-of-context questions and record the errors here.