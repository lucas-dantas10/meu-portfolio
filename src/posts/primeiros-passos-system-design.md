---
title: Aprendendo System Design
date: 2026-09-28
updated: 2026-10-21
tags: Architecture
---
System Design ensina a pensar em **como um sistema se comporta sob carga e quando algo falha** *antes* de escrever a primeira linha.

## Perguntas que passei a me fazer

- Quantos usuários e quantas requisições por segundo eu espero?
- O que acontece se este serviço ficar fora do ar por 10 minutos?
- Quais dados precisam estar consistentes agora e quais podem atrasar um pouco?

## O que estudei até agora

### Load Balancer

Um load balancer fica na frente de um grupo de servidores e distribui o tráfego entre eles, para que nenhum fique sobrecarregado e o sistema continue funcionando se um deles cair. Qual servidor recebe cada requisição depende do algoritmo:

| Algoritmo | O que faz | Trade-off |
| --- | --- | --- |
| Round Robin | Envia as requisições para cada servidor em sequência | Simples, mas ignora a capacidade e a carga atual dos servidores |
| Weighted Round Robin | Mesma rotação, mas servidores mais fortes recebem mais requisições | Os pesos são estáticos e precisam ser ajustados manualmente |
| Least Connections | Escolhe o servidor com menos conexões ativas | Precisa acompanhar o estado das conexões; ótimo quando as requisições têm durações variadas |
| IP Hash | Faz o hash do IP do cliente para escolher o servidor, então o mesmo cliente sempre cai no mesmo | Distribuição desigual (ex.: muitos usuários atrás de um mesmo NAT) e redistribuição quando os servidores mudam |
| Least Response Time | Escolhe o servidor que está respondendo mais rápido | Exige medição constante, então tem mais overhead |

Também estudei em qual camada o balanceador atua:

- **Camada 4 (transporte):** decide com base em IP e porta, sem ler o conteúdo. É mais rápido e leve, mas menos flexível.
- **Camada 7 (aplicação):** entende HTTP, então consegue rotear por path, headers ou cookies. É mais flexível, mas custa mais processamento.

### Caching

Um cache guarda dados muito acessados em um armazenamento rápido, o que reduz a carga no banco de dados e o tempo de resposta. As estratégias diferem em quem conversa com o cache e em quando o dado é escrito:

| Estratégia | Como funciona | Trade-off |
| --- | --- | --- |
| Cache-aside | A aplicação consulta o cache; em caso de miss, lê o banco e preenche o cache | Simples, mas a primeira leitura é lenta e o dado pode ficar desatualizado |
| Read-through | O próprio cache carrega do banco em caso de miss; a aplicação só fala com o cache | Menos lógica na aplicação, mas depende de a camada de cache suportar isso |
| Write-through | As escritas vão para o cache e para o banco ao mesmo tempo | Consistente, mas as escritas ficam mais lentas |
| Write-back | As escritas vão para o cache e chegam ao banco depois | Escrita muito rápida, mas pode haver perda de dados se o cache falhar antes de salvar |
| Write-around | As escritas vão direto para o banco, ignorando o cache | Evita encher o cache com dados que ninguém lê, mas a primeira leitura é um miss |

Em sistemas distribuídos, o cache costuma virar um serviço compartilhado (como o Redis) em vez de viver dentro de cada instância. Isso traz novas preocupações: como invalidar os dados, por quanto tempo eles devem viver (TTL) e como manter todos os nós enxergando valores consistentes.

### Sharding

Sharding é dividir um banco de dados grande em partes menores, chamadas **shards**, e espalhá-las por servidores diferentes. Cada shard guarda apenas um subconjunto dos dados e tem o mesmo schema. É uma forma de **escalonamento horizontal**: em vez de colocar um servidor cada vez mais forte (escalonamento vertical), você adiciona mais servidores. A decisão central é a **shard key**, o campo que define em qual shard cada registro vai parar.

