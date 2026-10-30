const { chromium } = require('playwright');
const DIR = __dirname;   // betik hangi dizindeyse hat orada çalışır
const FPS = 30, A = Number(process.argv[2]), B = Number(process.argv[3]);
(async () => {
  const b = await chromium.launch({ args:['--headless','--no-sandbox','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader'] });
  const p = await b.newPage({ viewport:{width:1320,height:780} });
  p.on('pageerror', e=>console.log('PAGEERROR:', e.message));
  await p.goto('file://'+DIR+'/build/render.html', {waitUntil:'load'});
  await p.waitForFunction(()=>window.FILM, null, {timeout:60000});
  await p.waitForTimeout(1500);
  await p.evaluate(()=>window.FILM.renderMode(1280,720));
  const el = await p.$('#stage');
  for (let f=A; f<=B; f++){
    await p.evaluate(x=>window.FILM.renderAt(x), f/FPS);
    await el.screenshot({ path: DIR+'/frames/'+String(f).padStart(4,'0')+'.png' });
  }
  console.log('yenilenen kareler:', A, '-', B);
  await b.close();
})();
