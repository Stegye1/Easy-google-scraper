const puppeteer = require('puppeteer');
const fs = require('fs');

async function scrapeGoogle(query) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(`https://www.google.com/search?q=${encodeURIComponent(query)}`);

  // načítání výsledků a extrakce informací
  const results = await page.evaluate(() => {
    const links = [];
    const items = document.querySelectorAll('.g'); // výsledky vyhledávání mají třídu '.g'
    items.forEach(item => {
      const title = item.querySelector('h3') ? item.querySelector('h3').innerText : '';
      const link = item.querySelector('a') ? item.querySelector('a').href : '';
      if (title && link) {
        links.push({ title, link });
      }
    });
    return links;
  });

  await browser.close();
  return results;
}

// Uložení výsledků do souboru ve formátu JSON
async function saveResults(query) {
  const results = await scrapeGoogle(query);
  
  // Uložení JSON souboru na disk
  fs.writeFileSync(`${query}-results.json`, JSON.stringify(results, null, 2));
}

// Vložte klíčové slovo
const keyword = process.argv[2] || 'example query';
saveResults(keyword);
