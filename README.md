# Portfólio — Pablo Henrique Araújo

Portfólio de página única de **Pablo Henrique Araújo** (`phpablo`), **Desenvolvedor Web Full Stack** em Itapipoca-CE. O site apresenta serviços, experiência, formação, o uso de IA no fluxo de trabalho, projetos com comparação antes/depois, depoimentos e canais de contato. Tudo feito com HTML, CSS e JavaScript puros, sem framework e sem etapa de build.

Site ao vivo: **https://phpablo.github.io/meu-portfolio/**

## Seções

| Âncora | Conteúdo |
|--------|----------|
| `#inicio` | Hero: apresentação, citação, "6+ Anos" e chamadas para projetos/contato |
| `#servicos` | Serviços em carrossel (Sistemas Web, Sites e Landing Pages, Redesign e UI/UX, Integrações e APIs) |
| `#experiencia` | Linha do tempo profissional com progresso ligado à rolagem + formação e idiomas |
| `#sobre` | "Por que me contratar?" com números animados |
| `#ia` | IA no fluxo de trabalho: benefícios e ferramentas usadas no dia a dia |
| `#projetos` | Carrossel de projetos com filtros por categoria, painel do projeto ativo e lightbox |
| `#antes-depois` | Comparador antes × depois com abas por projeto (mouse, toque e teclado) |
| `#depoimentos` | Depoimentos ilustrativos em carrossel centralizado com autoplay pausável |
| — | Faixa marquee com tecnologias e serviços |
| `#contato` | Chamada para WhatsApp e e-mail |
| rodapé | Marca, redes sociais, navegação e contato |

## Tecnologias

