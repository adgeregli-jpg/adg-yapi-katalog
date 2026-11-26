const { chromium } = require('playwright');
const path=require('path');
(async()=>{
  const file=process.argv[2]; const times=process.argv.slice(3).map(Number);
  const b=await chromium.launch({args:['--no-sandbox','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
  const p=await b.newPage({viewport:{width:540,height:960},deviceScaleFactor:1});
  const errs=[];p.on('pageerror',e=>errs.push(e.message));p.on('console',m=>{if(m.type()==='error')errs.push(m.text());});
  await p.goto('file://'+path.resolve(file));await p.waitForFunction(()=>window.FILM,null,{timeout:30000});
  const el=await p.$('#stage');
  for(const t of times){await p.evaluate(x=>FILM.renderAt(x),t);await el.screenshot({path:`shots/s${String(t).replace('.','_')}.png`});}
  console.log(errs.join('\n')||'ok');await b.close();
})();
