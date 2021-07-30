import { PrismaClient } from "@prisma/client";
import express, { Application, Request, Response } from "express";
import { scrapeAddSched } from "./helpers/scrapers/scrapeAddSched";
import { scrapeGetSched } from "./helpers/scrapers/scrapeGetSched";

const prisma: PrismaClient = new PrismaClient();
const app: Application = express();

// For testing
scrapeAddSched();
// End for testing

// TWILLIO SETUP

// END TWILLIO SETUP

const port: number = parseInt(<string>process.env.PORT);

app.listen(port, function () {
  console.log(`App is listening on port ${port} !`);
});
