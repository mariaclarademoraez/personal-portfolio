# Portfolio · Maria Clara Moraes

Site estático (HTML, CSS e JS puros, sem build). Publicado na Vercel a partir da branch `main`: cada push vai ao ar sozinho.

## Estrutura

| Caminho | O que é |
| --- | --- |
| `index.html` | Home: apresentação e lista de projetos |
| `gestora-de-avaliacoes/` | Case da Nova Gestora de Avaliações |
| `sabioteca/` | Case da sabioteca (em andamento) |
| `sobre/` | Página Sobre |
| `assets/site.css` | Todo o visual: cores, tipografia, layout |
| `assets/site.js` | Interações: antes/depois, ampliar imagem, demo do resumo, raio-x |
| `assets/media/` | Imagens (.webp) e vídeos (.mp4) dos cases |
| `partials/icons.svg` | Ícones usados em todas as páginas |
| `scripts/sync-icons.py` | Copia os ícones para dentro de cada página |
| `vercel.json` | URLs limpas e cache das mídias |

## Rodar localmente

```bash
python3 -m http.server 8000
```

Depois abra http://localhost:8000.

## Como adicionar um case novo

1. Copie a pasta `sabioteca/` com o nome do novo case.
2. Troque título, pergunta do topo, tags, seções e mídias.
3. Adicione um bloco `<article class="project">` em `index.html`.
4. Se usar um ícone novo, adicione em `partials/icons.svg` e rode `python3 scripts/sync-icons.py`.

## Mídias

- Imagens em `.webp`, com no máximo 2000 px de largura.
- Vídeos em `.mp4` H.264, 1920 px, sem áudio.
- Antes de publicar uma tela, confira nomes de pessoas, clientes e marcas. As telas antigas da Gestora já estão com nomes de cliente desfocados.

## Visual

Fundo cinza claro, texto em preto e cinzas, sem cor de destaque. Inter no texto e Pixelify Sans só em rótulos pequenos. Os blocos aparecem com animação suave ao rolar, e tudo respeita `prefers-reduced-motion`.
