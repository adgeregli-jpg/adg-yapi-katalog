// adg.js: ADG — ADG Yapı'nın maskotu. Baretli, turuncu yelekli, kocaman gözlü küçük usta.
// adg(x, y, u, o): (x, y) = ayakların arasındaki zemin noktası, u = boy birimi (karakter ~9.6u boyunda, ~5u genişliğinde).
// o: dy (u; − = yukarı), sq (ezilme; − = uzama), rot, lookX/lookY (−1..1), eyes ('open','happy','wide','closed','determined'),
//    mouth ('smile','grin','o','open','sad','flat'), brow (−1 üzgün .. 0 .. 1 kararlı), blush 0..1,
//    aL/aR (kol açısı, radyan: 0 = aşağı sarkık, π/2 = yana yatay, π = tam yukarı), bendL/bendR (dirsek),
//    walk (bacak fazı), holdR/holdL(u, sw) (ele bağlı eşya; +x kol boyunca dışarı), hatTilt, hatLift (u), seed,
//    emote/emoteK/emoteAge, logoGlow 0..1, frontR (sağ kol kafanın önünde: bareti düzeltirken).
const ADG = {
  orange: '#ff6a13', orangeDk: '#d9540a', maroon: '#6b2200', cream: '#fdf3ec', skin: '#F8CCA4', skinDk: '#E9AE84',
  cheek: '#FF9478', boot: '#4a2a14', shirt: '#FFF7EE', strip: '#FFD34D'
};
// ADG logosu: ince çizgili, tabanı açık üçgen "A" + içinde kalın yatay çubuk. (cx, cy) = üçgenin ortası, s = yükseklik.
function adgLogoMark(cx, cy, s, col = ADG.cream, sw = 1) {
  const w = s * .62;
  const th = s * .13;
  paint(ribbon([[cx - w, cy + s / 2], [cx - w / 2, cy], [cx, cy - s / 2]], th, th), { wash: col, ink: null });
  paint(ribbon([[cx, cy - s / 2], [cx + w / 2, cy], [cx + w, cy + s / 2]], th, th), { wash: col, ink: null });
  paint(rectPts(cx - s * .17, cy + s * .3, s * .34, s * .17), { wash: col, ink: null });
}

