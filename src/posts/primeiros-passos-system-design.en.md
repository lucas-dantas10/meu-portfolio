---
title: Learning System Design
date: 2026-09-28
updated: 2026-10-21
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

### Sharding

Sharding means splitting a large database into smaller pieces, called **shards**, and spreading them across different servers. Each shard holds only a subset of the data and has the same schema. It is a form of **horizontal scaling**: instead of buying an ever-bigger server (vertical scaling), you add more servers. The central decision is the **shard key**, the field that determines which shard each record lands in.

| Strategy | How it works | Pros | Cons |
| --- | --- | --- | --- |
| Range-based | Splits by key ranges (e.g. IDs 1–1M on shard A, 1M–2M on shard B) | Easy to understand and great for range queries | Risk of hotspots (e.g. increasing keys concentrate writes on the last shard) |
| Hash-based | Hashes the key and uses the result to pick the shard | Even distribution, which avoids hotspots | Range queries have to hit every shard, and adding shards means moving data around (mitigated by consistent hashing) |
| Directory-based | A lookup table stores which shard holds each key | Maximum flexibility to move data and rebalance | The directory becomes a single point of failure and a bottleneck, plus one more piece to maintain |
| Geo-based | Splits by user region (e.g. Brazil, Europe) | Low latency and makes data-residency requirements easier | Uneven distribution across regions and complexity for users who travel or connect from elsewhere |

**When to use sharding:**

- The data volume or write load has outgrown what a single server can handle, even after scaling vertically.
- Read replicas and caching no longer help, because the bottleneck is writes or dataset size.
- Data needs to be isolated by region or by customer (tenant), for latency or regulatory reasons.

**When to avoid it:** sharding is expensive in complexity, so it is worth trying indexes, caching, read replicas, and partitioning inside a single database first.

**Trade-offs:**

- **Cross-shard joins and transactions** become expensive or impossible, and often call for eventual consistency or patterns like saga.
- **Resharding** (changing the number of shards or the key) is painful and risky in production.
- **Hotspots:** a bad shard key piles the load onto a few shards and cancels the benefit.
- **Operational complexity:** more servers to monitor, back up, and migrate, and the application (or a router) has to know where each piece of data lives.
- Choosing the shard key well is hard to undo: it should have high cardinality, spread the load evenly, and appear in the most common queries.

**Common problems and how to solve them:**

| Problem | What happens | How to solve it |
| --- | --- | --- |
| Celebrity problem (hot key) | A very popular key (e.g. a profile with millions of followers) concentrates reads and writes on a single shard, which gets overloaded while the others sit idle | Give hot keys dedicated shards, split the key into sub-keys (e.g. `celebrity_1`, `celebrity_2`) and aggregate on read, or put a cache in front of those keys |
| Hotspots from increasing keys | With sequential IDs or timestamps under range-based sharding, all new writes land on the last shard | Hash the key, or use a composite key that spreads writes (e.g. a hash prefix) |
| Resharding | Adding shards with plain hashing (`hash % N`) changes the destination of almost every key and forces a huge migration | Use consistent hashing (only a fraction of keys move) or create many logical shards upfront and map them to a few physical servers |
| Cross-shard joins | Queries that combine data from different shards get slow or impossible | Denormalize, pick a shard key that keeps related data together (e.g. everything for a user on the same shard), or replicate small reference tables to every shard |
| Queries without the shard key | Without the key, the router doesn't know where the data is and has to query every shard (scatter-gather) | Build global secondary indexes or lookup tables, and design the shard key around the most frequent queries |
| Distributed transactions | Updating data across more than one shard atomically is expensive and fragile | Avoid the scenario by keeping data on the same shard, or use saga with eventual consistency (instead of two-phase commit) |
| Unbalanced shards | Some shards grow faster than others over time (e.g. regions with more users) | Monitor each shard's size and load, split large shards, and rebalance periodically |

> I'm still at the beginning: so far I've covered load balancers, caching, and sharding, and I'll update this post as I study more.