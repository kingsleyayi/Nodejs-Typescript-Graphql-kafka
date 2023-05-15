import { Request, Response } from "express";
import { IUser, User } from "../schemas/user.schema";

interface Context {
  req: Request;
  res: Response;
  user: IUser | null;
}

export default Context;
