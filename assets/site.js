/* Portfolio Clara Moraes — interações compartilhadas por todas as páginas.
   Cada bloco só roda se o elemento existir na página. */
(function () {
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  /* ---- revelar blocos ao rolar ---- */
  if ('IntersectionObserver' in window && !reduce) {
    document.documentElement.classList.add('js');
    var ro = new IntersectionObserver(function (es) {
      es.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('in'); ro.unobserve(en.target); } });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    $$('.reveal').forEach(function (el) { ro.observe(el); });
  }

  /* ---- logo em pixel ---- */
  var svg = $('#logoMark');
  if (svg) {
    var logo = ['..####..', '.#....#.', '#.#..#.#', '#......#', '#.#..#.#', '#..##..#', '.#....#.', '..####..'], out = '';
    logo.forEach(function (r, y) { for (var x = 0; x < 8; x++) if (r[x] === '#') out += '<rect x="' + x + '" y="' + y + '" width="1" height="1" fill="currentColor"/>'; });
    svg.innerHTML = out;
  }

  /* ---- barra de leitura segmentada + sumário ativo ---- */
  var prog = $('#progress'), SEG = 24, segs = [];
  if (prog) { for (var s = 0; s < SEG; s++) segs.push(prog.appendChild(document.createElement('i'))); }
  var tocs = $$('.toc a');
  function update() {
    if (prog) {
      var max = document.documentElement.scrollHeight - innerHeight, p = max > 0 ? scrollY / max : 0, n = Math.round(p * SEG);
      segs.forEach(function (el, i) { el.classList.toggle('on', i < n); });
    }
    var active = null;
    tocs.forEach(function (a) { var el = document.getElementById(a.getAttribute('href').slice(1)); if (el && el.getBoundingClientRect().top < 140) active = a; });
    tocs.forEach(function (a) { a.classList.toggle('on', a === active); });
  }
  addEventListener('scroll', update, { passive: true }); update();

  /* ---- copiar e-mail ---- */
  function toast(msg) { var t = document.createElement('div'); t.className = 'toast'; t.setAttribute('role', 'status'); t.textContent = msg; document.body.appendChild(t); setTimeout(function () { t.remove(); }, 1800); }
  var copy = $('#copyEmail');
  if (copy) copy.addEventListener('click', function () {
    var el = $('#email');
    function fallback() { var r = document.createRange(); r.selectNodeContents(el); var sel = getSelection(); sel.removeAllRanges(); sel.addRange(r); toast('Selecionado. Use Ctrl+C'); }
    try { navigator.clipboard.writeText(el.textContent).then(function () { toast('E-mail copiado'); }, fallback); } catch (e) { fallback(); }
  });

  /* ---- comparação antes/depois ---- */
  $$('[data-cmp]').forEach(function (fig) {
    $$('.cmp-tabs button', fig).forEach(function (btn) {
      btn.addEventListener('click', function () {
        var side = btn.dataset.side;
        $$('.cmp-tabs button', fig).forEach(function (b) { b.setAttribute('aria-pressed', String(b === btn)); });
        $$('.cmp-stack [data-side], .cmp-cap [data-side]', fig).forEach(function (el) {
          if (el.dataset.side === side) el.removeAttribute('data-off'); else el.setAttribute('data-off', '');
        });
      });
    });
  });

  /* ---- ampliar imagem ---- */
  var lastFocus = null;
  function closeBox() { var b = $('.lightbox'); if (b) b.remove(); document.body.style.overflow = ''; if (lastFocus) lastFocus.focus(); }
  document.addEventListener('click', function (e) {
    var f = e.target.closest('[data-zoom]'); if (!f) return;
    var img = $('img', f); if (!img) return;
    lastFocus = f;
    var box = document.createElement('div');
    box.className = 'lightbox'; box.setAttribute('role', 'dialog'); box.setAttribute('aria-modal', 'true'); box.setAttribute('aria-label', img.alt);
    box.innerHTML = '<button class="close" type="button">Fechar</button>';
    var big = document.createElement('img'); big.src = img.currentSrc || img.src; big.alt = img.alt;
    box.appendChild(big); document.body.appendChild(box); document.body.style.overflow = 'hidden';
    $('.close', box).focus();
    box.addEventListener('click', closeBox);
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeBox(); });

  /* ---- vídeos: tocam só quando visíveis ---- */
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (en) { var v = en.target; if (!v.hasAttribute('autoplay')) return; if (en.isIntersecting && !reduce) v.play().catch(function () {}); else v.pause(); });
    }, { threshold: 0.25 });
    $$('video').forEach(function (v) { if (reduce) { v.removeAttribute('autoplay'); v.pause(); v.setAttribute('controls', ''); } io.observe(v); });
  }

  /* ---- demo: resumo verde (case GA) ---- */
  var sw = $('#modeSwitch');
  if (sw) {
    var rows = [
      { d: 'Língua Portuguesa', t: 'C/E', g: 'C', f: 'Média', exp: 'C/E' },
      { d: 'Língua Portuguesa', t: 'C/E', g: 'E', f: 'Fácil', exp: 'C/E' },
      { d: 'Língua Portuguesa', t: 'Discursiva', g: '—', f: 'Difícil', exp: 'C/E' },
      { d: 'Inglês', t: 'ME', g: 'B', f: 'Média', exp: 'ME' },
      { d: 'Inglês', t: 'ME', g: 'D', f: 'Média', exp: 'ME' }
    ];
    var locked = false, ready = false;
    var bar = function (have, need, kind) { var n = Math.max(need, have, 1), h = ''; for (var i = 0; i < n; i++) h += '<i class="' + (i < have ? 'on' : '') + '"></i>'; return '<div class="pbar ' + kind + '">' + h + '</div>'; };
    var rrow = function (label, have, need) {
      var kind = have === need ? 'ok' : (have > need ? 'bad' : 'warn');
      var chip = have === need ? '<span class="chip ok">OK</span>' : (have > need ? '<span class="chip bad">Excedido</span>' : '<span class="chip warn">Faltam ' + (need - have) + '</span>');
      return '<div class="r-row"><div class="lbl"><span>' + label + '</span><b>' + have + ' de ' + need + ' ' + chip + '</b></div>' + bar(have, need, kind) + '</div>';
    };
    var render = function () {
      var html = '';
      rows.forEach(function (r, i) {
        var bad = r.t !== r.exp;
        var val = locked ? (bad ? '<span class="chip bad">Fora da estrutura</span>' : '<span class="chip ok">Na estrutura</span>') : (bad ? '<span class="chip bad">Tipo esperado: ' + r.exp + '</span>' : '<span class="chip ok">OK</span>');
        html += '<tr class="' + (bad ? 'flag' : '') + '"><td class="num">' + (i + 1) + '</td><td>' + r.d + '</td><td>' + r.t + '</td><td class="num">' + r.g + '</td><td>' + r.f + '</td><td>' + val + '</td></tr>';
      });
      $('#demoRows').innerHTML = html;
      var res = $('#resumo');
      if (!locked) {
        res.innerHTML = '<span class="px">Resumo · por disciplina</span>' + rrow('Língua Portuguesa', 3, 3) + rrow('Inglês', 2, 2);
        $('#demoNote').innerHTML = '<b>Blocos desligado:</b> o resumo fica inteiro verde, mas a linha 3 é uma discursiva no lugar de uma C/E. O erro aparece apenas na própria linha.';
      } else {
        res.innerHTML = '<span class="px">Resumo · disciplina e tipo</span>' + rrow('Língua Portuguesa (C/E)', 2, 3) + rrow('Língua Portuguesa (Discursiva)', 1, 0) + rrow('Inglês (ME)', 2, 2);
        $('#demoNote').innerHTML = '<b>Blocos ligado:</b> o resumo conta por disciplina e tipo, e o mesmo erro aparece também aqui. Por isso as duas validações precisam existir separadamente.';
      }
      sw.setAttribute('aria-checked', String(locked));
      $('#modeLabel').textContent = 'Organizar por blocos: ' + (locked ? 'ligado' : 'desligado');
      if (ready && !reduce) { res.classList.remove('flash'); void res.offsetWidth; res.classList.add('flash'); }
    };
    sw.addEventListener('click', function () { locked = !locked; render(); });
    render(); ready = true;
  }

  /* ---- raio-x "Já sabemos isso?" (case sabioteca, dados fictícios) ---- */
  var raioOut = $('#raioOut');
  if (raioOut) {
    var raio = [
      ['O que já sabemos', 'Professores revisam no PDF final, não na ferramenta. Erros de gabarito são os mais citados.', 'Síntese · 2025'],
      ['O que os dados dizem', 'A maioria das revisões acontece nas 48 h antes da impressão.', 'Painel de uso'],
      ['Já foi discutido', 'Conferência dentro da ferramenta foi priorizada no trimestre passado.', 'Canal do time'],
      ['Em andamento', 'Discovery de conferência de provas, entrevistas em curso.', 'Iniciativa · Q4'],
      ['Lacunas', 'Ninguém ouviu coordenadores de escolas menores.', ''],
      ['Com quem falar', 'Designer e PM do squad de montagem.', '']
    ];
    var timer = null;
    var run = function () {
      raioOut.innerHTML = ''; clearTimeout(timer);
      var i = 0;
      (function step() {
        if (i >= raio.length) return;
        var r = raio[i++], d = document.createElement('div');
        d.className = 'line' + (reduce ? '' : ' rise');
        d.innerHTML = '<span class="px">' + r[0] + '</span><span>' + r[1] + (r[2] ? ' <span class="src">[' + r[2] + ']</span>' : '') + '</span>';
        raioOut.appendChild(d);
        timer = setTimeout(step, reduce ? 0 : 260);
      })();
    };
    $('#raioRun').addEventListener('click', run);
    run();
  }
})();

