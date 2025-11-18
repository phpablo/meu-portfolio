const year = document.getElementById('year')
year.textContent = new Date().getFullYear()
const toggle = document.getElementById('theme-toggle')
const root = document.documentElement
const saved = localStorage.getItem('theme')
if (saved) root.setAttribute('data-theme', saved)
toggle.addEventListener('click', () => {
  const next = root.getAttribute('data-theme') === 'light' ? '' : 'light'
  if (next) root.setAttribute('data-theme', next)
  else root.removeAttribute('data-theme')
  localStorage.setItem('theme', next)
  toggle.setAttribute('aria-pressed', next === 'light')
})
const observer = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) e.target.classList.add('visible')
  })
}, { threshold: 0.1 })
document.querySelectorAll('.section, .project, .card, .item').forEach(el => {
  el.classList.add('reveal')
  observer.observe(el)
})
const menuToggle = document.getElementById('menu-toggle')
const nav = document.querySelector('.nav')
menuToggle.addEventListener('click', () => {
  const open = nav.classList.toggle('open')
  menuToggle.setAttribute('aria-expanded', open)
})
const chips = document.querySelectorAll('.chip')
const projects = Array.from(document.querySelectorAll('.project'))
const counts = {
  all: projects.length,
  web: projects.filter(p => p.dataset.category === 'web').length,
  dataviz: projects.filter(p => p.dataset.category === 'dataviz').length
}
chips.forEach(c => {
  const type = c.dataset.filter
  const countEl = c.querySelector('.count')
  if (countEl) countEl.textContent = type in counts ? counts[type] : ''
  c.addEventListener('click', () => {
    chips.forEach(x => x.classList.remove('active'))
    c.classList.add('active')
    const filter = c.dataset.filter
    projects.forEach(p => {
      const show = filter === 'all' || p.dataset.category === filter
      p.style.display = show ? '' : 'none'
    })
  })
})
const fxLayer = document.getElementById('fx-layer')
const symbols = ['⚡','<>','{}','//','✦','★']
function spawnSymbol(){
  const s = document.createElement('span')
  s.textContent = symbols[Math.floor(Math.random()*symbols.length)]
  s.style.position='absolute'
  s.style.left = Math.random()*100+'%'
  s.style.bottom = '-10vh'
  s.style.color = 'var(--accent)'
  s.style.fontWeight = '700'
  s.style.filter = 'drop-shadow(0 0 6px rgba(0,224,255,.6))'
  s.style.animation = 'floatSymbol '+(8+Math.random()*8)+'s linear forwards'
  fxLayer.appendChild(s)
  setTimeout(()=>s.remove(),16000)
}
let flyTimer = setInterval(spawnSymbol, 800)
const hero = document.querySelector('#hero')
hero.addEventListener('mousemove', e => {
  const dot = document.createElement('div')
  dot.className='spell'
  dot.style.left = e.clientX+'px'
  dot.style.top = e.clientY+'px'
  document.body.appendChild(dot)
  setTimeout(()=>dot.remove(), 600)
})
document.querySelectorAll('.tilt').forEach(card => {
  card.addEventListener('mousemove', e => {
    const r = card.getBoundingClientRect()
    const x = e.clientX - r.left
    const y = e.clientY - r.top
    const rx = ((y/r.height)-0.5)*8
    const ry = ((x/r.width)-0.5)*-8
    card.style.transform = `perspective(600px) rotateX(${rx}deg) rotateY(${ry}deg)`
  })
  card.addEventListener('mouseleave', () => {
    card.style.transform = ''
  })
})
const form = document.getElementById('contact-form')
const statusEl = document.querySelector('.form-status')
function validateEmail(v){return /.+@.+\..+/.test(v)}
form?.addEventListener('submit', e => {
  e.preventDefault()
  const nome = document.getElementById('nome').value.trim()
  const email = document.getElementById('email').value.trim()
  const mensagem = document.getElementById('mensagem').value.trim()
  if(!nome || !validateEmail(email) || !mensagem){
    statusEl.textContent = 'Preencha nome, email válido e mensagem.'
    return
  }
  const subject = encodeURIComponent('Contato Portfólio — '+nome)
  const body = encodeURIComponent(`Nome: ${nome}\nEmail: ${email}\n\n${mensagem}`)
  window.location.href = `mailto:pablohlaraujo@gmail.com?subject=${subject}&body=${body}`
  statusEl.textContent = 'Abrindo seu aplicativo de email...'
})