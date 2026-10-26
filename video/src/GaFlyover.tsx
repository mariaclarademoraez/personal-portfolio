// Nova GA — tour com câmera e cursor (adaptado de cursor-flyover).
// Cada cena: visão geral com foco por blur → câmera voa até 3 pontos; cursor viaja junto
// (mesma tabela, mesma interpolação), clique com ondulação ao pousar. Algumas pousadas
// trocam o estado da tela (filtro, agrupar por blocos). Sem texto, sem som, sem pessoas.
import React from 'react';
import { AbsoluteFill, Easing, Img, Sequence, interpolate, staticFile, useCurrentFrame } from 'remotion';

const BG = '#F5F5F5';
const SCENE = 210;      // 7s @30fps
const OVERLAP = 14;     // crossfade entre cenas
export const TOTAL = SCENE * 3 - OVERLAP * 2;

type Cam = { tx: number; ty: number; s: number; cx: number; cy: number };
type Scene = {
  imgs: { src: string; h: number }[];   // estados da tela (largura css 1366)
  cam: Cam[];                            // [visão geral, passo1, passo2, passo3]
  swapAt?: number;                       // índice do passo cujo clique troca para imgs[1]
  outro?: boolean;                       // volta para a visão geral no fim
};

const inOut = Easing.bezier(0.65, 0, 0.35, 1);   // inOutCubic
const outC = Easing.bezier(0.33, 1, 0.68, 1);    // outCubic
const seg = (t: number, a: number, b: number, e = inOut) =>
  e(Math.min(1, Math.max(0, (t - a) / (b - a))));

// janelas iguais: 0.12 de viagem + pausa (passos como "visita guiada")
const WIN: [number, number][] = [[0.17, 0.29], [0.42, 0.54], [0.67, 0.79]];
const KEYS: (keyof Cam)[] = ['tx', 'ty', 's', 'cx', 'cy'];

const camAt = (t: number, cam: Cam[], outro: boolean): Cam => {
  const out = { ...cam[0] };
  let prev = cam[0];
  const wins = outro ? [...WIN, [0.88, 0.99] as [number, number]] : WIN;
  const tos = outro ? [...cam.slice(1), cam[0]] : cam.slice(1);
  wins.forEach((w, i) => {
    const u = seg(t, w[0], w[1]);
    for (const k of KEYS) out[k] += u * (tos[i][k] - prev[k]);
    prev = tos[i];
  });
  return out;
};

const CURSOR = 'M4 2 L4 19 L9 14.4 L12.2 21.5 L15.4 20 L12.2 13 L19 12.6 Z';

