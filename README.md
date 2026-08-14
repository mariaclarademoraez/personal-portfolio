# personal-portfolio

Portfólio pessoal em HTML puro + Tailwind via CDN. Sem framework, sem build step.

## Rodar

Abrir `index.html` direto no navegador, ou servir a pasta:

```bash
python3 -m http.server 8000
```

## Estrutura

| Arquivo | O que é |
| --- | --- |
| `index.html` | Home / WORK — abertura + grid de projetos |
| `about.html` | Bio, stack de ferramentas e links |
| `writing.html` | Lista editorial de artigos |
| `project-template.html` | Template de case study (duplicar por projeto) |
| `assets/tailwind-config.js` | Paleta, fonte e escala — config compartilhada do Tailwind |
| `assets/styles.css` | Placeholders de imagem e helper `full-bleed` |

## Design

Paleta neutra, sem accent color — o contraste vem do jogo preto/branco.

| Token | Hex | Uso |
| --- | --- | --- |
| `paper` | `#F0F0EE` | fundo geral |
| `pill` | `#FCFCFA` | cápsulas da nav e cards |
| `ink` | `#141414` | texto principal |
| `void` | `#0A0A0A` | blocos de destaque (texto branco) |
| `line` | `#DEDEDA` | contorno fino |

Tipografia: Inter (Google Fonts). Bold + uppercase + `tracking-wide` para
nome, navegação e títulos; Regular em tamanho grande para bio e aberturas.

Navegação: 3 pills separadas — nome / menu / CTA. O CTA fica escondido
abaixo do breakpoint `sm` para as pills não apertarem em telas estreitas.

## Estado atual

Só o esqueleto: estrutura, cores e grid. Todo o conteúdo é placeholder —
procurar por `TROCAR:` nos comentários para achar onde entra o conteúdo real.

Ainda não feito, por decisão: seção PLAY, accent color, conteúdo dos case
studies, animações.
