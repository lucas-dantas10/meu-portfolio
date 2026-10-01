---
title: How I am learning RAG from scratch
date: 2026-10-01
tags: AI, RAG
---
When a language model answers about something it has never seen, it makes things up. **RAG** (*Retrieval-Augmented Generation*) is the technique that fixes this: before asking the model, you **search** for the relevant passages in your own documents and hand them over together with the question.

## How it works

1. **Index:** split the documents into passages and turn each one into a vector (*embedding*).
2. **Search:** turn the question into a vector and find the closest passages.
3. **Generate:** build a prompt with the question and those passages, and ask the model for the answer.

```java
List<Chunk> chunks = index.search(question, 4);
String prompt = buildPrompt(question, chunks);
String answer = model.answer(prompt);
```

## What I have learned so far

- Passage size matters more than I expected: a passage that is too large dilutes the answer.
- Showing which passage each answer came from greatly increases the trust of whoever uses it.
- Measuring search quality *before* looking at the model saves hours.

> Next step: build an assistant on top of my own documentation and record the mistakes here.
