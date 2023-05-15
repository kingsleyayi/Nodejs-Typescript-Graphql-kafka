import mongoose, { Types } from "mongoose";
import { ITransaction, Transaction } from "../schemas/transaction.schema";
import { IUser } from "../schemas/user.schema";

class TransactionRepo {
  public static async create(transaction: ITransaction): Promise<ITransaction> {
    return await Transaction.create(transaction);
  }

  public static async userTransaction(
    userId: Types.ObjectId
  ): Promise<Array<ITransaction>> {
    const transactions = await Transaction.find({
      $or: [{ fromuserid: userId }, { touserid: userId }],
    });

    return transactions;
  }
}

export default TransactionRepo;
