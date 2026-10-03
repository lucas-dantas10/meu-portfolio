---
title: Aprendendo System Design
date: 2026-09-28
updated: 2026-10-03
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

> Ainda estou no começo: até agora estudei load balancers e caching, e vou atualizar este post conforme avançar nos estudos.