---
title: Connecting Claude Code to your tools with MCP
date: 2026-09-26
tags: MCP, Productivity
---
**MCP** (*Model Context Protocol*) is a standard way to connect an AI assistant to your tools: bug tracker, documentation, database.

## Why I built my own

I was losing time switching between the terminal and the browser just to look up a ticket or check some documentation. With an MCP server, the assistant looks it up for me, **without me leaving the terminal**.

## When it is worth it

- The lookup is repetitive and always follows the same path.
- The tool already has an API.
- You want the assistant to *read* data, but you decide what to do with it.

---

In a future post, I will show how I structured the code of a simple server.
