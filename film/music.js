const { chromium } = require('playwright');
const fs = require('fs');
const DIR = __dirname;   // betik hangi dizindeyse hat orada çalışır
(async () => {
  const b = await chromium.launch({ args:['--headless','--no-sandbox','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader'] });
  const p = await b.newPage();
  p.on('pageerror', e=>console.log('PAGEERROR:', e.message));
  await p.goto('file://'+DIR+'/build/render.html', {waitUntil:'load'});
  await p.waitForFunction(()=>window.FILM, null, {timeout:60000});
  const wav = await p.evaluate(()=>window.FILM.renderMusic());
  fs.writeFileSync(DIR+'/aud/music.wav', Buffer.from(wav, 'base64'));
  console.log('music.wav', (Buffer.from(wav,'base64').length/1e6).toFixed(1)+'MB');
  await b.close();
})();
