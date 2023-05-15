import { MiddlewareFn } from "type-graphql";
import { verifyToken } from "../utils/jwt.utils";
import { ApolloError } from "apollo-server";
import eventLogger from "../services/eventLogger";
import UserRepo from "../repositories/user.repository";

export const authMiddleware: MiddlewareFn<any> = async ({ context }, next) => {
  try {
    const token = context.req.headers.authorization;
    if (!token) {
      throw ("Authentication token is missing");
    }
    const details = await verifyToken(token);
    const id = details.id;
    const currentUser = await UserRepo.findOne({ _id: id });
    if (currentUser) {
      context.user = currentUser!;
    } else {
      throw "Invalid token";
    }
    return next();
  } catch (error: any) {
    eventLogger.logError(error);
    throw new ApolloError(error);
  }
};
