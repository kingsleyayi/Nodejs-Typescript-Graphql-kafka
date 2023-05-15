import { ApolloError } from "apollo-server";
import UserRepo from "../repositories/user.repository";
import { CreateUserInput, IUser, LoginInput } from "../schemas/user.schema";
import Context from "../types/context.types";
import bcrypt from "bcrypt";
import { generateToken } from "../utils/jwt.utils";
import { jwtPayload } from "../types/jwt.types";
import eventLogger from "./eventLogger";
import {
  AddBalanceInput,
  ITransaction,
  Transaction,
  TransactionInput,
} from "../schemas/transaction.schema";
import { TRANSACTIONSTATUS } from "../utils/enums.utils";
import { Types } from "mongoose";
import TransactionRepo from "../repositories/transaction.repository";
import { producer } from "../utils/kafka.utils";

class UserService {
  async createUser(input: CreateUserInput) {
    try {
      const { name, email, password } = input;
      const userData = await UserRepo.findOne({ email });

      if (userData) {
        throw "User already exist";
      }

      const user: IUser = new IUser();
      user.name = name;
      user.email = email;
      user.password = password;
      const data: IUser | null = await UserRepo.create(user);
      return data;
    } catch (error: any) {
      eventLogger.logError(error);
      throw new ApolloError(error);
    }
  }

  async login(input: LoginInput) {
    try {
      const { email, password } = input;

      const userData = await UserRepo.findOne({ email });
      if (!userData) {
        throw "Account does not exist";
      }
      const passwordIsValid = await bcrypt.compare(password, userData.password);
      if (!passwordIsValid) {
        throw "Invalid email or password";
      }
      const tokenDetail: jwtPayload = {
        id: userData._id.toString(),
        email: userData.email!,
      };
      const token = await generateToken(tokenDetail);
      return token;
    } catch (error: any) {
      eventLogger.logError(error);
      throw new ApolloError(error);
    }
  }

  async addBalance(input: AddBalanceInput, id: any) {
    try {
      const amount = input.amount;
      const userData = await UserRepo.findOne({ _id: id.toString() });
      if (!userData) {
        throw "User Not Found";
      }
      userData.balance += amount;
      await UserRepo.update(userData._id, { balance: userData.balance });
      return "successful";
    } catch (error: any) {
      eventLogger.logError(error);
      throw new ApolloError(error);
    }
  }

  async transferBalance(input: TransactionInput, id: any) {
    try {
      const { email, amount } = input;

      const sender = await UserRepo.findOne({ _id: id });
      if (!sender) {
        throw " sender not found";
      }

      const receiver = await UserRepo.findOne({ email });
      if (!receiver) {
        throw "receiver not found";
      }
      if (sender.balance < amount) {
        throw "not enough balance";
      }
      sender.balance -= amount;
      receiver.balance += amount;
      await UserRepo.update(sender._id, { balance: sender.balance });
      await UserRepo.update(receiver._id, { balance: receiver.balance });

      const transaction: ITransaction = new ITransaction();
      transaction.fromuserid = new Types.ObjectId(sender._id);
      transaction.touserid = new Types.ObjectId(receiver._id);
      transaction.amount = amount;
      transaction.status = TRANSACTIONSTATUS.SUCCESS;

      const data: ITransaction | null = await TransactionRepo.create(
        transaction
      );
      await producer.send({
        topic: 'transaction',
        messages: [
          { value: JSON.stringify(data)},
        ],
      });
      return "successful";
    } catch (error: any) {
      eventLogger.logError(error);
      throw new ApolloError(error);
    }
  }

  async getTransactionForUser(context: Context) {
    try {
      return await TransactionRepo.userTransaction(
        new Types.ObjectId(context.user?._id)
      );
    } catch (error: any) {
      eventLogger.logError(error);
      throw new ApolloError(error);
    }
  }
}

export default UserService;
