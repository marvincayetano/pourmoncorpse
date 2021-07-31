import puppeteer from "puppeteer";

async function scrapeAddSched() {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

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

  const get_isMaximum = await page.$x(
    "//h2[text() = 'Maximum personal reservations reached']"
  );

  const reserved_slots = await page.$x(
    "//div[@class = 'reserved-slots']//div[@class = 'time-slot']"
  );

  try {
    const schedules = await page.evaluate(
      (...reserved_slots) =>
        reserved_slots.map((e) => {
          return {
            scheduleId: e.getAttribute("id") || e.innerText,
            location: e.getAttribute("data-slotclub"),
            date: e.getAttribute("data-slotdate"),
            time: e.getAttribute("data-slottime"),
          };
        }),
      ...reserved_slots
    );

    console.log("Booked schedules", schedules);

    const isMaximum = await page.evaluate(
      (...get_isMaximum) => get_isMaximum.map((e) => e.innerText),
      ...get_isMaximum
    );

    if (isMaximum.length === 0) {
      const getAvailScheds = await page.$x(
        "//div[@class = 'dialog-content']//div[contains(@id, 'date_')]"
      );

      const availScheds = await page.evaluate(
        (...getAvailScheds) =>
          getAvailScheds.map(
            (e, i) => `(${i}) ${e.innerText.replace(/^\s+|\s+$/g, "")}`
          ),
        ...getAvailScheds
      );

      console.log("Available dates", availScheds);

      const readline = require("readline").createInterface({
        input: process.stdin,
        output: process.stdout,
        terminal: false,
      });

      readline.question("Pick your date: ", async (pickedDate: number) => {
        await page.evaluate(
          (pickedDate: number, ...getAvailScheds) =>
            getAvailScheds[pickedDate].click(),
          pickedDate,
          ...getAvailScheds
        );

        await page.waitForNavigation();

        const addSchedule = await page.$x(
          "//div[@class = 'available-slots']//div[contains(@id, 'book_')]"
        );

        let bookedDate;

        await page.evaluate((...addSchedule) => {
          addSchedule.map((schedule, i) => {
            console.log(`(${i}) ${schedule.getAttrbute("data-slottime")}`);
          });

          readline.question("Pick your time: ", async (pickedTime: number) => {
            (bookedDate = "You booked on "),
              `${addSchedule[pickedTime].getAttribute(
                "data-slotdate"
              )} at ${addSchedule[pickedTime].getAttribute("data-slottime")}`;

            addSchedule[pickedTime].click();
          });
        }, ...addSchedule);

        // Click dialog button yes here
        await page.click(
          "div[class='modal-footer'] > button[id='dialog_book_yes']"
        );

        console.log(bookedDate);
        readline.close();
      });
    } else {
      console.log("Schedule is full");
    }
  } catch {
    return { err: "Error while loading" };
  } finally {
    await browser.close();
  }
}

export { scrapeAddSched };
