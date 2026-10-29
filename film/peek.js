const { chromium } = require('playwright');
const DIR = '/tmp/claude-0/-home-user-adg-yapi-katalog/93137111-a395-5609-8608-ddab847a94f1/scratchpad';
(async () => {
  const b = await chromium.launch({ args:['--headless','--no-sandbox','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader'] });
  const p = await b.newPage({ viewport:{width:1300,height:800}, deviceScaleFactor:1 });
  const errs=[];
  p.on('pageerror', e=>errs.push('PAGEERROR: '+e.message));
  p.on('console', m=>{ if(m.type()==='error') errs.push('CONSOLE: '+m.text()); });
  await p.goto('file://'+DIR+'/build/render.html', {waitUntil:'load'});
  await p.waitForFunction(()=>window.FILM, null, {timeout:30000});
  await p.waitForTimeout(1500);
  await p.evaluate(()=>window.FILM.renderMode(1280,720));
  const el = await p.$('#stage');
  const times = process.argv.slice(2).map(Number);
  for (const t of times){
    const t0 = Date.now();
    await p.evaluate(x=>window.FILM.renderAt(x), t);
    await el.screenshot({ path: `${DIR}/shots/f${String(t).replace('.','_')}.png` });
    console.log('t='+t, (Date.now()-t0)+'ms');
  }
  console.log(errs.length ? errs.join('\n') : 'no errors');
  await b.close();
})();