/* ---- v2: slider antes/depois e carrossel ---- */
(function () {
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  $$('.slider').forEach(function (sl) {
    var input = sl.querySelector('input[type=range]');
    var set = function (v) { sl.style.setProperty('--pos', v + '%'); };
    input.addEventListener('input', function () { set(input.value); });
    var drag = false;
    var move = function (e) {
      var r = sl.getBoundingClientRect();
      var x = ((e.touches ? e.touches[0].clientX : e.clientX) - r.left) / r.width * 100;
      x = Math.max(0, Math.min(100, x)); input.value = x; set(x);
    };
    sl.addEventListener('pointerdown', function (e) { drag = true; move(e); });
    addEventListener('pointermove', function (e) { if (drag) move(e); });
    addEventListener('pointerup', function () { drag = false; });
    set(input.value);
  });

  $$('.carousel').forEach(function (c) {
    var track = c.querySelector('.car-track'), slides = $$('.car-slide', c);
    var prev = c.querySelector('[data-prev]'), next = c.querySelector('[data-next]');
    var count = c.querySelector('.car-count'), dotsBox = c.querySelector('.car-dots');
    var dots = slides.map(function (s, i) {
      var b = document.createElement('button'); b.type = 'button'; b.setAttribute('aria-label', 'Ir para a tela ' + (i + 1));
      b.addEventListener('click', function () { go(i); }); dotsBox.appendChild(b); return b;
    });
    var current = 0;
    function go(i) { i = Math.max(0, Math.min(slides.length - 1, i)); track.scrollTo({ left: slides[i].offsetLeft - track.offsetLeft, behavior: 'smooth' }); }
    function sync() {
      var x = track.scrollLeft, best = 0, d = Infinity;
      slides.forEach(function (s, i) { var dd = Math.abs(s.offsetLeft - track.offsetLeft - x); if (dd < d) { d = dd; best = i; } });
      current = best;
      count.textContent = (best + 1) + ' / ' + slides.length;
      dots.forEach(function (b, i) { b.setAttribute('aria-current', String(i === best)); });
      prev.disabled = best === 0; next.disabled = best === slides.length - 1;
    }
    prev.addEventListener('click', function () { go(current - 1); });
    next.addEventListener('click', function () { go(current + 1); });
    track.addEventListener('scroll', function () { window.requestAnimationFrame(sync); }, { passive: true });
    track.addEventListener('keydown', function (e) { if (e.key === 'ArrowRight') { e.preventDefault(); go(current + 1); } if (e.key === 'ArrowLeft') { e.preventDefault(); go(current - 1); } });
    sync();
  });
})();

/* ---- voltar ao topo ---- */
document.addEventListener('click', function (e) {
  var a = e.target.closest('[data-top]'); if (!a) return;
  e.preventDefault();
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
});
