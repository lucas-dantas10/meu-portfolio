---
title: Learning System Design
date: 2026-09-28
updated: 2026-10-03
tags: Architecture
---
System Design teaches you to think about **how a system behaves under load and when something fails** *before* writing the first line.

## Questions I started asking

- How many users and how many requests per second do I expect?
- What happens if this service goes down for 10 minutes?
- Which data must be consistent right now, and which can lag a little?

## What I've studied so far

### Load Balancer

A load balancer sits in front of a group of servers and distributes incoming traffic among them, so no single server gets overloaded and the system keeps working if one of them fails. Which server receives each request depends on the algorithm:

| Algorithm | What it does | Trade-off |
| --- | --- | --- |
| Round Robin | Sends requests to each server in turn | Simple, but ignores server capacity and current load |
| Weighted Round Robin | Same rotation, but stronger servers get more requests | Weights are static and have to be tuned by hand |
| Least Connections | Picks the server with the fewest active connections | Needs to track connection state; great when requests vary in duration |
| IP Hash | Hashes the client IP to choose the server, so a client always hits the same one | Uneven distribution (e.g. many users behind one NAT) and reshuffling when servers change |
| Least Response Time | Picks the server that is responding fastest | Needs constant measurement, so more overhead |

I also looked at the layer where the balancer works:

- **Layer 4 (transport):** decides using IP and port, without reading the content. It is faster and lighter, but less flexible.
- **Layer 7 (application):** understands HTTP, so it can route by path, headers, or cookies. It is more flexible, but costs more processing.

### Caching

A cache keeps frequently used data in a fast store, which reduces the load on the database and the response time. The strategies differ in who talks to the cache and when the data is written:

| Strategy | How it works | Trade-off |
| --- | --- | --- |
| Cache-aside | The app checks the cache; on a miss, it reads the database and fills the cache | Simple, but the first read is slow and data can go stale |
| Read-through | The cache itself loads from the database on a miss; the app only talks to the cache | Less logic in the app, but depends on the cache layer supporting it |
| Write-through | Writes go to the cache and the database at the same time | Consistent, but writes are slower |
| Write-back | Writes go to the cache and reach the database later | Very fast writes, but data can be lost if the cache fails before saving |
| Write-around | Writes go straight to the database, skipping the cache | Avoids filling the cache with data nobody reads, but the first read is a miss |

In distributed systems, the cache usually becomes a shared service (like Redis) instead of living inside each instance. That brings new concerns: how to invalidate data, how long it should live (TTL), and how to keep every node seeing consistent values.

> I'm still at the beginning: so far I've covered load balancers and caching, and I'll update this post as I study more.