import { getModelForClass, modelOptions, prop } from "@typegoose/typegoose";
import { IsEmail, IsNotEmpty, IsNumber } from "class-validator";
import mongoose, { Types } from "mongoose";
import { ObjectType, Field, InputType } from "type-graphql";

@ObjectType()
@modelOptions({
  schemaOptions: { timestamps: true, collection: "transactions" },
})
export class ITransaction {
  @Field(() => String)
  _id: string;

  @Field(() => String)
  @prop({ required: true })
  fromuserid: Types.ObjectId;

  @Field(() => String)
  @prop({ type: mongoose.Schema.Types.ObjectId, ref: "users" })
  touserid: Types.ObjectId;

  @Field(() => Number)
  @prop({ required: true })
  amount: number;

  @Field(() => String)
  @prop({ required: true })
  status: string;
}

export const Transaction = getModelForClass(ITransaction);

@InputType()
export class TransactionInput {
  @IsNotEmpty()
  @IsNumber()
  @Field(() => Number)
  amount: number;

  @IsEmail()
  @IsNotEmpty()
  @Field(() => String)
  email: string;
}

@InputType()
export class AddBalanceInput {
  @IsNotEmpty()
  @IsNumber()
  @Field(() => Number)
  amount: number;
}
