const { chromium } = require('playwright');
const fs = require('fs');
const DIR = __dirname;   // betik hangi dizindeyse hat orada çalışır
const FPS = 30, W = 1280, H = 720;
(async () => {
  const b = await chromium.launch({ args:['--headless','--no-sandbox','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader'] });
  const p = await b.newPage({ viewport:{width:W+40,height:H+60}, deviceScaleFactor:1 });
  p.on('pageerror', e=>console.log('PAGEERROR:', e.message));
  await p.goto('file://'+DIR+'/build/render.html', {waitUntil:'load'});
  await p.waitForFunction(()=>window.FILM, null, {timeout:60000});
  await p.waitForTimeout(2000);

  // müziği çevrim dışı sentezle
  const wav = await p.evaluate(()=>window.FILM.renderMusic());
  fs.writeFileSync(DIR+'/aud/music.wav', Buffer.from(wav, 'base64'));
  console.log('music.wav yazıldı');

  await p.evaluate(()=>window.FILM.renderMode(1280,720));
  const el = await p.$('#stage');
  const DUR = await p.evaluate(()=>window.FILM.DUR);
  const N = Math.round(DUR*FPS);
  const t0 = Date.now();
  const START = Number(process.argv[2]||0);
  for (let f=START; f<N; f++){
    await p.evaluate(x=>window.FILM.renderAt(x), f/FPS);
    await el.screenshot({ path: DIR+'/frames/'+String(f).padStart(4,'0')+'.png' });
    if (f % 60 === 0) console.log(f+'/'+N, ((Date.now()-t0)/1000).toFixed(0)+'s');
  }
  console.log('bitti', N, 'kare,', ((Date.now()-t0)/1000).toFixed(0)+'s');
  await b.close();
})();
