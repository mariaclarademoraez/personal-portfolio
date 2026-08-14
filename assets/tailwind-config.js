/*
  Configuração compartilhada do Tailwind (via CDN).
  Carregar SEMPRE depois do script do CDN e antes do </head>.

  Paleta neutra — sem accent color por decisão de design.
  O contraste vem do jogo preto/branco, não de cor.
*/
tailwind.config = {
  theme: {
    extend: {
      colors: {
        paper: '#F0F0EE', // fundo geral — cinza muito claro
        pill: '#FCFCFA',  // off-white das cápsulas e cards
        ink: '#141414',   // texto principal — preto suave
        void: '#0A0A0A',  // blocos de destaque — preto puro
        line: '#DEDEDA',  // contorno fino (hairline)
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      maxWidth: {
        editorial: '78rem',
      },
    },
  },
};
