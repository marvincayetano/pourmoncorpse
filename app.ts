import { PrismaClient } from "@prisma/client";
import express, { Application, Request, Response } from "express";
import { scrapeForSched } from "./helpers/scrape";

const prisma: PrismaClient = new PrismaClient();
const app: Application = express();

// For testing
scrapeForSched();
// End for testing

// TWILLIO SETUP

// END TWILLIO SETUP

const port: number = parseInt(<string>process.env.PORT);

app.listen(port, function () {
  console.log(`App is listening on port ${port} !`);
});
