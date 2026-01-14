import { Request, Response } from "express";

export const createProgram = async (req: Request, res: Response) => {
  res.json({ message: "Program created (placeholder)" });
};
