import puppeteer, { ConsoleMessage } from "puppeteer";
import readline from "readline";

async function readLine(question: string): Promise<number> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false,
  });

  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(parseInt(answer));
    });
  });
}

async function scrapeAddSched() {
  const browser = await puppeteer.launch();
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

      console.log(
        `TODAY IS: ${new Date().toLocaleString("en-us", { weekday: "long" })}`
      );

      const pickedDate = await readLine("Pick your date: ");

      await page.evaluate(
        (pickedDate: number, ...getAvailScheds) => {
          getAvailScheds[pickedDate].click();
        },

        pickedDate,
        ...getAvailScheds
      );

      await page.waitForNavigation();

      const addSchedule = await page.$x(
        "//div[@class = 'available-slots']//div[contains(@id, 'book_')]"
      );

      const timeslots = await page.evaluate(
        (...addSchedule) =>
          addSchedule.map((time, i) => {
            return `(${i}) ${time.getAttribute("data-slottime")}`;
          }),
        ...addSchedule
      );

      console.log("Available timeslots ", timeslots);

      const pickedTime = await readLine("Pick your time: ");

      const bookedDate = await page.evaluate(
        (pickedTime: number, ...addSchedule) => {
          addSchedule[pickedTime].click();

          return `You booked on
              ${addSchedule[pickedTime].getAttribute(
                "data-slotdate"
              )} at ${addSchedule[pickedTime].getAttribute("data-slottime")}`;
        },

        pickedTime,
        ...addSchedule
      );

      // Click dialog button yes here
      await page.click(
        "div[class='modal-footer'] > button[id='dialog_book_yes']"
      );

      console.log(bookedDate);
    } else {
      console.log("Schedule is full");
      await browser.close();
    }
  } catch (err) {
    await browser.close();
    console.log(err);
    return { err: "Error while loading" };
  }
}

export { scrapeAddSched };
