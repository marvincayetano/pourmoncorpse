import puppeteer from "puppeteer";

async function scrapeForSched() {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  const USERNAME: string = <string>process.env.FIT4LESS_USERNAME;
  const PASSWORD: string = <string>process.env.FIT4LESS_PASSWORD;

  // Goes to the main login page
  await page.goto(<string>process.env.FIT4LESS_URL_LOGIN, {
    waitUntil: "networkidle0",
  });

  await page.$eval(
    "#emailaddress",
    (el: Element, username: any) => ((<HTMLInputElement>el).value = username),
    USERNAME
  );

  await page.$eval(
    "#password",
    (el: Element, password: any) => ((<HTMLInputElement>el).value = password),
    PASSWORD
  );

  //   await page.$eval("#loginButton", (el: Element) =>
  //     (<HTMLInputElement>el).click()
  //   );

  //   await browser.close();
}

export { scrapeForSched };
