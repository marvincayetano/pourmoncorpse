import { Request, Response } from "express";
import MessagingResponse from "twilio/lib/twiml/MessagingResponse";

// Example text body from a person "register (username: Marvincayetano, password: Marvincayetano)"
const postSms = async (req: Request, res: Response) => {
  const twiml = new MessagingResponse();
  // When recieved this kind of text message
  // It will be registered to the database
  const exampleTextBody =
    "register (username: Marvincayetano, password: Marvincayetano)";

  const isRegister = exampleTextBody.split(" (")[0];
  if (isRegister.length) {
    // Do the register to the database here
  }

  twiml.message("The Robots are coming! Head for the hills!");

  res.writeHead(200, { "Content-Type": "text/xml" });
  res.end(twiml.toString());
};

export { postSms };