| Estratégia | Como funciona | Prós | Contras |
| --- | --- | --- | --- |
| Range-based | Divide por faixas da chave (ex.: IDs 1–1M no shard A, 1M–2M no shard B) | Simples de entender e ótima para consultas por intervalo | Risco de hotspots (ex.: chaves crescentes concentram as escritas no último shard) |
| Hash-based | Aplica um hash na chave e usa o resultado para escolher o shard | Distribuição uniforme, o que evita hotspots | Consultas por intervalo precisam passar por todos os shards, e adicionar shards exige redistribuir dados (mitigável com consistent hashing) |
| Directory-based | Uma tabela de lookup guarda em qual shard está cada chave | Máxima flexibilidade para mover dados e balancear | O diretório vira ponto único de falha e gargalo, além de uma peça extra para manter |
| Geo-based | Divide por região do usuário (ex.: Brasil, Europa) | Baixa latência e facilita requisitos legais de localização dos dados | Distribuição desigual entre regiões e complexidade com usuários que viajam ou acessam de outros lugares |

**Quando usar sharding:**

- O volume de dados ou de escritas passou do que um único servidor aguenta, mesmo depois de escalar verticalmente.
- Réplicas de leitura e cache já não resolvem, porque o gargalo está nas escritas ou no tamanho do dataset.
- É preciso isolar dados por região ou por cliente (tenant), por latência ou por regulação.

**Quando evitar:** sharding é caro em complexidade, então vale tentar antes índices, cache, réplicas de leitura e particionamento dentro de um único banco.

**Trade-offs:**

- **Joins e transações entre shards** ficam caros ou inviáveis, e muitas vezes exigem consistência eventual ou padrões como saga.
- **Resharding** (mudar o número de shards ou a chave) é doloroso e arriscado em produção.
- **Hotspots:** uma shard key ruim concentra a carga em poucos shards e anula o benefício.
- **Complexidade operacional:** mais servidores para monitorar, fazer backup e migrar, e a aplicação (ou um roteador) precisa saber onde cada dado está.
- Escolher bem a shard key é difícil de reverter: ela deve ter alta cardinalidade, distribuir bem a carga e aparecer nas consultas mais comuns.

**Problemas comuns e como resolver:**

| Problema | O que acontece | Como resolver |
| --- | --- | --- |
| Problema da celebridade (hot key) | Uma chave muito popular (ex.: um perfil com milhões de seguidores) concentra leituras e escritas em um único shard, que fica sobrecarregado enquanto os outros ficam ociosos | Dar shards dedicados às chaves quentes, dividir a chave em subchaves (ex.: `celebridade_1`, `celebridade_2`) e agregar na leitura, ou colocar cache na frente dessas chaves |
| Hotspots por chave crescente | Com IDs ou timestamps sequenciais em range-based, todas as escritas novas caem no último shard | Usar hash da chave, ou uma chave composta que espalhe as escritas (ex.: prefixo com hash) |
| Resharding | Adicionar shards com hash simples (`hash % N`) muda o destino de quase todas as chaves e força uma migração enorme | Usar consistent hashing (só uma fração das chaves se move) ou criar muitos shards lógicos desde o início e mapeá-los para poucos servidores físicos |
| Joins entre shards | Consultas que cruzam dados de shards diferentes ficam lentas ou impossíveis | Desnormalizar, escolher uma shard key que mantenha dados relacionados juntos (ex.: tudo de um usuário no mesmo shard) ou replicar para todos os shards as tabelas pequenas e de referência |
| Consultas sem a shard key | Sem a chave, o roteador não sabe onde está o dado e precisa consultar todos os shards (scatter-gather) | Criar índices secundários globais ou tabelas de lookup, e desenhar a shard key a partir das consultas mais frequentes |
| Transações distribuídas | Atualizar dados em mais de um shard de forma atômica é caro e frágil | Evitar o cenário agrupando os dados no mesmo shard, ou usar saga com consistência eventual (em vez de two-phase commit) |
| Shards desbalanceados | Alguns shards crescem mais que outros com o tempo (ex.: regiões com mais usuários) | Monitorar o tamanho e a carga de cada shard, dividir shards grandes (split) e rebalancear periodicamente |

> Ainda estou no começo: até agora estudei load balancers, caching e sharding, e vou atualizar este post conforme avançar nos estudos.