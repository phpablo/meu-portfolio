# CLAUDE.md — Diretrizes do Projeto

## Sobre o projeto

Portfólio pessoal de Pablo Henrique Araújo (phpablo), desenvolvedor Front-End e estudante de ADS/UFCA. Stack: HTML5, CSS3, JavaScript vanilla, PHP, sem frameworks de UI.

## Padronização de commits

Formato obrigatório: `:<gitmoji>: <tipo>: <descrição em inglês>`

### Tipos (Conventional Commits)

| Tipo       | Uso                                              |
|------------|--------------------------------------------------|
| `feat`     | Nova funcionalidade                              |
| `fix`      | Correção de bug                                  |
| `refactor` | Refatoração sem mudança de comportamento         |
| `style`    | Ajustes visuais/CSS sem impacto em lógica        |
| `docs`     | Documentação                                     |
| `chore`    | Tarefas de manutenção (configs, deps, .gitignore)|
| `perf`     | Melhoria de performance                          |
| `test`     | Testes                                           |

### Gitmojis mais usados neste projeto

| Gitmoji              | Quando usar                                  |
|----------------------|----------------------------------------------|
| `:art:`              | Melhorar estrutura/formatação de código      |
| `:sparkles:`         | Nova feature / componente                    |
| `:bug:`              | Correção de bug                              |
| `:lipstick:`         | Mudanças de UI/estilo visual                 |
| `:zap:`              | Melhoria de performance                      |
| `:fire:`             | Remover código ou arquivos                   |
| `:memo:`             | Documentação                                 |
| `:wrench:`           | Arquivos de configuração                     |
| `:bento:`            | Assets (imagens, fontes, ícones)             |
| `:wheelchair:`       | Acessibilidade                               |
| `:globe_with_meridians:` | SEO / meta tags / i18n                  |
| `:rewind:`           | Reverter mudança                             |

### Exemplos

```
:sparkles: feat: add projects section with filter by category
:art: refactor: replace skill progress bars with seniority badges
:lipstick: style: update accent color and button hover states
:bug: fix: sidebar scroll not resetting on mobile navigation
:globe_with_meridians: feat: add Open Graph and JSON-LD structured data
:wrench: chore: add .gitignore for XAMPP environment
```

### Regras

- Descrição sempre em **inglês**
- Sem ponto final
- Imperativo: "add", "fix", "update" — não "added", "fixed"
- Corpo do commit em português é permitido quando necessário
- Sempre incluir `Co-Authored-By` quando gerado por Claude
