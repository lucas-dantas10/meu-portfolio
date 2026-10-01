// Busca seus repositórios públicos e usa os "tópicos" do GitHub para saber o status:
//   em-andamento  ->  Em andamento
//   concluido     ->  Concluídos
//   planejado     ->  Planejados
// Repositórios sem um desses tópicos não aparecem no site.
const STATUS_BY_TOPIC = {
  'em-andamento': 'doing',
  concluido: 'done',
  planejado: 'planned',
}

export async function fetchGithubProjects(user) {
  try {
    const res = await fetch(
      `https://api.github.com/users/${encodeURIComponent(user)}/repos?per_page=100&sort=updated`,
      { headers: { Accept: 'application/vnd.github+json' } },
    )
    if (!res.ok) return []
    const repos = await res.json()
    return repos
      .filter((r) => !r.fork)
      .map((r) => {
        const topics = r.topics || []
        const statusTopic = topics.find((t) => t in STATUS_BY_TOPIC)
        if (!statusTopic) return null
        return {
          id: r.name.toLowerCase().replace(/[^a-z0-9-]+/g, '-'),
          status: STATUS_BY_TOPIC[statusTopic],
          title: r.name,
          text: r.description || { pt: 'Sem descrição ainda.', en: 'No description yet.' },
          tags: topics.filter((t) => !(t in STATUS_BY_TOPIC)),
          link: r.homepage || r.html_url,
        }
      })
      .filter(Boolean)
  } catch {
    return []
  }
}
