const express = require('express');
const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs'); 

const app = express();
const port = 3000;

// Nastavení statických souborů (HTML, JS)
app.use(express.static(path.join(__dirname)));

// Endpoint pro scraping
app.get('/scrape', async (req, res) => {
    const query = req.query.query;
    if (!query) {
        return res.status(400).send('Chybí klíčové slovo.');
    }

    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(`https://www.google.com/search?q=${encodeURIComponent(query)}`);

    const results = await page.evaluate(() => {
        const links = [];
        const items = document.querySelectorAll('.g');
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

    // Odeslání výsledků jako JSON
    res.json(results);
});

// Endpoint pro stažení výsledků jako soubor JSON
app.get('/download', async (req, res) => {
    const query = req.query.query;
    console.log('Received download request with query:', req.query.query);
    if (!query) {
        return res.status(400).send('Chybí klíčové slovo.');
    }

    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(`https://www.google.com/search?q=${encodeURIComponent(query)}`);

    const results = await page.evaluate(() => {
        const links = [];
        const items = document.querySelectorAll('.g');
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

    // Uložení výsledků do souboru JSON
    const fileName = `results-${query}.json`;
    const filePath = path.join(__dirname, fileName);
    fs.writeFileSync(filePath, JSON.stringify(results, null, 2));

    
    res.download(filePath, fileName, (err) => {
        if (err) {
            console.log('Chyba při stahování souboru:', err);
        } else {
            fs.unlinkSync(filePath); // Smazání souboru po stažení
        }
    });
});

// Spuštění serveru
app.listen(port, () => {
    console.log(`Server běží na http://localhost:${port}`);
});
