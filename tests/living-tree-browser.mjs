import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {resolve} from 'node:path';

const runtimeModules = process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES;
const {chromium} = await (runtimeModules
  ? createRequire(resolve(runtimeModules, 'entry.cjs'))('playwright')
  : import('playwright'));
const root = process.env.ATLAS_URL || 'http://127.0.0.1:8000';
const browser = await chromium.launch({
  headless: true,
  executablePath: process.env.ATLAS_CHROMIUM_PATH || undefined,
});
const errors = [];

try {
  const page = await browser.newPage({viewport: {width: 1380, height: 900}});
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('response', (response) => {
    if (response.status() >= 400 && /\/living-tree/.test(response.url())) errors.push(response.url());
  });
  await page.goto(root + '/');
  await page.getByRole('link', {name: 'The Living Tree', exact: true}).click();
  await page.getByRole('heading', {name: 'The Living Tree', exact: true}).waitFor();
  await page.goto(root + '/atlas/planetary-tree.html');
  await page.getByRole('link', {name: 'Living Tree relationships'}).click();
  await page.getByRole('heading', {name: 'Tiphareth', exact: true}).waitFor();
  assert.equal(await page.locator('#tree-account').getAttribute('data-tradition'), 'comparative');
  await page.getByRole('link', {name: 'Sun', exact: true}).last().click();
  await page.getByRole('heading', {name: 'Sun', exact: true}).waitFor();
  await page.getByRole('button', {name: 'Spiritual heart germ', exact: true}).click();
  assert.match(await page.locator('#tree-account').innerText(), /Second Hierarchy/);
  await page.locator('#tree-account').getByRole('link', {name: 'Heart and circulation', exact: true}).click();
  await page.getByRole('heading', {name: 'Heart and circulation'}).waitFor();
  await page.getByRole('button', {name: 'Solar image of circulation'}).click();
  assert.match(await page.locator('#tree-account a').first().getAttribute('href'), /GA128/);
  await page.locator('#tree-account').getByRole('link', {name: 'Sun', exact: true}).click();
  await page.getByRole('button', {name: 'Spiritual heart germ'}).click();
  await page.locator('#tree-account').getByRole('link', {name: /Kyriotetes/}).click();
  await page.getByRole('button', {name: 'Bodily disposition and life'}).click();
  await page.locator('#tree-account').getByRole('link', {name: 'Old Saturn', exact: true}).click();
  await page.getByRole('button', {name: 'Offering and warmth'}).click();
  let passage = await page.locator('#tree-account').innerText();
  assert.match(passage, /Cherubim/);
  assert.match(passage, /outwardly as warmth/);
  assert.doesNotMatch(passage, /life body/);
  await page.locator('#tree-account').getByRole('link', {name: /Thrones/}).click();
  await page.getByRole('button', {name: 'World-system purpose'}).focus();
  await page.keyboard.press('Enter');
  passage = await page.locator('#tree-account').innerText();
  assert.match(passage, /Divine Trinity/);
  assert.match(passage, /GA 110/);
  assert.doesNotMatch(passage, /GA 132/);
  await page.getByLabel('Find a concept or source').fill('1909-04-14');
  assert.equal(await page.locator('#tree-concepts a').count(), 4);
  await page.getByLabel('Find a concept or source').fill('LT-R47');
  assert.equal(await page.locator('#tree-concepts a').count(), 2);
  await page.getByLabel('Find a concept or source').fill('Tiferet');
  assert.equal(await page.locator('#tree-concepts a').count(), 1);
  await page.getByRole('link', {name: 'Tiphareth', exact: true}).click();
  await page.getByLabel('View', {exact: true}).selectOption('steiner');
  await page.getByRole('heading', {name: /Thrones/}).waitFor();
  assert.equal(await page.getByRole('link', {name: 'Tiphareth', exact: true}).count(), 0);
  await page.getByLabel('Evidence', {exact: true}).selectOption('C');
  await page.getByText('No source accounts match the current evidence filter.').waitFor();

  const mobile = await browser.newPage({viewport: {width: 390, height: 844}, isMobile: true, hasTouch: true});
  mobile.on('pageerror', (error) => errors.push(error.message));
  await mobile.goto(root + '/atlas/living-cosmos.html?view=human&node=heart');
  await mobile.getByRole('link', {name: /Compare the source accounts/}).click();
  await mobile.getByRole('heading', {name: 'Heart and circulation'}).waitFor();
  assert.equal(await mobile.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
  assert.equal(await mobile.locator('#tree-account').getByRole('link', {name: /GA 128/}).isVisible(), true);
  await mobile.getByRole('button', {name: 'Spiritual heart germ'}).tap();
  assert.equal(await mobile.locator('#tree-account').getByRole('link', {name: /GA 231/}).isVisible(), true);
  assert.deepEqual(errors, []);
  console.log('Living Tree browser checks passed across desktop and mobile.');
} finally {
  await browser.close();
}
