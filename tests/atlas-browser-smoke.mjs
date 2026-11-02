import { chromium } from 'playwright';

const root = process.env.ATLAS_URL || 'http://127.0.0.1:8000';
const browser = await chromium.launch({headless:true});
const errors=[];
function assert(value,msg){if(!value)throw new Error('BROWSER SMOKE: '+msg);}
async function ready(page){
  page.on('pageerror', e=>errors.push(e.message));
  page.on('console', msg=>{if(msg.type()==='error')errors.push(msg.text());});
}
try {
  const page=await browser.newPage({viewport:{width:1366,height:900}});
  await ready(page);
  await page.goto(root+'/atlas/',{waitUntil:'networkidle'});
  await page.getByRole('heading',{name:'Find the teaching, then read the original.'}).waitFor();
  assert(await page.getByRole('button',{name:/knowledge, method, and spiritual development/i}).count()>0,'six-region navigation missing');
  await page.locator('#search').fill('Manas');
  await page.locator('#search-results [data-node="RS-09.05.01"]').first().click();
  await page.waitForURL(/#node=RS-09.05.01/);
  await page.getByText('spirit-self / Manas',{exact:true}).first().waitFor();
  assert(await page.getByRole('heading',{name:'Passage-linked relationships'}).count()===1,'concept page evidence panel missing');
  await page.goto(root+'/atlas/graph.html',{waitUntil:'networkidle'});
  await page.getByRole('heading',{name:'Follow the evidence between teachings'}).waitFor();
  const initial=await page.locator('#relations tr').count();
  assert(initial>=116,'expected at least 116 source-linked graph rows, got '+initial);
  await page.locator('#domain-filter').selectOption('07');
  const domainRows=await page.locator('#relations tr').count();
  assert(domainRows>0 && domainRows<initial,'domain filter not working');
  await page.locator('#domain-filter').selectOption('09');
  await page.locator('#evidence-filter').selectOption('editorial_comparison');
  const compared=await page.locator('#relations [data-edge]').count();
  assert(compared>=1 && compared<domainRows,'editorial filter not working');
  await page.locator('#clear-filters').click();
  assert(await page.locator('#relations tr').count()===initial,'reset filters failed');
  await page.locator('#source-filter').selectOption('SG-GA009-C01');
  const sourceRows=await page.locator('#relations [data-edge]').count();
  assert(sourceRows>0 && sourceRows<initial,'source filter failed');
  await page.locator('#relations [data-edge]').first().click();
  assert(await page.locator('#evidence-panel a[href*="rsarchive.org"]').count()>0,'outbound primary source missing');
  await page.goto(root+'/atlas/sources.html',{waitUntil:'networkidle'});
  await page.getByRole('heading',{name:'Find the original work behind a concept.'}).waitFor();
  const totalSources=await page.locator('#source-cards article').count();
  assert(totalSources>=27,'source guide has fewer than 27 original source cards');
  await page.locator('#filter-domain').selectOption('07');
  const limited=await page.locator('#source-cards article').count();
  assert(limited>0 && limited<totalSources,'source-guide domain filtering failed');
  await page.locator('#filter-kind').selectOption('recorded_lecture');
  const narrowed=await page.locator('#source-cards article').count();
  assert(narrowed>0 && narrowed<=limited,'source-guide work-kind filtering failed');
  await page.locator('#reset').click();
  assert(await page.locator('#source-cards article').count()===totalSources,'source-guide reset failed');
  assert(!errors.length,'console or page errors: '+errors.join('; '));
  console.log(JSON.stringify({ok:true,conceptSearch:true,domainRows,compared,sourceRows,totalRelationships:initial}));
  await page.close();
  const mobile=await browser.newPage({viewport:{width:390,height:844},isMobile:true,deviceScaleFactor:2});
  await ready(mobile);
  await mobile.goto(root+'/atlas/',{waitUntil:'networkidle'});
  await mobile.getByRole('heading',{name:'Find the teaching, then read the original.'}).waitFor();
  await mobile.goto(root+'/atlas/graph.html',{waitUntil:'networkidle'});
  await mobile.getByRole('heading',{name:'Follow the evidence between teachings'}).waitFor();
  assert(await mobile.locator('#source-filter').isVisible(),'mobile graph controls hidden');
  assert(!errors.length,'mobile console or page errors: '+errors.join('; '));
  await mobile.close();
  console.log('PASS: desktop + mobile atlas routes, search, source links, domain/evidence filtering');
} catch(e) {
  console.error(e);
  process.exitCode=1;
} finally { await browser.close(); }