const Tour: React.FC<{ scene: Scene; fadeIn: boolean; fadeOut: boolean }> = ({ scene, fadeIn, fadeOut }) => {
  const f = useCurrentFrame();
  const t = f / SCENE;
  const v = camAt(t, scene.cam, !!scene.outro);
  // respiração mínima nas pausas (determinística, < 1px)
  const bx = Math.sin(f / 23) * 0.5, by = Math.cos(f / 29) * 0.5;

  const focus = seg(t, 0, 0.12, outC);
  const sceneOpacity = (fadeIn ? interpolate(f, [0, OVERLAP], [0, 1], { extrapolateRight: 'clamp' }) : 1)
    * (fadeOut ? interpolate(f, [SCENE - OVERLAP, SCENE], [1, 0], { extrapolateLeft: 'clamp' }) : 1);

  // cliques: começam no fim de cada janela
  let click = 0, showRipple = false, cursorFlash = false;
  WIN.forEach((w, i) => {
    const c = seg(t, w[1], w[1] + 0.055, outC);
    const next = WIN[i + 1] ? WIN[i + 1][0] : 2;
    if (t >= w[1] && t < next) { click = c; showRipple = c < 1; cursorFlash = c > 0 && c < 0.35; }
  });
  // troca de estado da tela no clique
  const swapT = scene.swapAt !== undefined ? WIN[scene.swapAt][1] + 0.01 : 9;
  const swap = seg(t, swapT, swapT + 0.03, outC);

  const tx = 960 - v.tx * v.s + bx, ty = 540 - v.ty * v.s + by;
  const sx = 960 + (v.cx - v.tx) * v.s + bx, sy = 540 + (v.cy - v.ty) * v.s + by;
  const cursorIn = seg(t, 0.08, 0.16, outC);
  const cursorOut = scene.outro ? 1 - seg(t, 0.86, 0.92, outC) : 1;

  return (
    <AbsoluteFill style={{ background: BG, opacity: sceneOpacity, overflow: 'hidden' }}>
      <div style={{ position: 'absolute', left: 0, top: 0, transformOrigin: '0 0', transform: `translate(${tx}px,${ty}px) scale(${v.s})` }}>
        <div style={{
          position: 'relative', width: 1366, height: scene.imgs.length > 1 ? scene.imgs[0].h + (scene.imgs[1].h - scene.imgs[0].h) * swap : scene.imgs[0].h, borderRadius: 14, overflow: 'hidden', background: '#fff',
          boxShadow: '0 40px 90px -30px rgba(0,0,0,.28), 0 0 0 1px rgba(0,0,0,.06)',
          filter: `blur(${(1 - focus) * 5}px)`, opacity: 0.2 + focus * 0.8,
        }}>
          {scene.imgs.map((im, i) => (
            <Img key={im.src} src={staticFile(im.src)} style={{
              position: 'absolute', left: 0, top: 0, width: 1366, height: im.h,
              opacity: i === 0 ? 1 - swap * (scene.imgs.length > 1 ? 1 : 0) : swap,
            }} />
          ))}
        </div>
      </div>
      {/* ondulação do clique (tela) */}
      <div style={{
        position: 'absolute', left: sx, top: sy, width: 30, height: 30, borderRadius: '50%',
        border: '2px solid rgba(22,22,22,.55)', transform: `translate(-50%,-50%) scale(${0.3 + click * 1.6})`,
        opacity: showRipple ? (1 - click) * 0.9 : 0,
      }} />
      {/* cursor */}
      <svg viewBox="0 0 24 24" style={{
        position: 'absolute', left: sx, top: sy, width: 30, height: 30, opacity: cursorIn * cursorOut,
        filter: 'drop-shadow(0 3px 6px rgba(0,0,0,.35))', transform: `scale(${cursorFlash ? 0.9 : 1})`, transformOrigin: '4px 2px',
      }}>
        <path d={CURSOR} fill={cursorFlash ? '#e6e6e6' : '#fff'} stroke="#161616" strokeWidth={1.2} strokeLinejoin="round" />
      </svg>
    </AbsoluteFill>
  );
};

const SCENES: Scene[] = [
  { // Listagem → filtro "Avaliações em atenção" → linha em risco → status por aba
    imgs: [{ src: 'lista.png', h: 1127 }, { src: 'lista-atencao.png', h: 880 }],
    cam: [
      { tx: 683, ty: 560, s: 0.9, cx: 760, cy: 640 },
      { tx: 1040, ty: 400, s: 2.0, cx: 1150, cy: 414 },
      { tx: 460, ty: 600, s: 1.85, cx: 470, cy: 650 },
      { tx: 1020, ty: 600, s: 2.0, cx: 1034, cy: 650 },
    ],
    swapAt: 0,
  },
  { // Composição → agrupar por blocos → pendências
    imgs: [{ src: 'comp-off.png', h: 1656 }, { src: 'comp-on.png', h: 1872 }],
    cam: [
      { tx: 683, ty: 560, s: 0.9, cx: 760, cy: 520 },
      { tx: 1050, ty: 200, s: 2.2, cx: 1156, cy: 184 },
      { tx: 1000, ty: 290, s: 1.9, cx: 1236, cy: 266 },
      { tx: 470, ty: 610, s: 1.9, cx: 410, cy: 598 },
    ],
    swapAt: 0,
  },
  { // Configuração com o resumo sempre visível
    imgs: [{ src: 'resumo.png', h: 1113 }],
    cam: [
      { tx: 683, ty: 556, s: 0.9, cx: 760, cy: 600 },
      { tx: 1150, ty: 360, s: 2.05, cx: 1300, cy: 383 },
      { tx: 1150, ty: 570, s: 2.1, cx: 1296, cy: 540 },
      { tx: 680, ty: 110, s: 1.75, cx: 678, cy: 86 },
    ],
    outro: true,
  },
];

export const GaFlyover: React.FC = () => (
  <AbsoluteFill style={{ background: BG }}>
    {SCENES.map((s, i) => (
      <Sequence key={i} from={i * (SCENE - OVERLAP)} durationInFrames={SCENE}>
        <Tour scene={s} fadeIn={i > 0} fadeOut={i < SCENES.length - 1} />
      </Sequence>
    ))}
  </AbsoluteFill>
);
