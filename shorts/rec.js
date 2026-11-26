const { chromium } = require('playwright');const path=require('path');const fs=require('fs');
(async()=>{const file=process.argv[2],out=process.argv[3],fps=30;fs.mkdirSync(out,{recursive:true});
 const b=await chromium.launch({args:['--no-sandbox','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
 const p=await b.newPage({viewport:{width:540,height:960}});await p.goto('file://'+path.resolve(file));
 await p.waitForFunction(()=>window.FILM);const D=await p.evaluate(()=>FILM.DUR);const el=await p.$('#stage');
 for(let i=0;i<Math.round(D*fps);i++){await p.evaluate(x=>FILM.renderAt(x),i/fps);await el.screenshot({path:`${out}/${String(i).padStart(4,'0')}.png`});}
 await b.close();})();
