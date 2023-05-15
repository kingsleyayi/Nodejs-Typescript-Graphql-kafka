import { CreateUserInput, IUser, User } from "../schemas/user.schema";
import { MgFilterQuery, MgUpdateQuery } from "./mongoofe.types";

class UserRepo {
  public static async create(user: IUser): Promise<IUser> {
    return await User.create(user);
  }

  public static async findOne(
    params: MgFilterQuery<IUser>
  ): Promise<IUser | null> {
    return User.findOne(params);
  }

  public static async update(
    userId: string,
    update: MgUpdateQuery<IUser>
  ): Promise<IUser | null> {
    return User.findOneAndUpdate({ _id: userId }, update);
  }
}

export default UserRepo;
