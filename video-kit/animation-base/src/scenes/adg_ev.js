// adg_ev.js — "Yorgun ev": ADG yorgun, eğri bir eve yeni bir hayat verir. 9:16, 1080×1920. Bkz. STORYBOARD.md.
(() => {
  const GY = 1560;                                   // zemin çizgisi
  const HX = 700;                                    // ev / bina ortası
  const C = { sky0: '#8C9AAE', sky1: '#FFD9B0', haze0: '#A7B1BF', haze1: '#FFEBD3', road0: '#6F7377', road1: '#CDB497',
              wall: '#C7AE8E', wallDk: '#A88E6E', roof: '#7A3B2E', win: '#46505E', grass: '#7DB35A' };

  // ---------- dünya ----------
  function sky(k) {
    boilSeed('sky');
    paint(rectPts(-400, -400, W + 800, GY + 400), { wash: mixCol(C.sky0, C.sky1, k), ink: null });
    paint(rectPts(-400, 1150, W + 800, GY - 1150 + 10), { wash: mixCol(C.haze0, C.haze1, k), washOp: 200, ink: null });
  }
  function sun(k, t) {
    if (k < .02) return;
    const y = lerp(760, 330, easeOut(k)), x = 210;
    glow(x, y, 260, '#FFC766', k);
    boilSeed('sun');
    paint(ellPts(x, y, 95, 95, 26), { wash: '#FFD45C', ink: PAL.ink, sw: 1.2 });
    for (let i = 0; i < 10; i++) { const a = i / 10 * TAU + t * .4; inkLine([[x + Math.cos(a) * 125, y + Math.sin(a) * 125], [x + Math.cos(a) * 165, y + Math.sin(a) * 165]], 1.3, '#E8AA38'); }
    inkLine([[x - 38, y + 18], [x, y + 42], [x + 38, y + 18]], 1.2);
    paint(ellPts(x - 32, y - 18, 9, 13, 10), { wash: PAL.ink, ink: null }); paint(ellPts(x + 32, y - 18, 9, 13, 10), { wash: PAL.ink, ink: null });
  }
  function clouds(k, t) {
    const a = 1 - k; if (a < .03) return;
    for (let i = 0; i < 4; i++) {
      boilSeed('cl' + i);
      const x = frac(hash(i) + t * .012) * 1500 - 200, y = 160 + i * 150;
      for (let j = 0; j < 3; j++) paint(ellPts(x + j * 90 - 90, y - (j === 1 ? 40 : 0), 120, 70, 18), { wash: '#6E7A8C', washOp: 210 * a, ink: null });
    }
  }
  function backdrop(k) {                               // uzaktaki soluk binalar
    boilSeed('backdrop');
    const col = mixCol('#9AA3AF', '#F2CDB0', k);
    [[-60, 1050, 260], [190, 1180, 170], [960, 1100, 200]].forEach(([x, y, w]) => paint(rectPts(x, y, w, GY - y), { wash: col, ink: null }));
  }
  function street(k) {
    boilSeed('street');
    paint(rectPts(-400, GY, W + 800, 800), { wash: mixCol(C.road0, C.road1, k), ink: null });
    inkLine([[-200, GY], [W + 200, GY]], 1.4);
    if (k < .6) for (let i = 0; i < 3; i++) paint(ellPts(150 + i * 340, GY + 140 + (i % 2) * 90, 110, 22, 18), { wash: '#9AAEC6', washOp: 200 * (1 - k), ink: null });
  }
  function grassAndFlowers(p, t) {
    if (p < .01) return;
    boilSeed('grass');
    paint(rectPts(-400, GY - 4, W + 800, 60 * p), { wash: C.grass, ink: PAL.ink, sw: .8 });
    for (let i = 0; i < 9; i++) {
      const x = 40 + i * 125, k = backOut(seg(p, i / 12, i / 12 + .35)), y = GY + 10;
      if (k < .05) continue;
      boilSeed('fl' + i);
      inkLine([[x, y], [x + 4 * Math.sin(t * 2 + i), y - 55 * k]], .8, '#4F7F3A');
      const col = ['#FF7FA0', '#FFD45C', '#FF8A3D', '#B98CFF'][i % 4];
      paint(starPts(x + 4 * Math.sin(t * 2 + i), y - 60 * k, 20 * k, .5, 5, t * .5), { wash: col, ink: PAL.ink, sw: .6 });
    }
  }
  function rain(amount, t) {
    if (amount <= 0) return;
    boilSeed('rain');
    const n = Math.round(46 * amount);
    for (let i = 0; i < n; i++) {
      const x = hash(i * 3.1) * 1300 - 120, y = frac(hash(i * 7.7) + t * 1.4) * 2100 - 120;
      inkLine([[x, y], [x - 14, y + 58]], .55, '#DCE6F2');
    }
  }

  // ---------- eski ev: 2 katlı, eğri ----------
  function oldHouse(t, o = {}) {
    const col = o.collapse || 0, creak = o.creak || 0;
    if (col > .98) return;
    push(); translate(HX, GY); rotate(-.045 - .02 * creak); scale(1 + col * .15, 1 - col);
    boilSeed('house');
    const w = 480, fh = 230;
    paint(rectPts(-w / 2, -2 * fh, w, 2 * fh), { wash: C.wall, ink: PAL.ink, sw: 1.2 });
    paint(rectPts(w / 2 - 70, -2 * fh, 70, 2 * fh), { wash: C.wallDk, ink: null });
    inkLine([[-w / 2, -fh], [w / 2, -fh + 10]], 1);
    paint([[-w / 2 - 50, -2 * fh + 5], [-10, -2 * fh - 210], [w / 2 + 40, -2 * fh + 25]], { wash: C.roof, ink: PAL.ink, sw: 1.2 });
    for (let i = 0; i < 4; i++) inkLine([[-w / 2 + 40 + i * 30, -2 * fh - 30 - i * 40], [w / 2 - 80 - i * 45, -2 * fh - 10 - i * 42]], .7, '#5A2A20');
    if (!o.tileGone) paint(rectPts(w / 2 - 20, -2 * fh + 5, 46, 24), { wash: C.roof, ink: PAL.ink, sw: .8 });
    paint(rectPts(130, -2 * fh - 180, 50, 110), { wash: '#8E5A48', ink: PAL.ink, sw: 1 });   // baca
    for (const [wx, wy] of [[-150, -fh + 50], [60, -fh + 50], [-150, -2 * fh + 55], [60, -2 * fh + 55]]) {
      paint(rectPts(wx, wy, 90, 110), { wash: C.win, ink: PAL.ink, sw: 1 });
      inkLine([[wx + 45, wy], [wx + 45, wy + 110]], .7, '#7d8794'); inkLine([[wx, wy + 55], [wx + 90, wy + 55]], .7, '#7d8794');
    }
    paint([[150, -2 * fh + 55], [195, -2 * fh + 70], [175, -2 * fh + 190], [135, -2 * fh + 170]], { wash: '#8B6A4E', ink: PAL.ink, sw: .9 }); // sarkan kepenk
    paint(rectPts(-50, -150, 95, 150), { wash: '#6B4A33', ink: PAL.ink, sw: 1 });
    inkLine([[-w / 2 + 60, -2 * fh + 20], [-w / 2 + 95, -2 * fh + 90], [-w / 2 + 70, -2 * fh + 150], [-w / 2 + 110, -fh - 20]], 1, '#3A2A22', 'ink', 0);
    inkLine([[w / 2 - 110, -fh + 20], [w / 2 - 140, -fh + 90], [w / 2 - 105, -fh + 160]], 1, '#3A2A22', 'ink', 0);
    pop();
  }
  const ROOF_EDGE = [HX + 250, GY - 470];

  // ---------- yeni bina: 6 kat, kat kat yükselir ----------
  const FLOORS = 6, FH = 165, BW = 580;
  function newBuilding(g, t, fam = 0) {
    for (let i = 0; i < FLOORS; i++) {
      const k = backOut(clamp(g * FLOORS - i));
      if (k < .02) continue;
      const y0 = GY - (i + 1) * FH;
      push(); translate(HX, GY - i * FH); scale(1, k); translate(-HX, -(GY - i * FH));
      boilSeed('fl' + i);
      paint(rectPts(HX - BW / 2, y0, BW, FH), { wash: ADG.cream, ink: PAL.ink, sw: 1.2 });
      paint(rectPts(HX + BW / 2 - 60, y0, 60, FH), { wash: '#F2DCCB', ink: null });
      paint(rectPts(HX - BW / 2 - 12, y0 + FH - 22, BW + 24, 22), { wash: ADG.orange, ink: PAL.ink, sw: .9 });
      for (let j = 0; j < 3; j++) {
        const wx = HX - BW / 2 + 50 + j * 170;
        if (i === 0 && j === 1) { paint(rectPts(wx + 20, y0 + 20, 90, FH - 22), { wash: ADG.maroon, ink: PAL.ink, sw: 1 }); continue; }
        paint(rectPts(wx, y0 + 28, 130, 95), { wash: '#9ED0EA', ink: PAL.ink, sw: 1 });
        inkLine([[wx + 20, y0 + 95], [wx + 50, y0 + 45]], 1.2, '#E8F6FF');
      }
      pop();
    }
    if (g >= 1) {                                       // çatı: logo levhası
      const ty = GY - FLOORS * FH;
      boilSeed('rooftop');
      paint(rectPts(HX - BW / 2 - 15, ty - 30, BW + 30, 30), { wash: ADG.maroon, ink: PAL.ink, sw: 1 });
      const s = 1;
      paint(rrPts(HX - 95, ty - 210, 190, 160, 20), { wash: ADG.orange, ink: PAL.ink, sw: 1.2 });
      adgLogoMark(HX, ty - 130, 105 * s, ADG.cream, 1);
    }
    if (fam > .02) {                                    // 2. kattaki pencerede aile el sallar
      const wx = HX - BW / 2 + 50 + 170, y0 = GY - 2 * FH, k = backOut(fam);
      boilSeed('family');
      push(); translate(wx + 65, y0 + 123); scale(k);
      paint(ellPts(-30, -40, 26, 26, 16), { wash: '#F3C29B', ink: PAL.ink, sw: .8 });
      paint(ellPts(-30, -62, 26, 14, 14), { wash: '#5A3220', ink: null });
      paint(ellPts(28, -28, 20, 20, 14), { wash: '#F8CCA4', ink: PAL.ink, sw: .8 });
      paint(ellPts(28, -46, 20, 10, 12), { wash: '#C2662E', ink: null });
      inkLine([[-38, -36], [-30, -32], [-22, -36]], .6); inkLine([[22, -24], [28, -20], [34, -24]], .6);
      const wv = Math.sin(t * 12) * .35;
      paint(ribbon([[46, -18], [62 + 12 * wv, -55], [58 + 20 * wv, -80]], 11, 9), { wash: '#F8CCA4', ink: PAL.ink, sw: .6 });
      pop();
    }
  }

  // ---------- eşyalar ----------
  const blueprint = (open) => (u, sw) => {
    const w = lerp(.4, 3.4, easeOut(open)) * u;
    paint(rectPts(-.2 * u, -1.4 * u, .5 * u, 2.6 * u), { wash: '#3E7CC0', ink: PAL.ink, sw });
    if (open > .02) {
      paint(rectPts(.1 * u, -1.25 * u, w, 2.3 * u), { wash: '#5B9BE0', ink: PAL.ink, sw });
      if (open > .6) { inkLine([[.5 * u, .6 * u], [.5 * u, -.6 * u], [1.6 * u, -.9 * u], [2.6 * u, -.6 * u], [2.6 * u, .6 * u]], sw * .6, '#EAF4FF', 'ink', 0); inkLine([[.5 * u, .6 * u], [2.6 * u, .6 * u]], sw * .6, '#EAF4FF'); }
    }
  };
  const hammer = (u, sw) => {
    paint(rectPts(-.2 * u, -.15 * u, 2.2 * u, .32 * u), { wash: '#B07A3A', ink: PAL.ink, sw });
    paint(rrPts(1.8 * u, -.75 * u, .7 * u, 1.5 * u, .15 * u), { wash: '#6C7A89', ink: PAL.ink, sw });
  };
  function pole(p0, p1, k, len, ang, key) {           // havada yay çizip yerine oturan iskele borusu
    if (k <= 0) return;
    const [x, y] = arcPt(p0, p1, 260, easeOut(k)), a = lerp(ang - 2.5, ang, easeOut(k));
    boilSeed('pole' + key);
    push(); translate(x, y); rotate(a);
    paint(rectPts(-len / 2, -9, len, 18), { wash: '#E8AA38', ink: PAL.ink, sw: .9 });
    pop();
  }
  function dust(r, cx, cy, key = 'dust') {            // toz bulutu: r 0..1 (1 = kareyi örter)
    if (r <= .01) return;
    const n = 10;
    for (let i = 0; i < n; i++) {
      boilSeed(key + i);
      const a = i / n * TAU + hash(i) , d = 260 * r + 80 * hash(i + 3), rr = (140 + 120 * hash(i + 9)) * r * 3.2;
      paint(ellPts(cx + Math.cos(a) * d, cy + Math.sin(a) * d * 1.4, rr, rr * .8, 20), { wash: i % 2 ? '#E9DFD2' : '#D8CBBB', ink: PAL.ink, sw: .9 });
    }
  }

  // ---------- A: yorgun ev (0–4) ----------
  function shotA(t, lt, dur) {
    const tile = seg(lt, 1.45, 1.95);
    camBegin(540, 1180, 1 + .015 * lt);
    sky(0); clouds(0, t); backdrop(0); street(0);
    oldHouse(t, { creak: spring(lt, 1.35, 5, 20) * 2, tileGone: lt > 1.45 });
    if (lt > 1.45) {
      const p = lt < 1.95 ? arcPt(ROOF_EDGE, [500, GY - 14], 80, easeIn(tile)) : [500, GY - 14 - 30 * Math.abs(spring(lt, 1.95, 7, 22))];
      boilSeed('tile'); push(); translate(p[0], p[1]); rotate(lt < 1.95 ? tile * 5 : .3);
      paint(rectPts(-23, -12, 46, 24), { wash: C.roof, ink: PAL.ink, sw: .8 }); pop();
      if (lt > 1.95 && lt < 2.4) emote('spark', 500, GY - 60, 16, seg(lt, 1.95, 2.05), lt - 1.95);
    }
    const s = stroll(lt, .1, 1.4, -160, 290, 40), u = 40;
    let o = { walk: s.walk, dy: s.dy, lookX: .9, lookY: -.2, eyes: 'open', mouth: 'smile', aL: .25 + .2 * Math.sin(s.walk * Math.PI), aR: .25 - .2 * Math.sin(s.walk * Math.PI) };
    if (lt > 1.2) o = { ...o, lookX: .7, lookY: -.9, mouth: 'sad', brow: -.8, blush: .2 };
    if (lt > 1.9) { const tk = take(lt, 2.0, 1.2); o = { ...o, eyes: 'wide', mouth: 'o', brow: -.3, lookX: .9, lookY: .6, aL: 1.3, aR: 1.3, sq: tk.sq, dy: tk.dy, emote: '!', emoteK: seg(lt, 2.0, 2.15), emoteAge: lt - 2 }; }
    if (lt > 2.85) {
      const j = jump(lt, 3.15, 3.5, 1.2), fist = kf(lt, [[2.85, 1.3], [3.05, 2.9], [3.5, 2.6]], backOut);
      o = { ...o, eyes: 'determined', mouth: 'grin', brow: 1, lookX: .2, lookY: 0, aL: .3, aR: fist, bendR: -.5, sq: j.sq, dy: j.dy, emote: null, blush: .6 };
    }
    adg(s.x, GY, u, o);
    rain(1, t);
    camEnd();
    if (lt < .55) iris(540, 1000, lerp(0, 1300, easeIn(lt / .55)));
    if (lt > dur - .3) brushWipe((lt - (dur - .3)) / .6, [ADG.orangeDk, ADG.orange]);
  }

  // ---------- B: plan, çekiç, toz (4–8) ----------
  function shotB(t, lt, dur) {
    const hits = [1.65, 2.15], sh = hits.reduce((a, h) => a + Math.max(0, 1 - (lt - h) / .2) * (lt > h ? 1 : 0), 0);
    const [sx, sy] = shakeXY(t, 7 * sh + (lt > 2.6 && lt < 3.3 ? 9 : 0));
    camBegin(560 + sx, 1170 + sy, 1.06);
    sky(.08); clouds(.1, t); backdrop(.05); street(.05);
    const col = ease(seg(lt, 2.65, 3.3));
    oldHouse(t, { tileGone: true, collapse: col, creak: ring(lt, hits, 6, 24) * 2 });
    const poles = [[1.4, [HX - 180, GY - 260], 470, Math.PI / 2], [1.85, [HX + 200, GY - 260], 470, Math.PI / 2], [2.3, [HX, GY - 300], 560, 0]];
    if (col < .5) poles.forEach(([t0, p1, len, ang], i) => pole([-120, 900], p1, seg(lt, t0, t0 + .45), len, ang, i));
    const u = 44;
    let o = { lookX: .8, lookY: .2, eyes: 'open', mouth: 'smile', aL: .3 };
    if (lt < 1.25) {
      const op = seg(lt, .25, .9);
      o = { ...o, aR: 1.55, bendR: -.2, holdR: blueprint(op), lookX: .9, lookY: .3, emote: lt > .85 ? 'bulb' : null, emoteK: seg(lt, .85, 1.0), emoteAge: lt - .85, mouth: lt > .85 ? 'grin' : 'smile' };
    } else if (lt < 2.6) {
      const sw = hits.reduce((a, h) => a + spring(lt, h, 8, 26) * .3, 0);
      const arc = kf(lt, [[1.25, 1.6], [1.5, 2.8], [1.65, 1.3], [2.0, 2.8], [2.15, 1.3], [2.6, 1.5]], easeIn);
      o = { ...o, aR: arc + sw, bendR: .1, holdR: hammer, eyes: 'determined', brow: 1, mouth: 'grin', lookX: 1, lookY: -.2 };
    } else {
      o = { ...o, eyes: 'closed', mouth: 'o', aL: 1.2, aR: 1.2, brow: -.4, emote: 'sweat', emoteK: seg(lt, 2.7, 2.85), emoteAge: lt - 2.7 };
    }
    adg(300, GY, u, o);
    for (const h of hits) if (lt > h && lt < h + .35) emote('spark', HX - 230, GY - 330, 20, seg(lt, h, h + .08), lt - h);
    dust(ease(seg(lt, 2.6, 3.85)) * 1.25, HX - 60, GY - 300);
    rain(.5 * (1 - col), t);
    camEnd();
    if (lt < .3) brushWipe(.5 + lt / .6, [ADG.orangeDk, ADG.orange]);
    if (lt > dur - .3) flash(seg(lt, dur - .3, dur), '#E9DFD2');
  }

  // ---------- C: yeni bina yükselir (8–12.5) ----------
  function world(t, k, g, fam, flowers) {
    sky(k); sun(k, t); clouds(k, t); backdrop(k); street(k);
    newBuilding(g, t, fam); grassAndFlowers(flowers, t);
  }
  function shotC(t, lt, dur) {
    const k = ease(seg(lt, 1.3, 2.5)), g = seg(lt, .4, 2.3), fam = seg(lt, 2.9, 3.25);
    camBegin(540, lerp(1120, 1080, ease(lt / dur)), lerp(1.06, .96, ease(lt / dur)));
    world(t, k, g, fam, seg(lt, 2.3, 3.2));
    const u = 42;
    let o = { lookX: .6, lookY: -1, eyes: 'wide', mouth: 'o', aL: .6, aR: .6, blush: .4 };
    for (let i = 0; i < FLOORS; i++) if (g * FLOORS > i && g * FLOORS < i + .25) o = { ...o, dy: -.15 };
    if (lt > 2.35) {
      const j = jump(lt, 2.5, 2.9, 1.6);
      o = { ...o, eyes: 'happy', mouth: 'open', brow: .2, blush: 1, aL: kf(lt, [[2.35, .6], [2.55, 2.6]], backOut), aR: kf(lt, [[2.4, .6], [2.6, 2.7]], backOut), bendL: -.3, bendR: -.4, sq: j.sq, dy: j.dy };
    }
    if (lt > 3.1) o = { ...o, eyes: 'happy', mouth: 'grin', lookX: .8, lookY: -.6, aL: .5, aR: .9 + .25 * Math.sin(lt * 10), emote: 'hearts', emoteK: seg(lt, 3.2, 3.4), emoteAge: lt - 3.2 };
    adg(260, GY, u, o);
    dust(1.25 * (1 - easeOut(seg(lt, 0, .9))), HX - 60, GY - 300, 'dustC');
    rain(.4 * (1 - k), t);
    camEnd();
  }

  // ---------- D: ADG kameraya el sallar, logo (12.5–16.5) ----------
  function shotD(t, lt, dur) {
    const p = ease(seg(lt, 0, 1.1));
    camBegin(lerp(540, 330, p), lerp(1080, 1330, p), lerp(.96, 1.75, p));
    world(t, 1, 1, 1, 1);
    const wave = Math.sin(lt * 11) * .3;
    adg(260, GY, 42, { eyes: lt < 1.4 ? 'open' : 'happy', mouth: 'grin', lookX: 0, lookY: 0, blush: .9,
      aL: .35, aR: 2.55 + wave, bendR: -.2 + wave * .6, logoGlow: ease(seg(lt, 1.0, 1.6)) * (1 - ease(seg(lt, 3.0, 3.4))) });
    camEnd();
    // marka kartı (ekran uzayında)
    const c = backOut(seg(lt, 1.35, 1.8));
    if (c > .02) {
      push(); translate(W / 2, 1600); scale(c);
      boilSeed('card');
      paint(rrPts(-420, -170, 840, 340, 46), { wash: ADG.maroon, ink: PAL.ink, sw: 1.6 });
      paint(rrPts(-404, -154, 808, 308, 36), { wash: ADG.orange, ink: null });
      adgLogoMark(-250, -10, 170, ADG.cream, 1.2);
      pop();
      letter('ADG', W / 2 + 70 * c, 1555, 120 * c, ADG.cream, { screen: true, ink: false, font: `300 ${Math.round(150 * c)}px "DejaVu Sans", sans-serif` });
      letter('Y A P I', W / 2 + 70 * c, 1680, 50 * c, ADG.cream, { screen: true, ink: false, font: `${Math.round(48 * c)}px "DejaVu Sans", sans-serif` });
    }
    if (lt > dur - .5) { flushLetters(); flash(ease(seg(lt, dur - .5, dur - .1)), ADG.maroon); }
  }

  shots([[0, shotA], [4, shotB], [8, shotC], [12.5, shotD]]);
})();

LOOPS.adgsheet = t => {
  paint(rectPts(-20, -20, W + 40, H + 40), { wash: '#FBE6D2', ink: null });
  adg(300, 820, 40, { eyes: 'open', mouth: 'smile', aR: 2.6, bendR: -.3 });
  adg(780, 820, 40, { eyes: 'wide', mouth: 'o', brow: -.6, aL: 1.2, aR: 1.2, emote: '!' });
  adg(300, 1700, 40, { eyes: 'determined', mouth: 'grin', brow: 1, aR: 2.9, bendR: -.5 });
  adg(780, 1700, 40, { eyes: 'happy', mouth: 'open', blush: 1, aL: .9, aR: 2.8, logoGlow: 1 });
};
LOOPS.adgsheet.len = 1;