function adg(x, y, u, o = {}) {
  const seed = o.seed ?? 0, t = T + seed;
  const sq = o.sq || 0, sx = 1 + sq * .6, sy = 1 - sq;
  const sw = clamp(u / 30, .45, 2.2);
  const look = [clamp(o.lookX || 0, -1, 1), clamp(o.lookY || 0, -1, 1)];
  push(); translate(x, y); rotate(o.rot || 0);
  boilSeed('adg-shadow' + seed);
  paint(ellPts(0, 0, 2.7 * u, .42 * u, 22), { wash: PAL.ink, washOp: 45, ink: null });
  translate(0, (o.dy || 0) * u); scale(sx, sy);

  // bacaklar + botlar
  boilSeed('adg-legs' + seed);
  const wk = o.walk || 0;
  for (const s of [-1, 1]) {
    const lift = Math.max(0, Math.sin(wk * Math.PI + (s > 0 ? Math.PI : 0))) * .45 * u;
    paint(rrPts(s * .65 * u - .45 * u, -1.9 * u - lift, .9 * u, 1.5 * u, .4 * u), { wash: ADG.maroon, ink: PAL.ink, sw });
    paint(rrPts(s * .7 * u - (s < 0 ? .85 : .5) * u, -.65 * u - lift, 1.35 * u, .65 * u, .3 * u), { wash: ADG.boot, ink: PAL.ink, sw });
  }

  // kollar (gövdenin arkasında başlar, el önde biter)
  const arm = (side) => {
    const a = side > 0 ? (o.aR ?? .25) : (o.aL ?? .25), bend = side > 0 ? (o.bendR ?? .25) : (o.bendL ?? .25);
    const sh = [side * 1.75 * u, -4.25 * u], L = 1.15 * u;
    const e = [sh[0] + side * Math.sin(a) * L, sh[1] + Math.cos(a) * L];
    const a2 = a + bend, h = [e[0] + side * Math.sin(a2) * L, e[1] + Math.cos(a2) * L];
    boilSeed('adg-arm' + side + seed);
    paint(ribbon([sh, e, h], .95 * u, .7 * u), { wash: ADG.shirt, ink: PAL.ink, sw });
    const hold = side > 0 ? o.holdR : o.holdL;
    if (hold) { push(); translate(h[0], h[1]); rotate(Math.atan2(h[1] - e[1], h[0] - e[0])); if (side < 0) scale(1, -1); hold(u, sw); pop(); }
    paint(ellPts(h[0], h[1], .5 * u, .5 * u, 16), { wash: ADG.skin, ink: PAL.ink, sw });
    return h;
  };

  // gövde: beyaz tişört + turuncu yelek
  boilSeed('adg-body' + seed);
  paint(rrPts(-2 * u, -4.85 * u, 4 * u, 3.25 * u, 1.15 * u), { wash: ADG.shirt, ink: PAL.ink, sw });
  for (const s of [-1, 1]) {
    const P = [[s * 1.95 * u, -4.2 * u], [s * .55 * u, -4.85 * u], [s * .3 * u, -1.62 * u], [s * 1.3 * u, -1.62 * u], [s * 1.98 * u, -2.3 * u]];
    paint(P, { wash: ADG.orange, ink: PAL.ink, sw, curv: .3 });
    inkLine([[s * 1.92 * u, -2.75 * u], [s * .42 * u, -2.75 * u]], sw * 1.6, ADG.strip, 'ink', 0);
  }
  adgLogoMark(1.15 * u, -3.75 * u, .62 * u, ADG.cream, sw * .55);

  let hR = o.frontR ? null : arm(1); const hL = arm(-1);

  // kafa
  const hy = -6.75 * u;
  boilSeed('adg-head' + seed);
  for (const s of [-1, 1]) paint(ellPts(s * 2.3 * u, hy + .25 * u, .48 * u, .55 * u, 14), { wash: ADG.skinDk, ink: PAL.ink, sw });
  paint(ellPts(0, hy, 2.4 * u, 2.25 * u, 30), { wash: ADG.skin, ink: PAL.ink, sw });
  const bl = o.blush ?? .5;
  if (bl > .02) for (const s of [-1, 1]) paint(ellPts(s * 1.45 * u, hy + .95 * u, .5 * u, .3 * u, 14), { wash: ADG.cheek, washOp: 150 * bl, ink: null });

  // gözler
  boilSeed('adg-eyes' + seed);
  let eyes = o.eyes || 'open';
  const blink = frac(t / 3.3 + .17 * seed) < .045;
  if (blink && eyes !== 'happy') eyes = 'closed';
  const ey = hy + .05 * u;
  for (const s of [-1, 1]) {
    const ex = s * .95 * u;
    if (eyes === 'closed') { inkLine([[ex - .5 * u, ey + .05 * u], [ex, ey + .3 * u], [ex + .5 * u, ey + .05 * u]], sw * 1.2); continue; }
    if (eyes === 'happy') { inkLine([[ex - .5 * u, ey + .25 * u], [ex, ey - .25 * u], [ex + .5 * u, ey + .25 * u]], sw * 1.3); continue; }
    const wide = eyes === 'wide' ? 1.15 : 1;
    paint(ellPts(ex, ey, .66 * u * wide, .82 * u * wide, 20), { wash: '#FFFDF8', ink: PAL.ink, sw: sw * .9 });
    const px = ex + look[0] * .2 * u + s * -.06 * u, py = ey + .12 * u + look[1] * .2 * u, pr = (eyes === 'wide' ? .36 : .46) * u;
    paint(ellPts(px, py, pr, pr * 1.05, 16), { wash: ADG.maroon, ink: null });
    paint(ellPts(px, py + .05 * u, pr * .5, pr * .5, 12), { wash: '#2a0f05', ink: null });
    paint(ellPts(px + .16 * u, py - .2 * u, pr * .36, pr * .36, 10), { wash: '#FFFDF8', ink: null });
    if (eyes === 'determined') paint([[ex - .75 * u, ey - .9 * u], [ex + .75 * u, ey - .9 * u], [ex + .75 * u, ey - (s > 0 ? .55 : .25) * u], [ex - .75 * u, ey - (s > 0 ? .25 : .55) * u]], { wash: ADG.skin, ink: null });
  }
  // kaşlar: −1 üzgün (iç uçlar yukarı), +1 kararlı (iç uçlar aşağı)
  const br = o.brow || 0;
  for (const s of [-1, 1]) {
    const inner = [s * .45 * u, ey - 1.15 * u + br * .25 * u], outer = [s * 1.45 * u, ey - 1.15 * u - br * .2 * u];
    inkLine([inner, [s * .95 * u, ey - 1.3 * u], outer], sw * 1.1);
  }

  // ağız
  boilSeed('adg-mouth' + seed);
  const my = hy + 1.25 * u, m = o.mouth || 'smile';
  if (m === 'smile') inkLine([[-.55 * u, my - .1 * u], [0, my + .25 * u], [.55 * u, my - .1 * u]], sw * 1.1);
  else if (m === 'flat') inkLine([[-.4 * u, my], [.4 * u, my + .03 * u]], sw);
  else if (m === 'sad') inkLine([[-.45 * u, my + .2 * u], [0, my - .08 * u], [.45 * u, my + .2 * u]], sw);
  else if (m === 'o') paint(ellPts(0, my + .1 * u, .26 * u, .32 * u, 12), { wash: '#B8321C', ink: PAL.ink, sw: sw * .8 });
  else { // grin / open: D biçimli ağız + dil
    const op = m === 'open' ? .7 : .45;
    paint([[-.7 * u, my - .15 * u], [.7 * u, my - .15 * u], [.45 * u, my + op * .6 * u], [0, my + op * u], [-.45 * u, my + op * .6 * u]], { wash: '#B8321C', ink: PAL.ink, sw: sw * .9, curv: .5 });
    paint(ellPts(0, my + op * .7 * u, .3 * u, .13 * u, 10), { wash: '#FF8C8C', ink: null });
  }

  // baret
  push(); translate(0, hy - 1.05 * u - (o.hatLift || 0) * u); rotate(o.hatTilt || 0);
  boilSeed('adg-hat' + seed);
  const dome = []; for (let i = 0; i <= 16; i++) { const a = Math.PI + i / 16 * Math.PI; dome.push([Math.cos(a) * 2.45 * u, Math.sin(a) * 2.05 * u]); }
  paint(dome, { wash: ADG.orange, ink: PAL.ink, sw });
  inkLine([[-1.2 * u, -.1 * u], [-1.05 * u, -1.6 * u]], sw * 1.2, ADG.orangeDk);
  inkLine([[1.2 * u, -.1 * u], [1.05 * u, -1.6 * u]], sw * 1.2, ADG.orangeDk);
  paint(rrPts(-3 * u, -.25 * u, 6 * u, .6 * u, .28 * u), { wash: ADG.orange, ink: PAL.ink, sw });
  if (o.logoGlow) glow(0, -.95 * u, 2.6 * u * (1 + .1 * Math.sin(T * 8)), '#FFD9A0', o.logoGlow);
  adgLogoMark(0, -.98 * u, 1.05 * u, ADG.cream, sw * .75);
  inkLine([[-1.9 * u, -1.15 * u], [-1.2 * u, -1.75 * u]], sw * 1.6, '#FFC59A');
  pop();

  if (o.frontR) hR = arm(1);
  if (o.emote) emote(o.emote, 2.9 * u, hy - 2.6 * u, u * .55, o.emoteK ?? 1, o.emoteAge ?? 1);
  pop();
  return { hR: toWorld(x, y, u, o, hR), hL: toWorld(x, y, u, o, hL) };
}
function toWorld(x, y, u, o, p) { const sq = o.sq || 0; return [x + p[0] * (1 + sq * .6), y + ((o.dy || 0) * u + p[1]) * (1 - sq)]; }
