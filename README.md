# Portfólio — Pablo Henrique Araújo

Portfólio pessoal de página única de **Pablo Henrique Araújo** (`phpablo`), desenvolvedor Front-End e estudante de Análise e Desenvolvimento de Sistemas na **UFCA**. O site apresenta perfil, serviços, projetos, habilidades e um formulário de contato — tudo em uma única página, com layout de sidebar fixa, tema escuro e foco em código limpo, acessibilidade e performance.

Site ao vivo: **https://phpablo.github.io/meu-portfolio/**

## Tecnologias

- **HTML5** semântico, com landmarks e atributos ARIA.
- **CSS3 puro** — metodologia **BEM** e **CSS custom properties** (variáveis), sem framework de UI.
- **JavaScript vanilla** organizado em **ES Modules**, sem build step e sem bundler.
- **Tipografia:** fonte [Inter](https://fonts.google.com/specimen/Inter) via Google Fonts.
- **Ícones:** SVG inline.

## Estrutura de pastas

```text
meu-portfolio/
├── index.html              # Página principal com todas as seções
├── site.webmanifest        # Manifesto PWA
├── assets/
│   ├── css/
│   │   └── style.css       # Variáveis, layout sidebar, componentes, seções e responsivo
│   ├── js/
│   │   ├── app.js          # Entry point: importa e inicializa os módulos
│   │   └── modules/
│   │       ├── sidebar.js  # Menu lateral + hambúrguer mobile
│   │       ├── scroll.js   # Scroll reveal (IntersectionObserver) + scroll spy
│   │       ├── projects.js # Filtro de projetos por categoria
│   │       └── contact.js  # Formulário via Web3Forms com fallback mailto
│   └── img/                # Imagens (avatar, background do hero, favicon, og-image)
├── LICENSE
└── README.md
```

## Funcionalidades

O conteúdo é dividido nas seções: **Início** (hero), **Sobre mim**, **O que eu faço** (serviços), **Projetos**, **Habilidades** e **Contato**.

- **Layout com sidebar fixa** com avatar, navegação, CTA e links sociais.
- **Menu mobile** com botão hambúrguer e backdrop (overlay).
- **Scroll reveal** — elementos animam ao entrar na viewport (via `IntersectionObserver`).
- **Scroll spy** — o item do menu correspondente à seção visível é destacado automaticamente.
- **Filtro de projetos** por categoria: *Todos*, *Web* e *Data Viz*.
- **Habilidades** exibidas como badges de senioridade.
- **Formulário de contato** com validação, envio via Web3Forms e fallback para cliente de e-mail.
- **Tema escuro** com cor de acento vermelho-laranja (`#e63e21`).

## Acessibilidade & SEO

**Acessibilidade**

- HTML semântico com landmarks e `aria-label`s.
- `:focus-visible` para navegação por teclado.
- Respeito a `prefers-reduced-motion` para quem prefere menos animações.
- Fallback que exibe o conteúdo mesmo com JavaScript desativado.

**SEO**

- `meta description` e `meta keywords`.
- **Open Graph** e **Twitter Card** para compartilhamento em redes sociais.
- Dados estruturados **JSON-LD** (`schema.org/Person`).

## Como rodar localmente

O projeto é 100% estático, mas os **ES Modules exigem ser servidos via HTTP** (não funcionam abrindo o arquivo diretamente com `file://`). Use qualquer servidor estático:

**Opção 1 — XAMPP**

Coloque a pasta em `htdocs` e acesse:

```text
http://localhost/meu-portfolio/
```

**Opção 2 — Servidor estático via Python**

```bash
cd meu-portfolio
python -m http.server 8000
```

Depois acesse `http://localhost:8000/`.

> Abrir o `index.html` diretamente no navegador (`file://`) pode funcionar para o HTML/CSS, mas os módulos JavaScript não carregarão — prefira servir via HTTP.

## Deploy

O site é publicado via **GitHub Pages** a partir da branch `main`.

URL de produção: **https://phpablo.github.io/meu-portfolio/**

## Configurar o formulário (Web3Forms)

O formulário de contato usa o [Web3Forms](https://web3forms.com). Para ativar o envio real:

1. Crie uma **access key** gratuita em [web3forms.com](https://web3forms.com).
2. Abra `assets/js/modules/contact.js`.
3. Substitua o valor da constante `ACCESS_KEY` pela sua chave.

Enquanto a chave não estiver configurada, o formulário usa automaticamente o **fallback via `mailto`**, abrindo o cliente de e-mail do visitante com a mensagem pré-preenchida.

## Contato

- **GitHub:** [github.com/phpablo](https://github.com/phpablo)
- **LinkedIn:** [linkedin.com/in/pablohenriquearaujo](https://linkedin.com/in/pablohenriquearaujo)
- **Instagram:** [@pablohenrique.dev](https://instagram.com/pablohenrique.dev)
- **E-mail:** pablohlaraujo@gmail.com

## Licença

Distribuído sob a licença descrita no arquivo [LICENSE](LICENSE).
