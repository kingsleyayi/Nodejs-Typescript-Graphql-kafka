import {
  getModelForClass,
  prop,
  pre,
  modelOptions,
} from "@typegoose/typegoose";
import bcrypt from "bcrypt";
import { IsEmail, IsNotEmpty, MaxLength, MinLength } from "class-validator";
import { Field, InputType, ObjectType } from "type-graphql";


@pre<IUser>("save", async function () {
  if (!this.isModified("password")) {
    return;
  }
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hashSync(this.password, salt);
  this.password = hash;
})


@ObjectType()
@modelOptions({ schemaOptions: { timestamps: true, collection: "users" } })
export class IUser {
  @Field(() => String)
  _id: string;

  @Field(() => String)
  @prop({ required: true })
  name: string;

  @Field(() => Number)
  @prop({ default: 0 })
  balance: number;

  @Field(() => String)
  @prop({ required: true })
  email: string;

  @prop({ required: true })
  password: string;
}


export const User = getModelForClass(IUser);

@InputType()
export class CreateUserInput {
  @Field(() => String)
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  @Field(() => String)
  email: string;

  @IsNotEmpty()
  @MinLength(6, {
    message: "password must be at least 6 characters long",
  })
  @MaxLength(50, {
    message: "password must not be longer than 50 characters",
  })
  @Field(() => String)
  password: string;
}

@InputType()
export class LoginInput {
  @IsEmail()
  @IsNotEmpty()
  @Field(() => String)
  email: string;

  @IsNotEmpty()
  @Field(() => String)
  password: string;
}