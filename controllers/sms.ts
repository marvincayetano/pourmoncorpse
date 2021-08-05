import { Request, Response } from "express";

const postSms = async (req: Request, res: Response) => {
  res.send(true);
};

export { postSms };
