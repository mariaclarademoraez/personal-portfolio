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

Conteúdo real preenchido em `index.html`, `about.html` e `writing.html`.
Continua pendente — procurar por `TROCAR:` nos comentários:

- **E-mail e LinkedIn**: todos os links de contato apontam para `#`. São os
  únicos dados que faltam para o site funcionar de verdade.
- **Imagens**: os projetos, a foto de perfil e os ícones do stack ainda usam
  o placeholder listrado.
- **Case studies**: `project-template.html` segue sendo um molde vazio; os
  4 cards do index apontam todos para ele.
- **Writing**: sem textos publicados, a lista virou um estado vazio. O markup
  da lista está comentado no arquivo, pronto para voltar.

Ainda não feito, por decisão: seção PLAY, accent color, animações.
