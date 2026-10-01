// Troca entre tema claro e escuro. O novo tema "abre" em círculo a partir do botão.
export function toggleTheme(origin) {
  const root = document.documentElement
  const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark'

  const apply = () => {
    root.setAttribute('data-theme', next)
    try {
      localStorage.setItem('theme', next)
    } catch {}
  }

  // Quem pediu menos movimento vê a troca instantânea.
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    apply()
    return
  }

  if (document.startViewTransition && origin) {
    const r = origin.getBoundingClientRect()
    const x = r.left + r.width / 2
    const y = r.top + r.height / 2
    const radius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y))

    const transition = document.startViewTransition(apply)
    transition.ready.then(
      () => {
        root.animate(
          { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
          {
            duration: 700,
            easing: 'cubic-bezier(.4, 0, .2, 1)',
            pseudoElement: '::view-transition-new(root)',
          },
        )
      },
      () => {},
    )
  } else {
    // Navegadores sem View Transitions: só suaviza as cores.
    root.classList.add('theme-fade')
    apply()
    setTimeout(() => root.classList.remove('theme-fade'), 450)
  }
}
