// Protege os cases em construção com senha.
// A senha fica na variável de ambiente CASE_PASSWORD (painel da Vercel), nunca no código.

export const config = {
  matcher: ['/sabioteca', '/sabioteca/:path*'],
};

const COOKIE = 'cm_acesso';
const MAX_AGE = 60 * 60 * 24 * 30; // 30 dias

async function token(secret) {
  const data = new TextEncoder().encode('clara-moraes-portfolio:' + secret);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return [...new Uint8Array(hash)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

function readCookie(request, name) {
  const raw = request.headers.get('cookie') || '';
  for (const part of raw.split(';')) {
    const [k, ...v] = part.trim().split('=');
    if (k === name) return v.join('=');
  }
  return null;
}

function safeEqual(a, b) {
  if (!a || !b || a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

function gatePage(error) {
  return `<!doctype html>
<html lang="pt-BR"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex">
<title>Case protegido · Maria Clara Moraes</title>
<link rel="icon" href="/assets/favicon.svg" type="image/svg+xml">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap">
<link rel="stylesheet" href="/assets/site.css">
<style>
.gate{min-height:100svh;display:grid;place-items:center;padding:24px 16px}
.gate-box{width:100%;max-width:400px;display:grid;gap:14px}
.gate-box h1{font-size:28px;line-height:1.15;letter-spacing:-.02em;margin:0}
.gate-box p{margin:0;color:var(--muted)}
.gate-box form{display:flex;gap:8px;margin-top:6px}
.gate-box input{flex:1;min-width:0;font:inherit;padding:11px 14px;border-radius:999px;border:1px solid var(--line);background:#fff;color:var(--ink)}
.gate-box input:focus{outline:2px solid var(--ink);outline-offset:1px}
.gate-box button{cursor:pointer}
.gate-err{font-family:var(--f-pixel);font-size:13px;color:var(--ink)!important}
.gate-back{font-size:14px;color:var(--muted)}
</style></head>
<body><main class="gate"><div class="gate-box">
<span class="badge"><svg class="ico" viewBox="0 0 24 24" style="fill:none;stroke:currentColor;stroke-width:1.6"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 018 0v3"/></svg></span>
<h1>Case em construção</h1>
<p>Este case ainda está sendo revisado. Se você recebeu a senha, digite abaixo para ver o rascunho.</p>
<form method="post">
<label class="sr-only" for="senha">Senha</label>
<input id="senha" name="senha" type="password" autocomplete="current-password" placeholder="Senha" required autofocus>
<button class="pill-btn dark" type="submit">Entrar</button>
</form>
${error ? '<p class="gate-err" role="alert">Senha incorreta. Tente de novo.</p>' : ''}
<a class="gate-back" href="/">← Voltar para o início</a>
</div></main></body></html>`;
}

function html(body, status) {
  return new Response(body, {
    status,
    headers: { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'private, no-store', 'x-robots-tag': 'noindex' },
  });
}

export default async function middleware(request) {
  const secret = process.env.CASE_PASSWORD;
  if (!secret) return html(gatePage(false), 401); // sem senha configurada, tudo fica trancado

  const expected = await token(secret);
  if (safeEqual(readCookie(request, COOKIE), expected)) {
    return new Response(null, { headers: { 'x-middleware-next': '1' } }); // segue para a página
  }

  if (request.method === 'POST') {
    let given = '';
    try { given = String((await request.formData()).get('senha') || '').trim(); } catch (e) {}
    if (safeEqual(await token(given), expected)) {
      const url = new URL(request.url);
      return new Response(null, {
        status: 303,
        headers: {
          location: url.pathname,
          'set-cookie': `${COOKIE}=${expected}; Path=/; Max-Age=${MAX_AGE}; HttpOnly; Secure; SameSite=Lax`,
          'cache-control': 'no-store',
        },
      });
    }
    return html(gatePage(true), 401);
  }

  return html(gatePage(false), 401);
}
