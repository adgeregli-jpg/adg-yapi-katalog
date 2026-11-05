// adg_cag.js — "Çağın İlerisinde": farklı bir müteahhitlik firması, kentsel dönüşüm odaklı, çağın ilerisinde yapılar.
// 9:16, 1080×1920, 15 sn, 120 BPM (vuruş = 0,5 sn). Senaryo: STORYBOARD_CAG.md.
(() => {
  const GY = 1560, TX = 650;
  const FONT = (px) => `bold ${Math.round(px)}px "DejaVu Sans", sans-serif`;

  // ekran üstü slogan: turuncu şerit + krem yazı, şerit açılır, satırlar sırayla zıplar
  function slogan(lines, lt, t0, y = 210) {
    const k = backOut(seg(lt, t0, t0 + .35));
    if (k < .02) return;
    const h = 110 * lines.length + 40;
    push(); translate(W / 2, y + h / 2 - 55); scale(k, 1);
    boilSeed('band' + lines[0]);
    paint(rrPts(-500, -h / 2, 1000, h, 34), { wash: ADG.maroon, ink: PAL.ink, sw: 1.4 });
    paint(rrPts(-488, -h / 2 + 12, 976, h - 24, 26), { wash: ADG.orange, ink: null });
    pop();
    lines.forEach((s, i) => {
      const p = seg(lt, t0 + .15 + i * .2, t0 + .5 + i * .2);
      if (p <= 0) return;
      const size = s.length > 14 ? 66 : 84;
      letter(s, W / 2, y + i * 110, size, ADG.cream, { screen: true, ink: false, pop: p, font: FONT(size), stroke: ADG.maroon });
    });
  }

  function sky(top, bot) {
    boilSeed('sky');
    paint(rectPts(-400, -1200, W + 800, GY + 1200), { wash: top, ink: null });
    paint(rectPts(-400, 1100, W + 800, GY - 1100), { wash: bot, washOp: 210, ink: null });
  }
  function street(col) {
    boilSeed('street');
    paint(rectPts(-400, GY, W + 800, 800), { wash: col, ink: null });
    inkLine([[-200, GY], [W + 200, GY]], 1.4);
  }

  // ---------- A: birbirinin aynı gri kutular ----------
  function greyBlocks() {
    for (let i = 0; i < 4; i++) {
      const x = -40 + i * 290, top = 880;
      boilSeed('gb' + i);
      paint(rectPts(x, top, 240, GY - top), { wash: '#9A9EA3', ink: PAL.ink, sw: 1 });
      for (let r = 0; r < 6; r++) for (let c = 0; c < 3; c++)
        paint(rectPts(x + 28 + c * 70, top + 40 + r * 105, 44, 60), { wash: '#6E737A', ink: null });
    }
  }
  function shotA(t, lt, dur) {
    camBegin(540, 1150, 1 + .012 * lt);
    sky('#B9BEC4', '#CDD1D5'); greyBlocks(); street('#7C8085');
    const s = stroll(lt, .05, 1.5, -170, 540, 44);
    let o = { walk: s.walk, dy: s.dy, eyes: 'open', mouth: 'flat', brow: -.3, lookX: .4, lookY: -.6, blush: .1,
              aL: .25 + .2 * Math.sin(s.walk * Math.PI), aR: .25 - .2 * Math.sin(s.walk * Math.PI) };
    if (lt > 1.5) o = { ...o, lookX: -.6, lookY: -.8, mouth: 'flat', brow: -.5 };
    if (lt > 2.0) o = { ...o, lookX: 0, lookY: -1, mouth: 'o', brow: 0 };
    if (lt > 2.35) { const tk = take(lt, 2.4, 1); o = { ...o, eyes: 'wide', mouth: 'grin', brow: .4, lookY: 0, sq: tk.sq, dy: tk.dy, aR: 2.6, bendR: -.3, blush: .6, emote: 'bulb', emoteK: seg(lt, 2.4, 2.6), emoteAge: lt - 2.4 }; }
    adg(s.x, GY, 44, o);
    camEnd();
    slogan(['FARKLI BİR', 'MÜTEAHHİTLİK FİRMASI'], lt, .35);
    if (lt < .4) flash(1 - lt / .4, ADG.maroon);
    if (lt > dur - .3) { flushLetters(); brushWipe((lt - (dur - .3)) / .6, [ADG.orangeDk, ADG.orange]); }
  }

  // ---------- B + C: dönüşüm ve geleceğin yapısı ----------
  function oldHouse(col) {
    if (col > .98) return;
    push(); translate(TX, GY); rotate(-.04); scale(1 + col * .15, 1 - col);
    boilSeed('oh');
    const w = 420, fh = 210;
    paint(rectPts(-w / 2, -2 * fh, w, 2 * fh), { wash: '#C7AE8E', ink: PAL.ink, sw: 1.2 });
    paint([[-w / 2 - 40, -2 * fh + 5], [-10, -2 * fh - 180], [w / 2 + 35, -2 * fh + 20]], { wash: '#7A3B2E', ink: PAL.ink, sw: 1.2 });
    for (const [wx, wy] of [[-140, -fh + 50], [50, -fh + 50], [-140, -2 * fh + 50], [50, -2 * fh + 50]]) paint(rectPts(wx, wy, 85, 100), { wash: '#46505E', ink: PAL.ink, sw: 1 });
    paint(rectPts(-45, -140, 90, 140), { wash: '#6B4A33', ink: PAL.ink, sw: 1 });
    inkLine([[-w / 2 + 50, -2 * fh + 20], [-w / 2 + 90, -2 * fh + 90], [-w / 2 + 60, -fh - 10]], 1, '#3A2A22', 'ink', 0);
    pop();
  }
  const FL = 7, FH = 150, TW = 470;
  function futureTower(g, t, lit = 0) {                  // kavisli camlar, yeşil teraslar, turuncu omurga, güneş panelleri
    for (let i = 0; i < FL; i++) {
      const k = backOut(clamp(g * FL - i)); if (k < .02) continue;
      const y1 = GY - i * FH, y0 = y1 - FH, inset = 10 + 14 * i / FL, sh = 16 * Math.sin(i * .8);   // yukarı doğru incelen, hafif burgulu kule
      push(); translate(TX, y1); scale(1, k); translate(-TX, -y1);
      boilSeed('tf' + i);
      const xl0 = TX - TW / 2 + inset + sh, xr0 = TX + TW / 2 - inset + sh, xl1 = TX - TW / 2 + inset + 8 + 16 * Math.sin((i + 1) * .8), xr1 = TX + TW / 2 - inset - 8 + 16 * Math.sin((i + 1) * .8);
      paint([[xl0, y1], [xl1, y0], [xr1, y0], [xr0, y1]], { wash: '#8FCBEA', ink: PAL.ink, sw: 1.2 });
      paint([[xr0 - 70, y1], [xr1 - 70, y0], [xr1, y0], [xr0, y1]], { wash: '#6FB2D8', ink: null });
      for (let j = 1; j < 5; j++) { const f = j / 5; inkLine([[lerp(xl0, xr0, f), y1 - 4], [lerp(xl1, xr1, f), y0 + 4]], .8, '#4F8DB3'); }
      inkLine([[xl0, y1 - 2], [xr0, y1 - 2]], 2.2, '#F4EDE3');
      inkLine([[xl0 + 60, y1 - 25], [xl1 + 100, y0 + 25]], 1.6, '#E8F7FF');
      if (lit > 0 && hash(i * 5 + 1) > .35) glow(TX - 140 + hash(i * 3) * 280, y0 + 75, 70, '#FFE7A0', lit * .7);
      if (i % 2 === 1) {                                   // yeşil teras
        paint(rrPts(xl0 - 26, y1 - 26, xr0 - xl0 + 52, 26, 12), { wash: '#F4EDE3', ink: PAL.ink, sw: .9 });
        for (let b = 0; b < 6; b++) paint(ellPts(xl0 - 6 + b * ((xr0 - xl0 + 12) / 5), y1 - 34, 30, 20, 12), { wash: b % 2 ? '#6FAE4E' : '#86C25F', ink: PAL.ink, sw: .7 });
      }
      paint([[xl0 + 40, y1], [xl1 + 40, y0], [xl1 + 62, y0], [xl0 + 62, y1]], { wash: ADG.orange, ink: null });     // turuncu omurga
      pop();
    }
    if (g >= 1) {
      const top = GY - FL * FH;
      boilSeed('crown');
      paint(ellPts(TX + 16 * Math.sin(FL * .8), top, TW / 2 - 40, 70, 30).filter(p => p[1] <= top + 1), { wash: '#BFE3F5', ink: PAL.ink, sw: 1.2 });
      for (let s = -1; s <= 1; s += 2) paint([[TX + s * 60, top - 40], [TX + s * 170, top - 40], [TX + s * 190, top - 10], [TX + s * 80, top - 10]], { wash: '#2F3C7A', ink: PAL.ink, sw: .9 });
      paint(rrPts(TX - 70, top - 190, 140, 120, 18), { wash: ADG.orange, ink: PAL.ink, sw: 1.1 });
      adgLogoMark(TX, top - 130, 78, ADG.cream, 1);
      if (lit > 0) glow(TX, top - 130, 160, '#FFD9A0', lit);
    }
  }
  const blueprint = (open) => (u, sw) => {
    const w = lerp(.4, 3.4, easeOut(open)) * u;
    paint(rectPts(-.2 * u, -1.4 * u, .5 * u, 2.6 * u), { wash: '#3E7CC0', ink: PAL.ink, sw });
    if (open > .02) {
      paint(rectPts(.1 * u, -1.25 * u, w, 2.3 * u), { wash: '#5B9BE0', ink: PAL.ink, sw });
      if (open > .6) inkLine([[.6 * u, .7 * u], [.6 * u, -.4 * u], [1.6 * u, -.95 * u], [2.6 * u, -.4 * u], [2.6 * u, .7 * u]], sw * .6, '#EAF4FF', 'ink', .4);
    }
  };
  function dust(r, cx, cy, key) {
    if (r <= .01) return;
    for (let i = 0; i < 9; i++) {
      boilSeed(key + i);
      const a = i / 9 * TAU + hash(i), d = 200 * r + 60 * hash(i + 3), rr = (110 + 90 * hash(i + 9)) * r * 2.2;
      paint(ellPts(cx + Math.cos(a) * d, cy + Math.sin(a) * d * 1.3, rr, rr * .8, 18), { wash: i % 2 ? '#F1E6D8' : '#E2D4C2', ink: PAL.ink, sw: .9 });
    }
  }
  function birds(t, k) {
    if (k <= 0) return;
    boilSeed('birds');
    for (let i = 0; i < 4; i++) {
      const x = -100 + frac(hash(i) + t * .08) * 1300, y = 520 + i * 90 + 20 * Math.sin(t * 2 + i), f = 18 * Math.sin(t * 14 + i * 2);
      inkLine([[x - 24, y - f], [x, y], [x + 24, y - f]], 1.1);
    }
  }
  const skyB = k => sky(mixCol('#CFE3EE', '#FFD8A8', k), mixCol('#E4EFF4', '#FFEBD0', k));

  function shotB(t, lt, dur) {
    camBegin(540, 1150, 1.02);
    skyB(0); street('#B9AD9C');
    const col = ease(seg(lt, 1.35, 1.9)), g = seg(lt, 2.0, 3.9);
    oldHouse(col);
    futureTower(g, t);
    let o = { eyes: 'open', mouth: 'smile', lookX: .9, lookY: .3, aL: .3, aR: 1.55, bendR: -.2, holdR: blueprint(seg(lt, .25, .9)) };
    if (lt > .9) o = { ...o, mouth: 'grin', emote: 'spark', emoteK: seg(lt, .9, 1.05), emoteAge: lt - .9 };
    if (lt > 1.3) o = { ...o, holdR: null, aR: kf(lt, [[1.3, 1.55], [1.5, 1.9]], backOut), bendR: 0, lookX: 1, lookY: -.3, emote: null, eyes: 'determined', brow: .8 };
    if (lt > 2.1) o = { ...o, eyes: 'wide', mouth: 'o', brow: 0, lookX: .8, lookY: -1, aR: .5, aL: .5 };
    if (lt > 3.6) { const j = jump(lt, 3.75, 4.15, 1.3); o = { ...o, eyes: 'happy', mouth: 'open', blush: 1, aL: 2.6, aR: 2.7, bendL: -.3, bendR: -.3, sq: j.sq, dy: j.dy }; }
    adg(230, GY, 44, o);
    dust(ease(seg(lt, 1.2, 1.7)) * (1 - ease(seg(lt, 2.3, 3.2))) * .85, TX + 40, GY - 230, 'dB');
    camEnd();
    slogan(['KENTSEL DÖNÜŞÜM', 'ODAKLI'], lt, .45, 150);
    if (lt < .3) brushWipe(.5 + lt / .6, [ADG.orangeDk, ADG.orange]);
  }

  // ---------- C: kamera yukarı, ADG asansörle yükselir ----------
  function shotC(t, lt, dur) {
    const lift = ease(seg(lt, .5, 2.6)), py = GY - 640 * lift;
    camBegin(560, lerp(1150, 900, ease(seg(lt, .2, 2.8))), lerp(1.02, 1.08, ease(lt / dur)));
    skyB(ease(seg(lt, 0, 1.2)));
    birds(t, seg(lt, .6, 1));
    street('#C9B79F');
    futureTower(1, t, ease(seg(lt, .8, 1.6)));
    boilSeed('rails');                                       // asansör rayları + platform
    inkLine([[130, GY], [130, GY - 720]], 1.6, '#5A5F66'); inkLine([[330, GY], [330, GY - 720]], 1.6, '#5A5F66');
    paint(rrPts(110, py, 240, 26, 10), { wash: ADG.orange, ink: PAL.ink, sw: 1 });
    inkLine([[120, py], [120, py - 70], [340, py - 70], [340, py]], 1, ADG.maroon, 'ink', 0);
    let o = { eyes: 'happy', mouth: 'grin', blush: .8, lookX: .6, lookY: -.4, aL: .5, aR: .5 };
    if (lt > .5 && lt < 2.6) o = { ...o, eyes: 'wide', mouth: 'open', aL: 1.1, aR: 1.1, lookX: .8, lookY: -.8 };
    if (lt > 2.6) o = { ...o, eyes: 'happy', mouth: 'open', aL: 2.5, aR: 2.6 + .25 * Math.sin(lt * 10), bendR: -.3, emote: 'stars', emoteK: seg(lt, 2.7, 2.9), emoteAge: lt - 2.7 };
    adg(230, py, 40, o);
    camEnd();
    slogan(['ÇAĞIN İLERİSİNDE', 'YAPILAR'], lt, .3, 150);
    if (lt > dur - .3) { flushLetters(); brushWipe((lt - (dur - .3)) / .6, [ADG.maroon, ADG.orange]); }
  }

  // ---------- D: A · D · G YAPI kapanışı ----------
  function shotD(t, lt, dur) {
    boilSeed('cardbg');
    paint(rectPts(-60, -60, W + 120, H + 120), { wash: ADG.orange, ink: null });
    paint(ellPts(W / 2, 1060, 620, 620, 40), { wash: '#FF8A3D', ink: null });
    paint(rectPts(-60, 1300, W + 120, 700), { wash: ADG.maroon, ink: PAL.ink, sw: 1.2 });
    glow(W / 2, 780, 520, '#FFE2B0', .6);
    const drops = [[.3, 'A', 300], [.8, 'D', 540], [1.3, 'G', 780]];
    let look = 0;
    drops.forEach(([d, ch, x]) => { if (lt > d && lt < d + .5) look = (x - 540) / 240; });
    adg(W / 2, 1250, 46, { eyes: lt > 2.0 ? 'happy' : 'open', mouth: 'grin', blush: .9, lookX: look, lookY: lt < 1.9 ? 1 : 0,
      aL: .4, aR: lt > 2.0 ? 2.55 + .3 * Math.sin(lt * 11) : .4, bendR: -.2, logoGlow: ease(seg(lt, 1.8, 2.3)) });
    for (const [d, ch, x] of drops) {
      if (lt < d) continue;
      const a = lt - d, k = clamp(a / .28), y = a < .28 ? lerp(-150, 1480, easeIn(k)) : 1480 - 60 * Math.abs(spring(lt, d + .28, 7, 20));
      letter(ch, x, y, 210, ADG.cream, { screen: true, ink: false, font: FONT(210), stroke: '#3A1400' });
    }
    if (lt > 1.8) letter('Y A P I', W / 2, 1700, 90, ADG.cream, { screen: true, ink: false, pop: seg(lt, 1.8, 2.1) * 1, font: FONT(90), stroke: '#3A1400' });
    if (lt > 2.2) letter('kentsel dönüşüm odaklı', W / 2, 1820, 46, '#FFD9B8', { screen: true, ink: false, alpha: seg(lt, 2.2, 2.6), font: `${46}px "DejaVu Sans", sans-serif` });
    if (lt < .3) brushWipe(.5 + lt / .6, [ADG.maroon, ADG.orange]);
    if (lt > dur - .3) { flushLetters(); flash(seg(lt, dur - .3, dur), ADG.maroon); }
  }

  shots([[0, shotA], [3.5, shotB], [8, shotC], [12, shotD]]);
})();
