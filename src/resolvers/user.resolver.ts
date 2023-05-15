import {
  Arg,
  Ctx,
  Mutation,
  Query,
  Resolver,
  UseMiddleware,
} from "type-graphql";
import {
  User,
  CreateUserInput,
  LoginInput,
  IUser,
} from "../schemas/user.schema";
import UserService from "../services/user.service";
import Context from "../types/context.types";
import { authMiddleware } from "../middleware/auth.middleware";
import { AddBalanceInput, ITransaction, TransactionInput } from "../schemas/transaction.schema";

@Resolver()
export default class UserResolver {
  constructor(private userService: UserService) {
    this.userService = new UserService();
  }

  @UseMiddleware(authMiddleware)
  @Query(() => IUser, { nullable: true })
  async userProfile(@Ctx() context: Context) {
    return context.user;
  }

  @UseMiddleware(authMiddleware)
  @Query(() => [ITransaction], { nullable: true })
  async userTransactions(@Ctx() context: Context) {
    return await this.userService.getTransactionForUser(context);
  }

  @Mutation(() => IUser)
  async createUser(@Arg("input") input: CreateUserInput) {
    return this.userService.createUser(input);
  }

  @Mutation(() => String)
  login(@Arg("input") input: LoginInput) {
    return this.userService.login(input);
  }

  @UseMiddleware(authMiddleware)
  @Mutation(() => String)
  addBalance(@Arg("input") input: AddBalanceInput, @Ctx() context: Context) {
    return this.userService.addBalance(input, context.user?._id);
  }

  @UseMiddleware(authMiddleware)
  @Mutation(() => String)
  transfer(@Arg("input") input: TransactionInput, @Ctx() context: Context) {
    return this.userService.transferBalance(input, context.user?._id);
  }
}
