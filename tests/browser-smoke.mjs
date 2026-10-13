/** Public-page integration/visual/accessibility checks. No production dependencies.
 * TEST_URL may point to an authorized deployed preview. Uses an isolated context.
 * CHROME_BIN is optional when Chrome is installed in the usual macOS location.
 */
import assert from 'node:assert/strict';
import {mkdir,writeFile} from 'node:fs/promises';
import {existsSync} from 'node:fs';
import {chromium} from 'playwright-core';
import AxeBuilder from '@axe-core/playwright';
import {calculate,example} from '../calculator.js';

const url=process.env.TEST_URL||'https://mrpawelcz.github.io/podatki-calc/';
const chrome=process.env.CHROME_BIN||'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
if(!existsSync(chrome))throw Error('Set CHROME_BIN to an installed Chromium executable.');
const out=new URL('../test-results/browser/',import.meta.url);
await mkdir(out,{recursive:true});
const browser=await chromium.launch({executablePath:chrome,headless:true,args:['--disable-gpu'],timeout:25000});
const checks=[],pageErrors=[];
const check=async(name,fn)=>{await fn();checks.push(name);console.log(`PASS ${name}`);};
try{
  const context=await browser.newContext({viewport:{width:1440,height:1000},reducedMotion:'reduce'});
  const page=await context.newPage();page.setDefaultTimeout(15000);page.on('pageerror',e=>pageErrors.push(e.message));
  const reveal=async selector=>page.locator(selector).evaluate(el=>{for(let p=el.parentElement;p;p=p.parentElement)if(p.tagName==='DETAILS')p.open=true;});
  await page.goto(url,{waitUntil:'domcontentloaded',timeout:30000});
  await check('application starts without JavaScript errors',async()=>{await page.locator('#recommendation').waitFor();assert.deepEqual(pageErrors,[]);});
  await check('empty form does not declare a winning tax form',async()=>{assert.equal(await page.locator('.tax-card.best').count(),0);});
  await page.locator('#example').click();
  await check('published example equals tested engine output',async()=>{
    const expected=calculate(example()).results.map(r=>r.net);
    const actual=(await page.locator('.net-value').allTextContents()).map(s=>Number(s.replace(/\s|zł/g,'').replace(',','.')));
    assert.deepEqual(actual,expected);
  });
  await check('global and per-source periods preserve annual results',async()=>{
    const before=await page.locator('.net-value').allTextContents();
    await page.locator('[data-period=year]').click();
    assert.deepEqual(await page.locator('.net-value').allTextContents(),before);
    await page.locator('#period-0').selectOption('month');
    assert.deepEqual(await page.locator('.net-value').allTextContents(),before);
  });
  await check('adding and removing a revenue source works',async()=>{
    await page.locator('#add-stream').click();assert.equal(await page.locator('.stream').count(),3);
    await page.locator('#rev-2').fill('1000');await page.locator('[data-remove="2"]').click();
    assert.equal(await page.locator('.stream').count(),2);
  });
  await check('invalid amount replaces results and points to its field',async()=>{
    await page.locator('#rev-0').fill('-1');assert.equal(await page.locator('.tax-card').count(),0);
    assert.equal(await page.locator('#rev-0').getAttribute('aria-invalid'),'true');
    assert.ok(await page.locator('#rev-0').getAttribute('aria-describedby'));
    await page.locator('#rev-0').fill('18000');assert.equal(await page.locator('.tax-card').count(),3);
  });
  await check('MZ+ numerical eligibility remains a hard validation boundary',async()=>{
    await reveal('#zus-mode');await page.locator('#zus-mode').selectOption('small');
    await page.locator('#prev-revenue').fill('120000,01');assert.equal(await page.locator('.tax-card').count(),0);
    await page.locator('#prev-revenue').fill('120000');await page.locator('#small-eligible').check();
    assert.equal(await page.locator('.tax-card').count(),3);
  });
  await page.locator('#example').click();
  await check('save and reload preserve figures in the isolated browser only',async()=>{
    const before=await page.locator('.net-value').allTextContents();await page.locator('#save').click();await page.reload({waitUntil:'domcontentloaded'});
    await page.locator('.net-value').first().waitFor();assert.deepEqual(await page.locator('.net-value').allTextContents(),before);
  });
  await check('desktop has no horizontal overflow',async()=>{assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);});
  await page.screenshot({path:new URL('desktop.png',out).pathname,timeout:30000});
  for(const width of [320,375,390,768,1024]){
    await check(`responsive layout fits ${width}px viewport`,async()=>{
      await page.setViewportSize({width,height:844});
      assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
    });
  }
  await page.setViewportSize({width:390,height:844});
  await page.screenshot({path:new URL('mobile.png',out).pathname,timeout:30000});
  await check('mobile comparison jump reaches the result area',async()=>{
    await page.locator('#mobile-results-link').click();
    await page.locator('#results').waitFor();
    const box=await page.locator('#results').boundingBox();assert.ok(box&&box.y>=0&&box.y<300);
  });
  await page.screenshot({path:new URL('mobile-results.png',out).pathname,timeout:30000});
  await check('automated WCAG A/AA checks find no violations in the example',async()=>{
    const audit=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21a','wcag21aa']).analyze();
    await writeFile(new URL('accessibility.json',out),JSON.stringify(audit.violations,null,2));
    assert.deepEqual(audit.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)})),[]);
  });
  await check('print creates an A4 PDF',async()=>{await page.pdf({path:new URL('print.pdf',out).pathname,format:'A4',printBackground:true,timeout:30000});});
  await check('all interactions complete without uncaught JavaScript errors',async()=>assert.deepEqual(pageErrors,[]));
  await writeFile(new URL('summary.json',out),JSON.stringify({url,completedAt:new Date().toISOString(),checks,pageErrors},null,2));
  console.log(`Completed ${checks.length} browser checks.`);
}finally{await browser.close();}
