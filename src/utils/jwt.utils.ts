import jwt from "jsonwebtoken";
import { jwtSecret } from "../config";
import { ApolloError } from "apollo-server";
import { jwtPayload } from "../types/jwt.types";


export const generateToken = (user: jwtPayload): string => {
  const secret = jwtSecret!;
  const expiresIn = "24h";
  const token = jwt.sign({ id: user.id, email: user.email }, secret, {
    expiresIn,
  });
  return token;
};

export const verifyToken = (token: string): jwtPayload => {
  const secret = jwtSecret!;
  const decoded = jwt.verify(token, secret) as jwtPayload;
  if (!decoded) {
    throw new ApolloError("Invalid token");
  }
  return decoded;
};