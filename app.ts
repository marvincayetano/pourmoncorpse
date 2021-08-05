import { PrismaClient } from "@prisma/client";
import express, { Application } from "express";
import { postSms } from "./controllers/sms";
// import { scrapeAddSched } from "./helpers/scrapers/scrapeAddSched";

const prisma: PrismaClient = new PrismaClient();
const app: Application = express();

// For testing
// scrapeAddSched();
// End for testing

// TWILLIO SETUP
app.post("/sms", postSms);
// END TWILLIO SETUP

const port: number = parseInt(<string>process.env.PORT);

app.listen(port, function () {
  console.log(`App is listening on port ${port} !`);
});
