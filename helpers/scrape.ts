const puppeteer = require("puppeteer");

async function scrapeForSched() {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto(<string>process.env.FIT4LESS_URL_LOGIN);

  await browser.close();
}

export { scrapeForSched };
