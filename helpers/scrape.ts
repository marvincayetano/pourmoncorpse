import puppeteer from "puppeteer";

async function scrapeForSched() {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  let els;

  const USERNAME: string = <string>process.env.FIT4LESS_USERNAME;
  const PASSWORD: string = <string>process.env.FIT4LESS_PASSWORD;

  // Goes to the main login page
  try {
    await page.goto(<string>process.env.FIT4LESS_URL_LOGIN, {
      waitUntil: "networkidle0",
    });
  } catch (err) {
    console.log(err);
  }

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

  await page.$eval("#loginButton", (el: Element) =>
    (<HTMLInputElement>el).click()
  );

  await page.waitForNavigation();

  const reserved_slots = await page.$x(
    "//div[contains(@class, 'reserved-slots')]//div[@class = 'time-slot']"
  );

  //   <div id="cncl_84c0ae25-0828-4fa5-aba4-e99c5192172b" class="time-slot" data-slotclub="Ottawa Walkley Road" data-slotdate="Saturday, 31 July 2021" data-slottime="at 8:00 AM">

  els = await page.evaluate(
    (...reserved_slots) =>
      reserved_slots.map((e) => {
        return {
          scheduleId: e.getAttribute("id") || e.innerText,
          location: e.getAttribute("data-slotclub"),
          date: Date.parse(e.getAttribute("data-slotdate")),
          time: e.getAttribute("data-slottime"),
        };
      }),
    ...reserved_slots
  );

  console.log(els);
  //   await browser.close();
}

export { scrapeForSched };
