const puppeteer = require('puppeteer');

(async () => {
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    
    // Listen to all console messages
    page.on('console', msg => {
      if (msg.type() === 'error') {
        console.log('PAGE ERROR:', msg.text());
      }
    });
    
    page.on('pageerror', error => {
      console.log('PAGE EXCEPTION:', error.message);
    });

    console.log('Navigating to http://localhost:5173/login...');
    await page.goto('http://localhost:5173/login', { waitUntil: 'networkidle2' });
    
    // Wait for the errors array to populate
    await new Promise(r => setTimeout(r, 2000));
    
    const errors = await page.evaluate(() => window.__ERRORS || []);
    console.log('WINDOW __ERRORS:', errors);
    
    await browser.close();
  } catch (e) {
    console.error('Script failed:', e);
  }
})();
