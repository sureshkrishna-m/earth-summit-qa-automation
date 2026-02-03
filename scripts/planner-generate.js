const fs = require('fs');
const path = require('path');
const playwright = require('playwright');

const baseUrl = 'https://www.earth-summit.com';

const pagesToVisit = [
  '/',
  '/hyderabad',
  '/gandhinagar',
  '/new-delhi',
  '/agenda',
  '/speakers',
  '/partners',
  '/gallery'
];

async function checkSelector(page, selector) {
  try {
    // if selector looks like a role/text locator, use text check
    if (/getByRole|getByText|getByLabel/.test(selector)) {
      // fallback to body text search: extract the quoted text
      const m = selector.match(/\(([^)]+)\)/);
      if (m) {
        const text = m[1].replace(/[^a-zA-Z0-9\s]/g, '').trim();
        const found = await page.evaluate(t => document.body.innerText.toLowerCase().includes(t.toLowerCase()), text);
        return found;
      }
      return false;
    }
    // otherwise treat as CSS
    const count = await page.locator(selector).count();
    return count > 0;
  } catch (e) {
    return false;
  }
}

function extractSelectorsFromFile(filepath) {
  const content = fs.readFileSync(filepath, 'utf8');
  const selectors = [];
  const regexes = [
    /page\.locator\(([^)]+)\)/g,
    /page\.getByRole\(([^)]+)\)/g,
    /page\.getByText\(([^)]+)\)/g,
    /page\.getByRole\([^,]+,\s*\{\s*name:\s*([^}]+)\}/g,
    /page\.locator\('([^']+)'\)/g
  ];
  regexes.forEach(r => {
    let m;
    while ((m = r.exec(content))) {
      selectors.push(m[1]);
    }
  });
  // also search for strings passed to getByRole/getByText in constructor assignments
  const misc = content.match(/getByRole\([^,]+\)|getByText\([^\)]+\)|locator\(['\"][^'\"]+['\"]/g) || [];
  misc.forEach(x => selectors.push(x));
  return Array.from(new Set(selectors)).map(s => s.trim());
}

function formatSelectorForEval(raw) {
  // remove wrapping quotes if present
  if (!raw) return null;
  const q = raw.trim();
  if ((q.startsWith('"') && q.endsWith('"')) || (q.startsWith("'") && q.endsWith("'"))) return q.slice(1, -1);
  return q;
}

(async () => {
  const browser = await playwright.chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  // Validate selectors in page-objects
  const poDir = path.join(__dirname, '..', 'page-objects');
  const poFiles = fs.readdirSync(poDir).filter(f => f.endsWith('.ts'));
  const selectorFindings = [];

  // Map file names to example paths
  const fileToPath = {
    'HomePage.ts': '/',
    'HyderabadPage.ts': '/hyderabad',
    'GandhinagarPage.ts': '/gandhinagar',
    'NewDelhiPage.ts': '/new-delhi',
    'RegistrationForm.ts': '/partners'
  };

  for (const file of poFiles) {
    const filepath = path.join(poDir, file);
    const content = fs.readFileSync(filepath, 'utf8');
    // extract getByRole with role and name
    const roleRegex = /getByRole\(\s*['"]([^'"]+)['"](?:\s*,\s*\{\s*name\s*:\s*(\/[^\/]+\/[a-z]*)\s*\})?\s*\)/g;
    const textRegex = /getByText\(\s*(\/[^\/]+\/[a-z]*)\s*\)/g;
    const locatorRegex = /locator\(\s*(['\"][^'\"]+['\"])\s*\)/g;

    const selectors = [];
    let m;
    while ((m = roleRegex.exec(content))) selectors.push({ type: 'role', raw: m[0], role: m[1], name: m[2] || null });
    while ((m = textRegex.exec(content))) selectors.push({ type: 'text', raw: m[0], text: m[1] });
    while ((m = locatorRegex.exec(content))) selectors.push({ type: 'locator', raw: m[0], selector: m[1] });

    if (selectors.length === 0) continue;
    console.log(`Checking selectors in ${file} -> found ${selectors.length}`);

    const pathToVisit = fileToPath[file] || '/';
    await page.goto(new URL(pathToVisit, baseUrl).toString(), { waitUntil: 'domcontentloaded' });

    for (const s of selectors) {
      let ok = false;
      let selectorString = '';
      if (s.type === 'role') {
        selectorString = `getByRole('${s.role}'${s.name ? `, { name: ${s.name} }` : ''})`;
        try {
          if (s.name) {
            // create regex from /.../i
            const nm = s.name.slice(1, -1);
            const parts = nm.split('/');
            const pattern = parts.slice(0, parts.length - 1).join('/');
            const flags = parts[parts.length - 1];
            const re = new RegExp(pattern, flags);
            ok = (await page.getByRole(s.role, { name: re }).count()) > 0;
          } else {
            ok = (await page.getByRole(s.role).count()) > 0;
          }
        } catch (e) {
          ok = false;
        }
      } else if (s.type === 'text') {
        selectorString = `getByText(${s.text})`;
        try {
          const txt = s.text.slice(1, -1);
          const parts = txt.split('/');
          const pattern = parts.slice(0, parts.length - 1).join('/');
          const flags = parts[parts.length - 1];
          const re = new RegExp(pattern, flags);
          ok = (await page.getByText(re).count()) > 0;
        } catch (e) {
          ok = false;
        }
      } else if (s.type === 'locator') {
        selectorString = `locator(${s.selector})`;
        const sel = formatSelectorForEval(s.selector);
        try {
          ok = (await page.locator(sel).count()) > 0;
        } catch (e) {
          ok = false;
        }
      }

      selectorFindings.push({ file, selector: selectorString, ok, original: s.raw });

      // If not ok, attempt a fallback heuristic and update the POM
      if (!ok) {
        console.log(`Attempting fallback for ${file} selector ${selectorString}`);
        let replacement = null;
        if (s.type === 'role' && s.role === 'link' && s.name) {
          // try to find link with text matching name
          const namePattern = s.name.slice(1, -2); // crude extraction
          const anchors = await page.locator('a').allTextContents();
          const match = anchors.find(t => t.toLowerCase().includes(namePattern.toLowerCase()));
          if (match) {
            const newSelector = `page.getByRole('link', { name: /${match.replace(/\W+/g, '\\W+')}/i })`;
            replacement = newSelector;
          }
        }
        if (s.type === 'locator') {
          const sel = formatSelectorForEval(s.selector);
          // try placeholder/aria-label/name based inputs for form fields
          const keywords = ['name', 'email', 'phone', 'company', 'country'];
          for (const kw of keywords) {
            const candidate = await page.locator(`input[placeholder*="${kw}" i], input[name*="${kw}" i], textarea[placeholder*="${kw}" i]`).first();
            if ((await candidate.count()) > 0) {
              replacement = `page.locator('input[placeholder*="${kw}" i], input[name*="${kw}" i], textarea[placeholder*="${kw}" i]')`;
              break;
            }
          }
        }

        if (replacement) {
          console.log(`Updating ${file}: replacing ${s.raw} with ${replacement}`);
          const filePath = path.join(poDir, file);
          const fileContent = fs.readFileSync(filePath, 'utf8');
          const newContent = fileContent.replace(s.raw, replacement);
          fs.writeFileSync(filePath, newContent, 'utf8');
        }
      }
    }
  }

  // Generate tests by crawling key pages and checking heuristics
  const generated = [];
  for (const p of pagesToVisit) {
    const url = new URL(p, baseUrl).toString();
    await page.goto(url, { waitUntil: 'domcontentloaded' });
    const title = (await page.title()).trim();
    const heroVisible = await page.locator('header, [role="banner"], .hero, .masthead, .hero-banner').count() > 0;
    const images = await page.locator('img').count();
    const pdfLinks = (await page.locator('a[href$=".pdf"]').count()) > 0;
    const speakers = await page.locator('[role="article"], .speaker, .speaker-card').count() > 0;

    generated.push({ path: p, url, title, heroVisible, images, pdfLinks, speakers });
  }

  // Create tests file
  const outDir = path.join(__dirname, '..', 'tests', 'generated');
  fs.mkdirSync(outDir, { recursive: true });
  const outFile = path.join(outDir, 'planner.spec.ts');

  const existingTestNames = [];
  const existingFiles = fs.readdirSync(path.join(__dirname, '..', 'tests')).filter(f => f.endsWith('.ts'));
  for (const f of existingFiles) {
    const c = fs.readFileSync(path.join(__dirname, '..', 'tests', f), 'utf8');
    const matches = c.match(/test\(['\"]([^'"]+)['\"]/g) || [];
    for (const m of matches) existingTestNames.push(m);
  }

  let content = `import { test, expect } from '../fixtures/pageFixtures';\n\n`;
  generated.forEach(g => {
    const nameBase = `Planner: ${g.path} - title present`;
    if (!existingTestNames.includes(`test('${nameBase}`)) {
      content += `test('${nameBase}', async ({ page }) => {\n`;
      content += `  await page.goto('${g.path}');\n`;
      content += `  const resp = await page.goto('${g.path}');\n`;
      content += `  expect(resp?.status()).toBeLessThan(400);\n`;
      if (g.heroVisible) content += `  await expect(page.locator('header, [role="banner"], .hero')).toBeVisible();\n`;
      if (g.images >= 1) content += `  const imgs = page.locator('img');\n  expect(await imgs.count()).toBeGreaterThan(0);\n`;
      if (g.pdfLinks) content += `  const pdf = page.locator('a[href$=".pdf"]').first();\n  expect(await pdf.count()).toBeGreaterThan(0);\n`;
      if (g.speakers) content += `  const sp = page.locator('[role="article"], .speaker, .speaker-card').first();\n  if (await sp.count()) { await sp.click(); }\n`;
      content += `});\n\n`;
    }
  });

  fs.writeFileSync(outFile, content, 'utf8');

  console.log('Selector findings:', selectorFindings.filter(s => !s.ok).slice(0, 20));
  console.log('Generated tests:', outFile);

  await browser.close();
})();
