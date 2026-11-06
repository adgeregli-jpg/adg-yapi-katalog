// SVG'lerden 300 dpi PNG (şeffaf zemin) ve baskı provası PDF üretir.
// Çalıştır: node hediye/cikti.js   (önce python3 hediye/uret.py)
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
const KOK = __dirname;
const svgler = fs.readdirSync(KOK).filter(f => f.endsWith('.svg')).sort();

(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ deviceScaleFactor: 5 }); // 840 px × 5 ≈ 14 cm @ 300 dpi
  for (const f of svgler) {
    const svg = fs.readFileSync(path.join(KOK, f), 'utf8');
    const m = svg.match(/width="(\d+)" height="(\d+)"/);
    await p.setViewportSize({ width: +m[1], height: +m[2] });
    await p.setContent(`<style>html,body{margin:0;background:transparent}</style>${svg}`);
    await p.screenshot({ path: path.join(KOK, f.replace('.svg', '.png')), omitBackground: true });
    console.log('png:', f.replace('.svg', '.png'));
  }
  // Prova sayfası: hangi ürüne hangi sürüm
  const kart = (f, zemin, not) => `<figure style="background:${zemin}"><div>${fs.readFileSync(path.join(KOK, f), 'utf8')}</div><figcaption>${f.replace('.svg', '')}<br><small>${not}</small></figcaption></figure>`;
  await p.setContent(`<!doctype html><meta charset="utf-8"><style>
    @page{size:A4;margin:14mm}body{font-family:Inter,sans-serif;color:#3a1500;margin:0}
    h1{font-weight:300;font-size:20px;margin:0 0 4px}p{margin:0 0 14px;font-size:11px;color:#6b2200}
    .g{display:grid;grid-template-columns:1fr 1fr;gap:10px}
    figure{margin:0;border-radius:6px;border:1px solid #eadfd6;padding:18px 18px 8px}
    figure svg{width:100%;height:auto;display:block}
    figcaption{font-size:10px;color:#888;margin-top:8px}figure[style*="#1"] figcaption{color:#bbb}
  </style><h1>ADG Yapı — hediyelik baskı provası</h1>
  <p>Logo ve yazılar vektör yoldur; font gerekmez. Matbaaya SVG (veya 300 dpi PNG) verin.</p>
  <div class="g">
   ${kart('adg-hediye-turuncu.svg', '#fff', 'Beyaz kupa, bez çanta, kraft defter')}
   ${kart('adg-hediye-turuncu-telefonlu.svg', '#fdf3ec', 'Ajanda, not defteri, takvim')}
   ${kart('adg-hediye-beyaz.svg', '#1d1d1f', 'Siyah/lacivert kupa, termos')}
   ${kart('adg-hediye-beyaz-telefonlu.svg', '#6b2200', 'Koyu ajanda, karton çanta')}
   ${kart('adg-hediye-tek-renk-siyah.svg', '#fff', 'Lazer kazıma: kalem, anahtarlık, metal termos')}
  </div>`);
  await p.pdf({ path: path.join(KOK, 'ADG_Yapi_Hediyelik_Baski_Provasi.pdf'), format: 'A4', printBackground: true, margin: { top: '14mm', bottom: '14mm', left: '14mm', right: '14mm' } });
  console.log('pdf: ADG_Yapi_Hediyelik_Baski_Provasi.pdf');
  await b.close();
})();