- **HTML5** semântico: landmarks, hierarquia de títulos com um único `h1`, ARIA onde necessário.
- **CSS3 puro**, organizado em tokens/base/componentes/layout/seções, com custom properties, `clamp()`, container queries, `scroll-snap` e `@media (prefers-reduced-motion)`.
- **JavaScript vanilla** em **ES Modules**, sem bundler.
- **Fonte:** [Urbanist](https://fonts.google.com/specimen/Urbanist), hospedada localmente em `assets/fonts/` (licença SIL OFL em `assets/fonts/OFL.txt`).
- **Imagens** em WebP com `srcset`/`sizes`, `loading="lazy"` e dimensões definidas (sem layout shift).
- **SEO:** metadados Open Graph/Twitter, JSON-LD (`Person` + `WebSite`), `robots.txt` e `sitemap.xml`.

## Estrutura de pastas

```text
meu-portfolio/
├── index.html
├── site.webmanifest          # PWA (ícones em assets/img/brand/)
├── robots.txt
├── sitemap.xml
└── assets/
    ├── css/
    │   ├── tokens.css        # cores, tipografia, espaçamentos, raios, sombras
    │   ├── base.css          # @font-face, reset, tipografia, utilitários, animações
    │   ├── components.css    # botões, tags, títulos, carrossel, textura escura
    │   ├── layout/           # nav.css, footer.css
    │   └── sections/         # hero, services, experience, about, ai, projects,
    │                         # beforeafter, testimonials, marquee, contact
    ├── fonts/                # Urbanist (woff2) + OFL.txt
    ├── img/
    │   ├── brand/            # logo {OO} em SVG, favicons e ícones do PWA
    │   ├── projects/         # derivados WebP dos projetos (antes/depois, cards)
    │   ├── services/         # prévias dos serviços
    │   └── ...               # fotos do hero/sobre, og-image.png e originais
    └── js/
        ├── app.js            # ponto de entrada
        └── modules/
            ├── nav.js        # menu mobile, sombra ao rolar, scroll-spy
            ├── reveal.js     # animação de entrada ao rolar
            ├── carousel.js   # carrossel genérico (data-carousel): pontos, arraste,
            │                 # teclado, modo centralizado e autoplay
            ├── timeline.js   # progresso da linha do tempo
            ├── counter.js    # números animados (data-count)
            ├── portfolio.js  # filtros, painel do projeto e lightbox
            ├── beforeafter.js# comparador antes × depois (data-ba)
            └── spotlight.js  # brilho que segue o mouse (data-spotlight)
```

## Como rodar localmente

Os scripts são **ES Modules**, então a página precisa ser servida por HTTP (abrir o arquivo direto com `file://` não funciona).

- **XAMPP:** coloque a pasta em `htdocs` e acesse **http://localhost/meu-portfolio/**.
- **Qualquer servidor estático**, por exemplo:

  ```bash
  npx --yes http-server -p 5500 -c-1
  # ou
  python -m http.server 5500
  ```

  e acesse http://localhost:5500/.

## Imagens derivadas

As imagens publicadas são derivados otimizados, gerados a partir dos originais (capturas de tela e fotos) sem sobrescrevê-los:

- Os recortes foram feitos no navegador (Chromium headless via Playwright): a imagem original é desenhada em um `<canvas>` com o recorte desejado e exportada com `toDataURL('image/webp', qualidade)`. Depois o arquivo é gravado com Node.
- Padrões usados: capturas em **16:10** (1400×875 e 800×500; prévias de serviços 800×500 e 480×300), qualidade **0,80–0,88**. Pares antes/depois têm exatamente o mesmo tamanho e enquadramento a partir do canto superior esquerdo.
- Ao trocar uma imagem, adicione um sufixo de cache nas URLs (ex.: `?v=3`) para que o navegador busque a nova versão.
- **Privacidade:** capturas completas de sites de clientes podem conter dados pessoais no rodapé (CPF, endereço) ou fotos de terceiros. Publique **somente recortes do topo** e não versione os originais sensíveis.

## Acessibilidade e performance

- Navegação completa por teclado, foco visível, link "Pular para o conteúdo", menu mobile com `aria-expanded`, Esc e foco preso no menu aberto.
- Carrosséis com rótulos, pontos com `aria-current` e autoplay pausável (WCAG 2.2.2). O comparador tem um `input range` acessível com `aria-valuetext`.
- Contraste AA verificado com axe-core: textos em laranja sobre fundo claro só em tamanho grande.
- `prefers-reduced-motion` desliga animações, autoplay e efeitos de rolagem.
- Fonte e imagem principal com `preload`, `fetchpriority="high"` no hero, imagens responsivas e *lazy*, sem CLS.
- Lighthouse (local, 24/09/2026): desktop 100/100/100/100, mobile 93/100/100/100 (Performance/Acessibilidade/Boas práticas/SEO).

## Deploy

É um site estático: basta publicar a raiz do repositório (GitHub Pages, Netlify, Vercel, Cloudflare Pages ou qualquer hospedagem de arquivos).

> Se o domínio final for diferente de `https://phpablo.github.io/meu-portfolio/`, atualize o `canonical`, as URLs de Open Graph/Twitter e do JSON-LD em `index.html`, além de `robots.txt`, `sitemap.xml` e o `start_url`/`scope` de `site.webmanifest`.

## Créditos

- Layout adaptado de um template de portfólio no Figma, redesenhado com a identidade própria (marca `{OO}`, tipografia Urbanist e paleta laranja).
- Fonte Urbanist © The Urbanist Project Authors, sob licença SIL Open Font License 1.1.
- Os depoimentos exibidos são ilustrativos e estão sinalizados como tal na página.

## Convenção de commits

Formato: `:<gitmoji>: <tipo>: <descrição em inglês, no imperativo, sem ponto final>`

- Tipos (Conventional Commits): `feat`, `fix`, `refactor`, `style`, `docs`, `chore`, `perf`, `test`.
- Gitmojis mais usados: `:sparkles:` nova feature, `:bug:` correção, `:lipstick:` estilo, `:art:` estrutura, `:zap:` performance, `:fire:` remoção, `:memo:` documentação, `:wrench:` configuração, `:bento:` assets, `:wheelchair:` acessibilidade, `:globe_with_meridians:` SEO.

Exemplos:

```text
:sparkles: feat: add AI workflow section with spotlight cards
:zap: perf: self-host Urbanist font and add responsive service previews
:wheelchair: fix: raise marquee and CTA text contrast to AA
:globe_with_meridians: feat: add robots.txt, sitemap and WebSite JSON-LD
```

## Licença

Consulte o arquivo [LICENSE](LICENSE).
